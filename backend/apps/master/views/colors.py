from apps.master.models import Color
from apps.master.serializers import (
    ColorWriteSerializer,
    ColorReadSerializer
)

from rest_framework.viewsets import ModelViewSet
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend

class ColorViewSet(ModelViewSet):
    queryset = Color.objects.all()

    filter_backends = [SearchFilter, DjangoFilterBackend]
    filterset_fields = ["is_active"]
    search_fields = ["code", "identity"]

    def get_serializer_class(self):
        if self.action in ["list", "retrieve"]:
            return ColorReadSerializer

        return ColorWriteSerializer