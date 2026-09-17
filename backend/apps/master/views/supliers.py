from apps.master.models import Supplier
from apps.master.serializers import (
    SupplierWriteSerializer,
    SupplierReadSerializer
)

from rest_framework.viewsets import ModelViewSet
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend


class SupplierViewSet(ModelViewSet):
    queryset = Supplier.objects.all()

    filter_backends = [SearchFilter, DjangoFilterBackend]
    filterset_fields = ["is_active"]
    search_fields = [

        "name",
        "email",
        "phone",
    ]

    def get_serializer_class(self):
        if self.action in ["list", "retrieve"]:
            return SupplierReadSerializer

        return SupplierWriteSerializer