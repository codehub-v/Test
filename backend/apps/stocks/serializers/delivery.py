
from rest_framework import serializers

from apps.stocks.models import Delivery


class DeliveryListSerializer(serializers.ModelSerializer):

    production_no = serializers.CharField(
        source="production_order.production_no",
        read_only=True
    )

    customer_name = serializers.CharField(
        source="production_order.customer.identity",
        read_only=True
    )

    product_name = serializers.CharField(
        source="production_order.product.identity",
        read_only=True
    )

    status_display = serializers.CharField(
        source="get_status_display",
        read_only=True
    )

    class Meta:
        model = Delivery

        fields = [
            "id",
            "delivery_no",
            "production_order",
            "production_no",
            "customer_name",
            "product_name",
            "quantity",
            "status",
            "status_display",
            "packed_at",
            "dispatched_at",
            "delivered_at",
            "delivery_address",
            "vehicle_number",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "status",
            "packed_at",
            "dispatched_at",
            "delivered_at",
            "created_at",
            "updated_at",
        ]

    def validate_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "Delivery quantity must be greater than zero."
            )

        return value


class DeliveryWriteSerializer(serializers.ModelSerializer):

    class Meta:
        model = Delivery

        fields = [
            "delivery_no",
            "production_order",
            "quantity",
            "delivery_address",
            "vehicle_number",
            "remarks",
        ]

    def validate_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "Delivery quantity must be greater than zero."
            )

        return value


class DeliveryRetrieveSerializer(serializers.ModelSerializer):

    production_details = serializers.SerializerMethodField()

    status_display = serializers.CharField(
        source="get_status_display",
        read_only=True
    )

    class Meta:
        model = Delivery

        fields = [
            "id",
            "uuid",
            "delivery_no",
            "production_details",
            "quantity",
            "status",
            "status_display",
            "packed_at",
            "dispatched_at",
            "delivered_at",
            "delivery_address",
            "vehicle_number",
            "remarks",
            "created_at",
            "updated_at",
        ]

    def get_production_details(self, obj):
        production = obj.production_order

        return {
            "id": production.id,
            "uuid": str(production.uuid),
            "production_no": production.production_no,
            "quantity": production.quantity,

            "customer": {
                "id": production.customer.id,
                "uuid": str(production.customer.uuid),
                "identity": production.customer.identity,
            },

            "product": {
                "id": production.product.id,
                "uuid": str(production.product.uuid),
                "identity": production.product.identity,
            },
        }
