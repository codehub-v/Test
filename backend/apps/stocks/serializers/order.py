from rest_framework import serializers

from apps.stocks.models import ProductionOrder


class ProductionOrderSerializer(serializers.ModelSerializer):

    product_name = serializers.CharField(
        source="product.style.identity",
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
            "start_date",
            "completed_date",
            "remarks",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "status",
            "start_date",
            "completed_date",
        ]

    def validate_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "Production quantity must be greater than zero."
            )

        return value