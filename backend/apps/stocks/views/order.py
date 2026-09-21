from django.db import transaction
from django.utils import timezone

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
)


class ProductionOrderViewSet(ModelViewSet):

    queryset = ProductionOrder.objects.all()

    serializer_class = ProductionOrderSerializer

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
            .prefetch_related("product__items")
            .get(pk=pk)
        )

        # Only WAITING production can be started
        if production.status != ProductionOrder.Status.WAITING:
            raise ValidationError(
                "Only waiting production can be started."
            )

        bom = production.product

        if not bom.is_active:
            raise ValidationError(
                "The selected BOM is not active."
            )

        # ------------------------------------------------
        # Calculate required materials
        # ------------------------------------------------

        required_materials = []

        for item in bom.items.all():

            # BOM quantity represents the production quantity
            # for which the BOM was created.
            base_quantity = (
                item.quantity
                * production.quantity
                / bom.quantity
            )

            # Add wastage
            wastage = (
                base_quantity
                * item.wastage_percentage
                / 100
            )

            required_quantity = (
                base_quantity + wastage
            )

            material = (
                item.fabric
                if item.fabric_id
                else item.accessory
            )

            required_materials.append({
                "material": material,
                "quantity": required_quantity,
            })

        # ------------------------------------------------
        # Check inventory
        # ------------------------------------------------

        for requirement in required_materials:

            material = requirement["material"]
            required_quantity = requirement["quantity"]

            inventory = (
                InventoryItem.objects
                .select_for_update()
                .filter(
                    # Change this field according to your
                    # InventoryItem model.
                    material=material
                )
                .first()
            )

            if not inventory:
                raise ValidationError(
                    f"No inventory found for {material}."
                )

            if inventory.quantity < required_quantity:
                raise ValidationError(
                    f"Insufficient stock for {material}. "
                    f"Required: {required_quantity}, "
                    f"Available: {inventory.quantity}."
                )

        # ------------------------------------------------
        # Deduct inventory
        # ------------------------------------------------

        for requirement in required_materials:

            material = requirement["material"]
            required_quantity = requirement["quantity"]

            inventory = (
                InventoryItem.objects
                .select_for_update()
                .get(
                    material=material
                )
            )

            inventory.quantity -= required_quantity

            inventory.save(
                update_fields=["quantity"]
            )

        # ------------------------------------------------
        # Start production
        # ------------------------------------------------

        production.status = ProductionOrder.Status.CUTTING
        production.start_date = timezone.now().date()

        production.save(
            update_fields=[
                "status",
                "start_date",
                "updated_at",
            ]
        )

        return Response(
            {
                "message": "Production started successfully.",
                "production_no": production.production_no,
                "status": production.status,
            },
            status=status.HTTP_200_OK
        )