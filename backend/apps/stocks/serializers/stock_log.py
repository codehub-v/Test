from rest_framework import serializers
from apps.stocks.models import StockTransaction


class StockTransactionReadSerializer(serializers.ModelSerializer):

    item = serializers.SerializerMethodField()
    class Meta:
        model = StockTransaction
        fields = [
            "id",
            "uuid",
            "item",
            "transaction_in",
            "transaction_out",
            "quantity",
            "notes",
            "transaction_date",
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

class StockTransactionWriteSerializer(serializers.ModelSerializer):

    class Meta:
        model = StockTransaction
        fields = [
            "item",
            "transaction_in",
            "transaction_out",
            "notes",
        ]