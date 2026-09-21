from decimal import Decimal

from django.db import transaction
from rest_framework.viewsets import ModelViewSet
from rest_framework.exceptions import ValidationError

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


class ProductionOrderViewSet(ModelViewSet):

    queryset = ProductionOrder.objects.select_related(
        "product"
    ).all()

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
            old_status
        )

        if (
            old_status == ProductionOrder.Status.WAITING
            and new_status == ProductionOrder.Status.CUTTING
        ):
            self.consume_inventory(production)

        response = super().update(
            request,
            *args,
            **kwargs
        )

        return response

    @transaction.atomic
    def partial_update(self, request, *args, **kwargs):

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
            old_status
        )

        if (
            old_status == ProductionOrder.Status.WAITING
            and new_status == ProductionOrder.Status.CUTTING
        ):
            self.consume_inventory(production)

        response = super().partial_update(
            request,
            *args,
            **kwargs
        )

        return response


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

            inventory_filter = {
                "color_id": item.color_id,
                "unit_id": item.unit_id,
            }

            if item.fabric_id:
                inventory_filter["fabric_id"] = item.fabric_id

            if item.accessory_id:
                inventory_filter["accessory_id"] = item.accessory_id

            inventory = (
                InventoryItem.objects
                .select_for_update()
                .filter(**inventory_filter)
                .first()
            )

            material_name = inventory_material_name(item)

            if not inventory:
                raise ValidationError(
                    f"Insufficient stock for {material_name}. "
                    f"No inventory available."
                )

            if inventory.quantity < required_quantity:
                raise ValidationError(
                    f"Insufficient stock for {material_name}. "
                    f"Required: {required_quantity}, "
                    f"Available: {inventory.quantity}."
                )

            requirements.append(
                {
                    "inventory": inventory,
                    "quantity": required_quantity,
                }
            )

        for requirement in requirements:

            inventory = requirement["inventory"]
            required_quantity = requirement["quantity"]

            inventory.quantity -= required_quantity

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


def inventory_material_name(item):

    if item.fabric_id:
        return f"Fabric ID {item.fabric_id}"

    if item.accessory_id:
        return f"Accessory ID {item.accessory_id}"

    return "Unknown material"