from decimal import Decimal

from django.db import transaction
from django.db.models import Prefetch

from rest_framework import status
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from apps.stocks.models import (
    ProductionOrder,
    InventoryItem,
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

    @action(
        detail=True,
        methods=["post"],
        url_path="start"
    )
    @transaction.atomic
    def start_production(self, request, pk=None):

        production = (
            ProductionOrder.objects
            .select_for_update()
            .select_related("product")
            .prefetch_related(
                "product__items"
            )
            .filter(pk=pk)
            .first()
        )

        if not production:
            raise ValidationError(
                "Production order not found."
            )

        if production.status != ProductionOrder.Status.WAITING:
            raise ValidationError(
                "Only waiting production can be started."
            )

        bom = production.product

        if not bom.is_active:
            raise ValidationError(
                "The selected BOM is not active."
            )

        if bom.quantity <= 0:
            raise ValidationError(
                "BOM quantity must be greater than zero."
            )

        required_materials = []

        for item in bom.items.all():

            if not item.fabric_id and not item.accessory_id:
                continue

            base_quantity = (
                Decimal(item.quantity)
                * Decimal(production.quantity)
                / Decimal(bom.quantity)
            )

            wastage_quantity = (
                base_quantity
                * Decimal(item.wastage_percentage)
                / Decimal("100")
            )

            required_quantity = (
                base_quantity + wastage_quantity
            )

            required_materials.append({
                "fabric_id": item.fabric_id,
                "accessory_id": item.accessory_id,
                "color_id": item.color_id,
                "unit_id": item.unit_id,
                "quantity": required_quantity,
            })

        for requirement in required_materials:

            inventory_filter = {
                "quantity__gt": 0,
                "is_active": True,
            }

            if requirement["fabric_id"]:
                inventory_filter["fabric_id"] = (
                    requirement["fabric_id"]
                )

            if requirement["accessory_id"]:
                inventory_filter["accessory_id"] = (
                    requirement["accessory_id"]
                )

            if requirement["color_id"]:
                inventory_filter["color_id"] = (
                    requirement["color_id"]
                )

            if requirement["unit_id"]:
                inventory_filter["unit_id"] = (
                    requirement["unit_id"]
                )

            inventory = (
                InventoryItem.objects
                .select_for_update()
                .filter(**inventory_filter)
                .first()
            )

            if not inventory:

                material_name = (
                    inventory_material_name(
                        requirement
                    )
                )

                raise ValidationError(
                    f"No inventory found for {material_name}."
                )

            required_quantity = requirement["quantity"]

            if inventory.quantity < required_quantity:

                material_name = (
                    inventory_material_name(
                        requirement
                    )
                )

                raise ValidationError(
                    f"Insufficient stock for {material_name}. "
                    f"Required: {required_quantity}, "
                    f"Available: {inventory.quantity}."
                )

            inventory.quantity -= required_quantity

            inventory.save(
                update_fields=[
                    "quantity",
                    "updated_at",
                ]
            )

        production.status = ProductionOrder.Status.CUTTING

        production.save(
            update_fields=[
                "status",
                "cutting_date",
                "updated_at",
            ]
        )

        return Response(
            {
                "message": "Production started successfully.",
                "production_no": production.production_no,
                "status": production.status,
                "cutting_date": production.cutting_date,
            },
            status=status.HTTP_200_OK
        )


def inventory_material_name(requirement):

    if requirement["fabric_id"]:
        return f"Fabric ID {requirement['fabric_id']}"

    if requirement["accessory_id"]:
        return f"Accessory ID {requirement['accessory_id']}"

    return "Unknown material"