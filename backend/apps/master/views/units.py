from apps.master.models import Unit
from apps.master.serializers import (
    UnitWriteSerializer,
    UnitReadSerializer
)

from rest_framework.viewsets import ModelViewSet
from rest_framework.filters import SearchFilter


class UnitViewSet(ModelViewSet):
    queryset = Unit.objects.all()

    filter_backends = [SearchFilter]
    search_fields = ["code", "identity"]

    def get_serializer_class(self):
        if self.action in ["list", "retrieve"]:
            return UnitReadSerializer

        return UnitWriteSerializer