from rest_framework.viewsets import ModelViewSet
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend

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

    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
    ]

    filterset_fields = [
        "fabric",
        "accessory",
        "color",
        "unit",
        "is_active",
    ]

    search_fields = [
        "code",
        "fabric__identity",
        "accessory__identity",
        "color__identity",
    ]

    def get_serializer_class(self):

        if self.action == "list":
            return InventoryItemReadSerializer

        if self.action == "retrieve":
            return InventoryItemRetrieveSerializer

        return InventoryItemWriteSerializer