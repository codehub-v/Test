from rest_framework.viewsets import ReadOnlyModelViewSet

from apps.master.models import (
    Color,
    Customer,
    Fabric,
    Size,
    Style,
    Supplier,
    Season,
    Unit,
    Accessory,
    BOM
)

from apps.master.serializers import (
    ColorReadSerializer,
    CustomerReadSerializer,
    FabricReadSerializer,
    SizeReadSerializer,
    StyleReadSerializer,
    SupplierReadSerializer,
    SeasonReadSerializer,
    UnitReadSerializer,
    AccessoryReadSerializer,
    BOMListSerializer
)


class ColorMeta(ReadOnlyModelViewSet):

    pagination_class=None
    queryset = Color.objects.filter(is_active=True)
    serializer_class = ColorReadSerializer


class CustomerMeta(ReadOnlyModelViewSet):
    pagination_class=None
    queryset = Customer.objects.filter(is_active=True)
    serializer_class = CustomerReadSerializer


class FabricMeta(ReadOnlyModelViewSet):
    pagination_class=None
    queryset = Fabric.objects.filter(is_active=True)
    serializer_class = FabricReadSerializer


class SizeMeta(ReadOnlyModelViewSet):
    pagination_class=None
    queryset = Size.objects.filter(is_active=True)
    serializer_class = SizeReadSerializer


class StyleMeta(ReadOnlyModelViewSet):
    pagination_class=None
    queryset = Style.objects.filter(is_active=True)
    serializer_class = StyleReadSerializer


class SupplierMeta(ReadOnlyModelViewSet):
    pagination_class=None
    queryset = Supplier.objects.filter(is_active=True)
    serializer_class = SupplierReadSerializer


class SeasonMeta(ReadOnlyModelViewSet):
    pagination_class=None
    queryset = Season.objects.filter(is_active=True)
    serializer_class = SeasonReadSerializer


class UnitMeta(ReadOnlyModelViewSet):
    pagination_class=None
    queryset = Unit.objects.filter(is_active=True)
    serializer_class = UnitReadSerializer


class AccessoryMeta(ReadOnlyModelViewSet):
    pagination_class=None
    queryset = Accessory.objects.filter(is_active=True)
    serializer_class = AccessoryReadSerializer


class BOMMeta(ReadOnlyModelViewSet):
    pagination_class=None
    queryset = BOM.objects.filter(is_active=True)
    serializer_class = BOMListSerializer