from apps.master.models import Supplier
from apps.master.serializers import (
    SupplierWriteSerializer,
    SupplierReadSerializer
)

from rest_framework.viewsets import ModelViewSet
from rest_framework.filters import SearchFilter


class SupplierViewSet(ModelViewSet):
    queryset = Supplier.objects.all()

    filter_backends = [SearchFilter]
    search_fields = [
        "code",
        "name",
        "email",
        "phone",
    ]

    def get_serializer_class(self):
        if self.action in ["list", "retrieve"]:
            return SupplierReadSerializer

        return SupplierWriteSerializer