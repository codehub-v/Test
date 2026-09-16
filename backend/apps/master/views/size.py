from apps.master.models import Size
from apps.master.serializers import (
    SizeWriteSerializer,
    SizeReadSerializer
)

from rest_framework.viewsets import ModelViewSet
from rest_framework.filters import SearchFilter


class SizesViewSet(ModelViewSet):
    queryset = Size.objects.all()

    filter_backends = [SearchFilter]
    search_fields = ["code", "identity"]

    def get_serializer_class(self):
        if self.action in ["list", "retrieve"]:
            return SizeReadSerializer

        return SizeWriteSerializer