from rest_framework import serializers
from apps.stocks.models import StockItem


class StockItemReadSerializer(serializers.ModelSerializer):

    item = serializers.SerializerMethodField()
    supply_waiting = serializers.SerializerMethodField()
    production_requirement = serializers.SerializerMethodField()

    class Meta:
        model = StockItem
        fields = [
            "id",
            "uuid",
            "item",
            "quantity",
            "supply_waiting",
            "production_requirement",
        ]

    def get_item(self, obj):

        item = obj.item

        color = item.color.identity

        if item.fabric:
            material = item.fabric.identity

        elif item.accessory:
            material = item.accessory.identity

        else:
            material = ""

        return f"{color} - {material}"

    def get_supply_waiting(self, obj):
        return 0

    def get_production_requirement(self, obj):
        return 0


class StockItemWriteSerializer(serializers.ModelSerializer):

    class Meta:
        model = StockItem
        fields = [
            "item",
            "quantity",
        ]