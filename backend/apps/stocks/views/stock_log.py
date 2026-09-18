from rest_framework.viewsets import ModelViewSet
from rest_framework.filters import SearchFilter, OrderingFilter

from django_filters.rest_framework import (
    DjangoFilterBackend,
    FilterSet,
    NumberFilter,
)

from apps.stocks.models import StockTransaction
from apps.stocks.serializers import (
    StockTransactionReadSerializer,
    StockTransactionWriteSerializer,
)


class StockTransactionFilter(FilterSet):

    quantity_min = NumberFilter(
        field_name="quantity",
        lookup_expr="gte"
    )

    quantity_max = NumberFilter(
        field_name="quantity",
        lookup_expr="lte"
    )

    class Meta:
        model = StockTransaction
        fields = [
            "item",
            "transaction_in",
            "transaction_out",
            "quantity_min",
            "quantity_max",
        ]


class StockTransactionViewSet(ModelViewSet):

    queryset = StockTransaction.objects.select_related(
        "item",
        "item__fabric",
        "item__accessory",
        "item__color",
        "item__unit",
    )

    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]

    filterset_class = StockTransactionFilter

    search_fields = [
        "item__code",
        "item__fabric__identity",
        "item__accessory__identity",
        "item__color__identity",
        "item__unit__identity",
    ]

    ordering_fields = [
        "transaction_date",
        "transaction_in",
        "transaction_out",
        "quantity",
    ]

    ordering = [
        "-transaction_date"
    ]

    def get_serializer_class(self):

        if self.action in ["list", "retrieve"]:
            return StockTransactionReadSerializer

        return StockTransactionWriteSerializer
