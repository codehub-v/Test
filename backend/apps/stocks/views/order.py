from decimal import Decimal
from django.db import transaction
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.exceptions import ValidationError
from rest_framework.filters import SearchFilter
from rest_framework.viewsets import ModelViewSet

from apps.stocks.models import (
    ProductionOrder,
    InventoryItem,
    StockTransaction,
)

from apps.stocks.serializers import (
    ProductionOrderSerializer,
    ProductionOrderRetrieveSerializer,
    ProductionOrderWriteSerializer,
)


def get_inventory_for_bom_item(item, lock=False):

    filters = {
        "color_id": item.color_id,
        "unit_id": item.unit_id,
    }

    if item.fabric_id:
        filters.update({
            "fabric_id": item.fabric_id,
            "accessory__isnull": True,
        })

    elif item.accessory_id:
        filters.update({
            "accessory_id": item.accessory_id,
            "fabric__isnull": True,
        })

    else:
        return None

    queryset = InventoryItem.objects.filter(
        **filters
    )

    if lock:
        queryset = queryset.select_for_update()

    return queryset.first()


def get_bom_material_name(item):

    if item.fabric_id:
        return f"Fabric ID {item.fabric_id}"

    if item.accessory_id:
        return f"Accessory ID {item.accessory_id}"

    return "Unknown material"


class ProductionOrderViewSet(ModelViewSet):

    queryset = (
        ProductionOrder.objects
        .select_related("product")
        .prefetch_related("product__items")
        .all()
    )

    filter_backends = [
        SearchFilter,
        DjangoFilterBackend,
    ]

    search_fields = [
        "production_no",
        "product__bom_number",
        "product__identity",
        "production_line",
    ]

    filterset_fields = [
        "status",
        "production_line",
        "product",
    ]

    def get_serializer_class(self):

        if self.action == "list":
            return ProductionOrderSerializer

        if self.action == "retrieve":
            return ProductionOrderRetrieveSerializer

        return ProductionOrderWriteSerializer

    @transaction.atomic
    def update(self, request, *args, **kwargs):

        production = (
            ProductionOrder.objects
            .select_for_update()
            .select_related("product")
            .prefetch_related("product__items")
            .get(pk=kwargs["pk"])
        )

        old_status = production.status
        new_status = request.data.get(
            "status",
            old_status,
        )

        if (
            old_status == ProductionOrder.Status.WAITING
            and new_status == ProductionOrder.Status.CUTTING
        ):
            self.consume_inventory(production)

        return super().update(
            request,
            *args,
            **kwargs,
        )

    def consume_inventory(self, production):

        bom = production.product

        if bom.status != "active":
            raise ValidationError(
                "The selected BOM is inactive."
            )

        requirements = []

        for item in bom.items.all():

            required_quantity = (
                Decimal(item.quantity)
                * Decimal(production.quantity)
            )

            inventory = get_inventory_for_bom_item(
                item,
                lock=True,
            )

            material_name = get_bom_material_name(item)

            if not inventory:
                raise ValidationError(
                    f"Insufficient stock for {material_name}. "
                    f"No inventory available."
                )

            available_quantity = Decimal(
                inventory.quantity
            )

            if available_quantity < required_quantity:
                raise ValidationError(
                    f"Insufficient stock for {material_name}. "
                    f"Required: {required_quantity}, "
                    f"Available: {available_quantity}."
                )

            requirements.append({
                "inventory": inventory,
                "quantity": required_quantity,
            })

        for requirement in requirements:

            inventory = requirement["inventory"]
            required_quantity = requirement["quantity"]

            inventory.quantity = (
                Decimal(inventory.quantity)
                - required_quantity
            )

            inventory.save(
                update_fields=[
                    "quantity",
                    "updated_at",
                ]
            )

            StockTransaction.objects.create(
                item=inventory,
                transaction_in=Decimal("0"),
                transaction_out=required_quantity,
                quantity=required_quantity,
                notes=(
                    f"Material consumed for production "
                    f"{production.production_no}"
                ),
            )
            
            
class ProductionOrderMetaViewSet(ModelViewSet):
    pagination_class=None
    queryset = ProductionOrder.objects.filter(status = "COMPLETED")

    def get_serializer_class(self):

        return ProductionOrderSerializer
