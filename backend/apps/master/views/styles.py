from apps.master.models import Style
from apps.master.serializers import (
    StyleWriteSerializer,
    StyleReadSerializer
)

from rest_framework.viewsets import ModelViewSet
from rest_framework.filters import SearchFilter


class StylesViewSet(ModelViewSet):
    queryset = Style.objects.all()

    filter_backends = [SearchFilter]
    search_fields = ["code", "identity"]

    def get_serializer_class(self):
        if self.action in ["list", "retrieve"]:
            return StyleReadSerializer

        return StyleWriteSerializer