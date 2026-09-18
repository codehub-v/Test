from rest_framework.viewsets import ModelViewSet

from apps.stocks.models import InventoryItem
from apps.stocks.serializers import (
    InventoryItemReadSerializer,
    InventoryItemRetrieveSerializer,
    InventoryItemWriteSerializer,
)


class InventoryItemViewSet(ModelViewSet):

    queryset = InventoryItem.objects.select_related(
        "fabric",
        "accessory",
        "color",
        "unit",
    )

    def get_serializer_class(self):

        if self.action == "list":
            return InventoryItemReadSerializer

        if self.action == "retrieve":
            return InventoryItemRetrieveSerializer

        return InventoryItemWriteSerializer