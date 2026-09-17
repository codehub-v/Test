from apps.master.models import Customer
from apps.master.serializers import (
    CustomerWriteSerializer,
    CustomerReadSerializer
)

from rest_framework.viewsets import ModelViewSet
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend


class CustomerViewSet(ModelViewSet):
    queryset = Customer.objects.all()

    filter_backends = [SearchFilter, DjangoFilterBackend]
    filterset_fields = ["is_active"]
    search_fields = [

        "name",
        "email",
        "phone",
    ]

    def get_serializer_class(self):
        if self.action in ["list", "retrieve"]:
            return CustomerReadSerializer

        return CustomerWriteSerializer