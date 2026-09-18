from rest_framework import serializers
from apps.stocks.models import InventoryItem


class InventoryItemReadSerializer(serializers.ModelSerializer):

    fabric = serializers.StringRelatedField()
    accessory = serializers.StringRelatedField()
    color = serializers.StringRelatedField()
    unit = serializers.StringRelatedField()

    class Meta:
        model = InventoryItem
        fields = [
            "id",
            "uuid",
            "code",
            "fabric",
            "color",
            "unit",
            "accessory",
            "is_active",
        ]




class InventoryItemWriteSerializer(serializers.ModelSerializer):

    class Meta:
        model = InventoryItem
        fields = [
            "code",
            "fabric",
            "color",
            "unit",
            "accessory",
            "is_active",
        ]




class InventoryItemRetrieveSerializer(serializers.ModelSerializer):

    fabric_details = serializers.SerializerMethodField()
    accessory_details = serializers.SerializerMethodField()
    color_details = serializers.SerializerMethodField()
    unit_details = serializers.SerializerMethodField()

    class Meta:
        model = InventoryItem
        fields = [
            "id",
            "uuid",
            "code",
            "fabric_details",
            "color_details",
            "unit_details",
            "accessory_details",
            "is_active",
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
