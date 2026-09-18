from rest_framework import serializers

from apps.master.models import BOM, BOMItem


class BOMItemListSerializer(serializers.ModelSerializer):

    fabric_name = serializers.CharField(
        source="fabric.identity",
        read_only=True
    )

    accessory_name = serializers.CharField(
        source="accessory.identity",
        read_only=True
    )

    class Meta:
        model = BOMItem
        fields = [
            "id",
            "material_type",
            "fabric",
            "fabric_name",
            "accessory",
            "accessory_name",
            "quantity",
            "wastage",
        ]


class BOMListSerializer(serializers.ModelSerializer):

    style_name = serializers.CharField(
        source="style.identity",
        read_only=True
    )

    class Meta:
        model = BOM
        fields = [
            "id",
            "style",
            "style_name",
            "identity",
            "version",
            "is_active",
        ]


class BOMRetrieveSerializer(serializers.ModelSerializer):

    style_name = serializers.CharField(
        source="style.identity",
        read_only=True
    )

    items = BOMItemListSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = BOM
        fields = [
            "id",
            "style",
            "style_name",
            "identity",
            "version",
            "is_active",
            "items",
        ]


class BOMItemWriteSerializer(serializers.ModelSerializer):

    class Meta:
        model = BOMItem
        fields = [
            "material_type",
            "fabric",
            "accessory",
            "quantity",
            "wastage",
        ]


class BOMWriteSerializer(serializers.ModelSerializer):

    items = BOMItemWriteSerializer(
        many=True
    )

    class Meta:
        model = BOM
        fields = [
            "style",
            "identity",
            "version",
            "is_active",
            "items",
        ]

    def create(self, validated_data):

        items_data = validated_data.pop("items", [])

        bom = BOM.objects.create(
            **validated_data
        )

        BOMItem.objects.bulk_create([
            BOMItem(
                bom=bom,
                **item
            )
            for item in items_data
        ])

        return bom

    def update(self, instance, validated_data):

        items_data = validated_data.pop(
            "items",
            None
        )

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        if items_data is not None:

            instance.items.all().delete()

            BOMItem.objects.bulk_create([
                BOMItem(
                    bom=instance,
                    **item
                )
                for item in items_data
            ])

        return instance