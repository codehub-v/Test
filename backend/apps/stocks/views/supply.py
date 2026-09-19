from decimal import Decimal, InvalidOperation

from django.db import transaction
from django.db.models import F, Q

from rest_framework import status
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from apps.stocks.models import (
    SupplyOrder,
    SupplyOrderItem,
    InventoryItem,
)

from apps.stocks.serializers import (
    SupplyOrderListSerializer,
    SupplyOrderRetrieveSerializer,
    SupplyOrderWriteSerializer,
)


class SupplyOrderViewSet(ModelViewSet):

    queryset = (
        SupplyOrder.objects
        .select_related("supplier")
        .prefetch_related("items")
        .order_by("-id")
    )

    def get_queryset(self):

        queryset = super().get_queryset()

        params = self.request.query_params

        search = params.get("search")

        if search:
            queryset = queryset.filter(
                Q(order_number__icontains=search)
                | Q(supplier__identity__icontains=search)
            )

        status_filter = params.get("status")

        if status_filter:
            queryset = queryset.filter(
                status=status_filter
            )

        supplier = params.get("supplier")

        if supplier:
            queryset = queryset.filter(
                supplier_id=supplier
            )

        order_date = params.get("order_date")

        if order_date:
            queryset = queryset.filter(
                order_date=order_date
            )

        order_date_from = params.get("order_date_from")

        if order_date_from:
            queryset = queryset.filter(
                order_date__gte=order_date_from
            )

        order_date_to = params.get("order_date_to")

        if order_date_to:
            queryset = queryset.filter(
                order_date__lte=order_date_to
            )

        return queryset

    def get_serializer_class(self):

        if self.action == "list":
            return SupplyOrderListSerializer

        if self.action == "retrieve":
            return SupplyOrderRetrieveSerializer

        return SupplyOrderWriteSerializer

    @action(
        detail=True,
        methods=["post"],
        url_path="receive",
    )
    def receive(self, request, pk=None):

        with transaction.atomic():

            # Lock the supply order
            try:
                supply_order = (
                    SupplyOrder.objects
                    .select_for_update()
                    .get(pk=pk)
                )
            except SupplyOrder.DoesNotExist:
                raise ValidationError(
                    "Supply order not found."
                )

            # Cannot receive cancelled or completely received order
            if supply_order.status == "cancelled":
                raise ValidationError(
                    "Cannot receive stock for a cancelled order."
                )

            if supply_order.status == "received":
                raise ValidationError(
                    "This supply order has already been completely received."
                )

            items_data = request.data.get("items", [])

            if not items_data:
                raise ValidationError(
                    "At least one item is required."
                )

            received_item_ids = set()

            for data in items_data:

                item_id = data.get("item_id")
                quantity = data.get("quantity")

                # -----------------------------
                # Validate item ID
                # -----------------------------

                if not item_id:
                    raise ValidationError(
                        "item_id is required."
                    )

                if item_id in received_item_ids:
                    raise ValidationError(
                        f"Item {item_id} is duplicated."
                    )

                received_item_ids.add(item_id)

                # -----------------------------
                # Validate quantity
                # -----------------------------

                if quantity is None:
                    raise ValidationError(
                        f"Quantity is required for item {item_id}."
                    )

                try:
                    quantity = Decimal(str(quantity))
                except (InvalidOperation, ValueError, TypeError):
                    raise ValidationError(
                        f"Invalid quantity for item {item_id}."
                    )

                if quantity <= 0:
                    raise ValidationError(
                        f"Receive quantity must be greater than zero "
                        f"for item {item_id}."
                    )

                # -----------------------------
                # Get and lock supply item
                # -----------------------------

                try:
                    item = (
                        SupplyOrderItem.objects
                        .select_for_update()
                        .select_related(
                            "fabric",
                            "accessory",
                            "color",
                            "unit",
                        )
                        .get(
                            id=item_id,
                            supply_order=supply_order,
                        )
                    )
                except SupplyOrderItem.DoesNotExist:
                    raise ValidationError(
                        f"Supply order item {item_id} not found."
                    )

                # -----------------------------
                # Remaining quantity
                # -----------------------------

                remaining_quantity = (
                    item.ordered_quantity
                    - item.received_quantity
                )

                if remaining_quantity <= 0:
                    raise ValidationError(
                        f"Item {item.id} has already been fully received."
                    )

                if quantity > remaining_quantity:
                    raise ValidationError(
                        f"Only {remaining_quantity} is remaining "
                        f"for item {item.id}."
                    )

                # -----------------------------
                # Update received quantity
                # -----------------------------

                item.received_quantity += quantity

                item.save(
                    update_fields=[
                        "received_quantity",
                    ]
                )

                # -----------------------------
                # Find inventory item
                # -----------------------------

                inventory_filter = {
                    "color": item.color,
                    "unit": item.unit,
                }

                if item.fabric:

                    inventory_filter.update({
                        "fabric": item.fabric,
                        "accessory": None,
                    })

                elif item.accessory:

                    inventory_filter.update({
                        "accessory": item.accessory,
                        "fabric": None,
                    })

                else:
                    raise ValidationError(
                        f"Supply order item {item.id} "
                        f"has no fabric or accessory."
                    )

                # -----------------------------
                # Get inventory item
                # -----------------------------

                inventory = (
                    InventoryItem.objects
                    .select_for_update()
                    .filter(**inventory_filter)
                    .first()
                )

                # -----------------------------
                # Create inventory item
                # if it doesn't exist
                # -----------------------------

                if not inventory:

                    inventory = InventoryItem.objects.create(
                        **inventory_filter,
                        quantity=quantity,
                    )

                # -----------------------------
                # Increase existing inventory
                # -----------------------------

                else:

                    inventory.quantity = (
                        F("quantity") + quantity
                    )

                    inventory.save(
                        update_fields=["quantity"]
                    )

            # -----------------------------
            # Update Supply Order status
            # -----------------------------

            supply_order_items = (
                SupplyOrderItem.objects
                .filter(supply_order=supply_order)
            )

            all_received = all(
                item.received_quantity
                >= item.ordered_quantity
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