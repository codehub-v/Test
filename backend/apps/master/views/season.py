from apps.master.models import Season
from apps.master.serializers import (
    SeasonWriteSerializer,
    SeasonReadSerializer
)

from rest_framework.viewsets import ModelViewSet
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend


class SeasonViewSet(ModelViewSet):
    queryset = Season.objects.all()

    filter_backends = [SearchFilter, DjangoFilterBackend]
    filterset_fields = ["is_active"]
    search_fields = ["code", "identity"]

    def get_serializer_class(self):
        if self.action in ["list", "retrieve"]:
            return SeasonReadSerializer

        return SeasonWriteSerializer