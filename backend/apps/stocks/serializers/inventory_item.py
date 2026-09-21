from decimal import Decimal

from django.db.models import Sum

from rest_framework import serializers

from apps.stocks.models import (
    InventoryItem,
    SupplyOrderItem,
    ProductionOrder,
)


class InventoryItemMetaSerializer(serializers.ModelSerializer):

    fabric = serializers.StringRelatedField()
    accessory = serializers.StringRelatedField()
    color = serializers.StringRelatedField()
    unit = serializers.StringRelatedField()

    material_name = serializers.SerializerMethodField()

    class Meta:
        model = InventoryItem
        fields = [
            "id",
            "uuid",
            "fabric",
            "accessory",
            "material_name",
            "color",
            "unit",
            "is_active",
        ]

    def get_material_name(self, obj):

        color = obj.color.identity

        if obj.fabric:
            material = obj.fabric.identity
        elif obj.accessory:
            material = obj.accessory.identity
        else:
            material = ""

        return f"{color} - {material}"


class InventoryItemReadSerializer(serializers.ModelSerializer):

    fabric = serializers.StringRelatedField()
    accessory = serializers.StringRelatedField()
    color = serializers.StringRelatedField()
    unit = serializers.StringRelatedField()

    supply_waiting = serializers.SerializerMethodField()
    production_requirement = serializers.SerializerMethodField()

    class Meta:
        model = InventoryItem
        fields = [
            "id",
            "uuid",
            "fabric",
            "color",
            "unit",
            "accessory",
            "quantity",
            "is_active",
            "supply_waiting",
            "production_requirement",
        ]

    def get_supply_waiting(self, obj):

        filters = {
            "supply_order__status": "ordered",
            "color_id": obj.color_id,
        }

        if obj.fabric_id:
            filters["fabric_id"] = obj.fabric_id
            filters["accessory__isnull"] = True

        elif obj.accessory_id:
            filters["accessory_id"] = obj.accessory_id
            filters["fabric__isnull"] = True

        else:
            return Decimal("0.00")

        quantity = (
            SupplyOrderItem.objects
            .filter(**filters)
            .aggregate(
                total=Sum("ordered_quantity")
            )["total"]
        )

        return quantity or Decimal("0.00")

    def get_production_requirement(self, obj):

        total = Decimal("0.00")

        production_orders = (
            ProductionOrder.objects
            .filter(
                status=ProductionOrder.Status.WAITING
            )
            .select_related("product")
            .prefetch_related("product__items")
        )

        for production in production_orders:

            for item in production.product.items.all():

                if (
                    item.fabric_id != obj.fabric_id
                    or item.accessory_id != obj.accessory_id
                    or item.color_id != obj.color_id
                    or item.unit_id != obj.unit_id
                ):
                    continue

                total += (
                    Decimal(item.quantity)
                    * Decimal(production.quantity)
                )

        return total


class InventoryItemWriteSerializer(serializers.ModelSerializer):

    class Meta:
        model = InventoryItem
        fields = [
            "fabric",
            "color",
            "unit",
            "accessory",
            "is_active",
            "quantity",
        ]


class InventoryItemRetrieveSerializer(serializers.ModelSerializer):

    fabric_details = serializers.SerializerMethodField()
    accessory_details = serializers.SerializerMethodField()
    color_details = serializers.SerializerMethodField()
    unit_details = serializers.SerializerMethodField()

    supply_waiting = serializers.SerializerMethodField()
    production_requirement = serializers.SerializerMethodField()

    class Meta:
        model = InventoryItem
        fields = [
            "id",
            "uuid",
            "fabric_details",
            "color_details",
            "unit_details",
            "accessory_details",
            "quantity",
            "is_active",
            "supply_waiting",
            "production_requirement",
        ]

    def get_fabric_details(self, obj):

        if not obj.fabric:
            return None

        return {
            "id": obj.fabric.id,
            "uuid": str(obj.fabric.uuid),
            "identity": obj.fabric.identity,
        }

    def get_accessory_details(self, obj):

        if not obj.accessory:
            return None

        return {
            "id": obj.accessory.id,
            "uuid": str(obj.accessory.uuid),
            "identity": obj.accessory.identity,
        }

    def get_color_details(self, obj):

        return {
            "id": obj.color.id,
            "uuid": str(obj.color.uuid),
            "identity": obj.color.identity,
        }

    def get_unit_details(self, obj):

        return {
            "id": obj.unit.id,
            "uuid": str(obj.unit.uuid),
            "identity": obj.unit.identity,
        }

    def get_supply_waiting(self, obj):

        filters = {
            "supply_order__status": "ordered",
            "color_id": obj.color_id,
        }

        if obj.fabric_id:
            filters["fabric_id"] = obj.fabric_id
            filters["accessory__isnull"] = True

        elif obj.accessory_id:
            filters["accessory_id"] = obj.accessory_id
            filters["fabric__isnull"] = True

        else:
            return Decimal("0.00")

        quantity = (
            SupplyOrderItem.objects
            .filter(**filters)
            .aggregate(
                total=Sum("ordered_quantity")
            )["total"]
        )

        return quantity or Decimal("0.00")

    def get_production_requirement(self, obj):

        total = Decimal("0.00")

        production_orders = (
            ProductionOrder.objects
            .filter(
                status=ProductionOrder.Status.WAITING
            )
            .select_related("product")
            .prefetch_related("product__items")
        )

        for production in production_orders:

            for item in production.product.items.all():

                if (
                    item.fabric_id != obj.fabric_id
                    or item.accessory_id != obj.accessory_id
                    or item.color_id != obj.color_id
                    or item.unit_id != obj.unit_id
                ):
                    continue

                total += (
                    Decimal(item.quantity)
                    * Decimal(production.quantity)
                )

        return total