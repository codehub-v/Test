from apps.master.models import Color
from apps.master.serializers import (
    ColorWriteSerializer,
    ColorReadSerializer
)

from rest_framework.viewsets import ModelViewSet
from rest_framework.filters import SearchFilter

class ColorViewSet(ModelViewSet):
    queryset = Color.objects.all()

    filter_backends = [SearchFilter]
    search_fields = ["code", "identity"]

    def get_serializer_class(self):
        if self.action in ["list", "retrieve"]:
            return ColorReadSerializer

        return ColorWriteSerializer