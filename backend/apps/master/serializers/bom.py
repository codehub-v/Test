from rest_framework import serializers

from apps.master.models import BOM, BOMItem


class BOMItemReadSerializer(serializers.ModelSerializer):

    fabric_identity = serializers.CharField(
        source="fabric.identity",
        read_only=True,
    )

    accessory_identity = serializers.CharField(
        source="accessory.identity",
        read_only=True,
    )

    color_identity = serializers.CharField(
        source="color.identity",
        read_only=True,
    )

    unit_identity = serializers.CharField(
        source="unit.identity",
        read_only=True,
    )

    material_type = serializers.SerializerMethodField()

    material_identity = serializers.SerializerMethodField()

    class Meta:
        model = BOMItem

        fields = [
            "id",

            "fabric",
            "fabric_identity",

            "accessory",
            "accessory_identity",

            "material_type",
            "material_identity",

            "color",
            "color_identity",

            "unit",
            "unit_identity",

            "quantity",

            "created_at",
        ]

    def get_material_type(self, obj):

        if obj.fabric:
            return "Fabric"

        if obj.accessory:
            return "Accessory"

        return "-"

    def get_material_identity(self, obj):

        if obj.fabric:
            return obj.fabric.identity

        if obj.accessory:
            return obj.accessory.identity

        return "-"


class BOMItemWriteSerializer(serializers.ModelSerializer):

    class Meta:
        model = BOMItem

        fields = [
            "fabric",
            "accessory",
            "color",
            "unit",
            "quantity",
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

        quantity = attrs.get("quantity")

        if quantity is not None and quantity <= 0:
            raise serializers.ValidationError(
                "Quantity must be greater than zero."
            )

        return attrs


class BOMListSerializer(serializers.ModelSerializer):

    class Meta:
        model = BOM

        fields = [
            "id",
            "bom_number",
            "identity",
            "status",
            "created_at",
            "updated_at",
        ]


class BOMRetrieveSerializer(serializers.ModelSerializer):

    items = BOMItemReadSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = BOM

        fields = [
            "id",
            "bom_number",
            "identity",
            "status",
            "notes",
            "items",
            "created_at",
            "updated_at",
        ]


class BOMWriteSerializer(serializers.ModelSerializer):

    items = BOMItemWriteSerializer(
        many=True,
    )

    class Meta:
        model = BOM

        fields = [
            "identity",
            "status",
            "notes",
            "items",
        ]

    def validate_items(self, value):

        if not value:
            raise serializers.ValidationError(
                "At least one BOM item is required."
            )

        return value

    def create(self, validated_data):

        items_data = validated_data.pop("items")

        bom = BOM.objects.create(
            **validated_data
        )

        BOMItem.objects.bulk_create(
            [
                BOMItem(
                    bom=bom,
                    **item_data,
                )
                for item_data in items_data
            ]
        )

        return bom

    def update(self, instance, validated_data):

        items_data = validated_data.pop(
            "items",
            None,
        )

        # Update BOM fields
        for attr, value in validated_data.items():
            setattr(
                instance,
                attr,
                value,
            )

        instance.save()

        # Update BOM items
        if items_data is not None:

            instance.items.all().delete()

            BOMItem.objects.bulk_create(
                [
                    BOMItem(
                        bom=instance,
                        **item_data,
                    )
                    for item_data in items_data
                ]
            )

        return instance