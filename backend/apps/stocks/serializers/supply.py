
from rest_framework import serializers
from apps.master.models import Supplier, Fabric, Accessory, Color, Unit
from apps.stocks.models import SupplyOrder, SupplyOrderItem


class SupplyOrderItemReadSerializer(serializers.ModelSerializer):

    fabric_identity = serializers.CharField(
        source="fabric.identity",
        read_only=True
    )

    accessory_identity = serializers.CharField(
        source="accessory.identity",
        read_only=True
    )

    color_identity = serializers.CharField(
        source="color.identity",
        read_only=True
    )

    unit_identity = serializers.CharField(
        source="unit.identity",
        read_only=True
    )

    remaining_quantity = serializers.SerializerMethodField()

    class Meta:
        model = SupplyOrderItem
        fields = [
            "id",
            "fabric",
            "fabric_identity",
            "accessory",
            "accessory_identity",
            "color",
            "color_identity",
            "unit",
            "unit_identity",
            "ordered_quantity",
            "received_quantity",
            "remaining_quantity",
        ]

    def get_remaining_quantity(self, obj):
        return max(
            obj.ordered_quantity - obj.received_quantity,
            0
        )


class SupplyOrderItemWriteSerializer(serializers.ModelSerializer):

    class Meta:
        model = SupplyOrderItem
        fields = [
            "fabric",
            "accessory",
            "color",
            "unit",
            "ordered_quantity",
        ]

    def validate(self, attrs):
        fabric = attrs.get("fabric")
        accessory = attrs.get("accessory")

        if fabric and accessory:
            raise serializers.ValidationError(
                "Select either fabric or accessory, not both."
            )

        if not fabric and not accessory:
            raise serializers.ValidationError(
                "Either fabric or accessory is required."
            )

        return attrs


class SupplyOrderListSerializer(serializers.ModelSerializer):

    supplier_identity = serializers.CharField(
        source="supplier.identity",
        read_only=True
    )

    class Meta:
        model = SupplyOrder
        fields = [
            "id",
            "order_number",
            "supplier",
            "supplier_identity",
            "order_date",
            "status",
            "created_at",
        ]


class SupplyOrderRetrieveSerializer(serializers.ModelSerializer):

    supplier_identity = serializers.CharField(
        source="supplier.identity",
        read_only=True
    )

    items = SupplyOrderItemReadSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = SupplyOrder
        fields = [
            "id",
            "order_number",
            "supplier",
            "supplier_identity",
            "order_date",
            "status",
            "notes",
            "items",
            "created_at",
            "updated_at",
        ]


class SupplyOrderWriteSerializer(serializers.ModelSerializer):

    items = SupplyOrderItemWriteSerializer(
        many=True
    )

    class Meta:
        model = SupplyOrder
        fields = [
            "supplier",
            "order_date",
            "notes",
            "items",
        ]

    def validate_items(self, value):
        if not value:
            raise serializers.ValidationError(
                "At least one item is required."
            )

        return value

    def create(self, validated_data):
        items_data = validated_data.pop("items")

        supply_order = SupplyOrder.objects.create(
            **validated_data
        )

        SupplyOrderItem.objects.bulk_create([
            SupplyOrderItem(
                supply_order=supply_order,
                **item_data
            )
            for item_data in items_data
        ])

        return supply_order

    def update(self, instance, validated_data):
        items_data = validated_data.pop("items", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if items_data is not None:

            if instance.items.filter(
                received_quantity__gt=0
            ).exists():
                raise serializers.ValidationError(
                    "Cannot modify items after stock has been received."
                )

            instance.items.all().delete()

            SupplyOrderItem.objects.bulk_create([
                SupplyOrderItem(
                    supply_order=instance,
                    **item_data
                )
                for item_data in items_data
            ])

        instance.save()

        return instance