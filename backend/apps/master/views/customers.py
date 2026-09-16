from apps.master.models import Customer
from apps.master.serializers import (
    CustomerWriteSerializer,
    CustomerReadSerializer
)

from rest_framework.viewsets import ModelViewSet
from rest_framework.filters import SearchFilter


class CustomerViewSet(ModelViewSet):
    queryset = Customer.objects.all()

    filter_backends = [SearchFilter]
    search_fields = [
        "code",
        "name",
        "email",
        "phone",
    ]

    def get_serializer_class(self):
        if self.action in ["list", "retrieve"]:
            return CustomerReadSerializer

        return CustomerWriteSerializer