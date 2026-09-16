from apps.master.models import Fabric
from apps.master.serializers import (
    FabricWriteSerializer,
    FabricReadSerializer
)

from rest_framework.viewsets import ModelViewSet
from rest_framework.filters import SearchFilter


class FabricsViewSet(ModelViewSet):
    queryset = Fabric.objects.all()

    filter_backends = [SearchFilter]
    search_fields = ["code", "identity"]

    def get_serializer_class(self):
        if self.action in ["list", "retrieve"]:
            return FabricReadSerializer

        return FabricWriteSerializer