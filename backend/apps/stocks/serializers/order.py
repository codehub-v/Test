from rest_framework import serializers

from apps.stocks.models import ProductionOrder


class ProductionOrderSerializer(serializers.ModelSerializer):

    product_name = serializers.CharField(
        source="product.identity",
        read_only=True
    )

    class Meta:
        model = ProductionOrder
        fields = [
            "id",
            "production_no",
            "product",
            "product_name",
            "quantity",
            "production_line",
            "status",
            "created_at",
            "completed_date",
            "remarks",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "status",
            "created_at",
            "completed_date",
        ]

    def validate_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "Production quantity must be greater than zero."
            )

        return value

class ProductionOrderWriteSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProductionOrder
        fields = [
            "production_no",
            "product",
            "quantity",
            "production_line",
            "remarks",
            "status",
        ]

    def validate_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "Production quantity must be greater than zero."
            )

        return value





from decimal import Decimal


from apps.stocks.models import (
    ProductionOrder,
    InventoryItem,
)


class ProductionOrderRetrieveSerializer(serializers.ModelSerializer):

    product_details = serializers.SerializerMethodField()
    status_display = serializers.CharField(
        source="get_status_display",
        read_only=True
    )
    material_availability = serializers.SerializerMethodField()

    class Meta:
        model = ProductionOrder
        fields = [
            "id",
            "uuid",
            "production_no",
            "product_details",
            "quantity",
            "production_line",
            "status",
            "status_display",
            "cutting_date",
            "stitching_date",
            "sewing_date",
            "finishing_date",
            "completed_date",
            "cancelled_date",
            "remarks",
            "material_availability",
            "created_at",
            "updated_at",
        ]

    def get_product_details(self, obj):
        product = obj.product

        return {
            "id": product.id,
            "uuid": str(product.uuid),
            "bom_number": product.bom_number,
            "identity": product.identity,
        }

    def get_material_availability(self, obj):

        materials = []
        all_available = True

        bom_items = obj.product.items.select_related(
            "fabric",
            "accessory",
            "color",
            "unit",
        )

        for item in bom_items:

            required_quantity = (
                Decimal(item.quantity)
                * Decimal(obj.quantity)
            )

            inventory_filter = {
                "color_id": item.color_id,
                "unit_id": item.unit_id,
            }

            if item.fabric_id:
                inventory_filter["fabric_id"] = item.fabric_id
                inventory_filter["accessory__isnull"] = True

                material_name = item.fabric.identity
                material_type = "Fabric"

            elif item.accessory_id:
                inventory_filter["accessory_id"] = item.accessory_id
                inventory_filter["fabric__isnull"] = True

                material_name = item.accessory.identity
                material_type = "Accessory"

            else:
                continue

            inventory = (
                InventoryItem.objects
                .filter(**inventory_filter)
                .first()
            )

            available_quantity = (
                inventory.quantity
                if inventory
                else Decimal("0")
            )

            is_available = (
                available_quantity >= required_quantity
            )

            if not is_available:
                all_available = False

            shortage_quantity = max(
                required_quantity - available_quantity,
                Decimal("0"),
            )

            materials.append({
                "bom_item_id": item.id,
                "material_type": material_type,
                "material_name": material_name,
                "color": item.color.identity,
                "unit": item.unit.identity,
                "quantity_per_product": item.quantity,
                "production_quantity": obj.quantity,
                "required_quantity": required_quantity,
                "available_quantity": available_quantity,
                "shortage_quantity": shortage_quantity,
                "is_available": is_available,
            })

        return {
            "can_start_cutting": all_available,
            "total_items": len(materials),
            "available_items": sum(
                1 for item in materials
                if item["is_available"]
            ),
            "insufficient_items": sum(
                1 for item in materials
                if not item["is_available"]
            ),
            "materials": materials,
        }


    