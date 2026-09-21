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
    
class ProductionOrderRetrieveSerializer(serializers.ModelSerializer):

    product_details = serializers.SerializerMethodField()

    status_display = serializers.CharField(
        source="get_status_display",
        read_only=True
    )

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
            "created_at",
            "updated_at",
        ]

    def get_product_details(self, obj):
        product = obj.product

        return {
            "id": product.id,
            "uuid": str(product.uuid),
            "identity": product.identity,
        }