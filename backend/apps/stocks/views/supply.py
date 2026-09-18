from decimal import Decimal

from django.db import transaction
from django.db.models import F

from rest_framework import status
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from apps.stocks.models import SupplyOrder, SupplyOrderItem
from apps.stocks.serializers import (
    SupplyOrderListSerializer,
    SupplyOrderRetrieveSerializer,
    SupplyOrderWriteSerializer,
)

from apps.stocks.models import InventoryItem

class SupplyOrderViewSet(ModelViewSet):

    queryset = SupplyOrder.objects.select_related(
        "supplier"
    ).prefetch_related(
        "items"
    ).order_by("-id")

    def get_serializer_class(self):

        if self.action == "list":
            return SupplyOrderListSerializer

        if self.action == "retrieve":
            return SupplyOrderRetrieveSerializer

        return SupplyOrderWriteSerializer
    @action(
        detail=True,
        methods=["post"],
        url_path="receive"
    )
    def receive(self, request, pk=None):

        supply_order = self.get_object()

        if supply_order.status in ["cancelled", "received"]:
            raise ValidationError(
                f"Cannot receive stock for a "
                f"{supply_order.status} order."
            )

        items_data = request.data.get("items", [])

        if not items_data:
            raise ValidationError(
                "At least one item is required."
            )

        with transaction.atomic():

            for data in items_data:

                item_id = data.get("item_id")
                quantity = data.get("quantity")

                if not item_id:
                    raise ValidationError(
                        "item_id is required."
                    )

                if quantity is None:
                    raise ValidationError(
                        "quantity is required."
                    )

                try:
                    quantity = Decimal(str(quantity))
                except Exception:
                    raise ValidationError(
                        "Invalid quantity."
                    )

                if quantity <= 0:
                    raise ValidationError(
                        "Receive quantity must be greater than zero."
                    )

                # Lock supply order item
                item = (
                    SupplyOrderItem.objects
                    .select_for_update()
                    .select_related(
                        "fabric",
                        "accessory",
                        "color",
                    )
                    .get(
                        id=item_id,
                        supply_order=supply_order,
                    )
                )

                remaining_quantity = (
                    item.ordered_quantity
                    - item.received_quantity
                )

                if quantity > remaining_quantity:
                    raise ValidationError(
                        f"Only {remaining_quantity} "
                        f"is remaining for item {item.id}."
                    )

                # Update received quantity
                item.received_quantity += quantity

                item.save(
                    update_fields=[
                        "received_quantity"
                    ]
                )

                # -------------------------------------------------
                # Update Inventory
                # -------------------------------------------------

                inventory_filter = {
                    "color": item.color,
                }

                if item.fabric:
                    inventory_filter["fabric"] = item.fabric
                    inventory_filter["accessory"] = None

                elif item.accessory:
                    inventory_filter["accessory"] = item.accessory
                    inventory_filter["fabric"] = None

                inventory = (
                    InventoryItem.objects
                    .select_for_update()
                    .filter(**inventory_filter)
                    .first()
                )

                if not inventory:
                    raise ValidationError(
                        f"Inventory item not found for "
                        f"Supply Order Item {item.id}."
                    )

                inventory.quantity = (
                    F("quantity") + quantity
                )

                inventory.save(
                    update_fields=["quantity"]
                )

            # -----------------------------------------------------
            # Update Supply Order Status
            # -----------------------------------------------------

            supply_order_items = supply_order.items.all()

            all_received = all(
                item.received_quantity >= item.ordered_quantity
                for item in supply_order_items
            )

            any_received = any(
                item.received_quantity > 0
                for item in supply_order_items
            )

            if all_received:
                supply_order.status = "received"

            elif any_received:
                supply_order.status = "partial"

            else:
                supply_order.status = "ordered"

            supply_order.save(
                update_fields=[
                    "status",
                    "updated_at",
                ]
            )

        return Response(
            {
                "message": "Supply received successfully.",
                "status": supply_order.status,
            },
            status=status.HTTP_200_OK,
        )