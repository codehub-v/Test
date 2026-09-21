from rest_framework.viewsets import ModelViewSet
from rest_framework.filters import SearchFilter

from apps.master.models import BOM
from apps.master.serializers import (
    BOMListSerializer,
    BOMRetrieveSerializer,
    BOMWriteSerializer,
)


class BOMViewSet(ModelViewSet):

    queryset = (
        BOM.objects
        .prefetch_related(
            "items__fabric",
            "items__accessory",
            "items__color",
            "items__unit",
        )
        .order_by("-id")
    )

    filter_backends = [SearchFilter]

    search_fields = [
        "identity",
    ]

    def get_serializer_class(self):

        if self.action == "list":
            return BOMListSerializer

        if self.action == "retrieve":
            return BOMRetrieveSerializer

        return BOMWriteSerializer