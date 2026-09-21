from apps.master.views import ColorViewSet, CustomerViewSet, SupplierViewSet, StylesViewSet, SizesViewSet, FabricsViewSet, UnitViewSet
from rest_framework.routers import DefaultRouter

from apps.master.views import (
    ColorViewSet,
    CustomerViewSet,
    SupplierViewSet,
    StylesViewSet,
    SizesViewSet,
    FabricsViewSet,
    UnitViewSet,
    SeasonViewSet,
    AccessoryViewSet,
    BOMViewSet,
)
from apps.master.views.meta import (
    ColorMeta, 
    CustomerMeta, 
    FabricMeta, 
    SeasonMeta, 
    SizeMeta, 
    StyleMeta, 
    SupplierMeta, 
    UnitMeta, 
    AccessoryMeta,
    BOMMeta
)

router = DefaultRouter()

router.register("colors", ColorViewSet, basename="color")
router.register("customers", CustomerViewSet, basename="customer")
router.register("suppliers", SupplierViewSet, basename="supplier")
router.register("styles", StylesViewSet, basename="style")
router.register("sizes", SizesViewSet, basename="size")
router.register("fabrics", FabricsViewSet, basename="fabric")
router.register("units", UnitViewSet, basename="unit")
router.register("seasons", SeasonViewSet, basename="season")
router.register("accessory", AccessoryViewSet, basename="accessory")
router.register("bom", BOMViewSet, basename="bom")



# Meta
router.register("meta/colors", ColorMeta, basename="color-meta")
router.register("meta/customers", CustomerMeta, basename="customer-meta")
router.register("meta/fabrics", FabricMeta, basename="fabric-meta")
router.register("meta/sizes", SizeMeta, basename="size-meta")
router.register("meta/styles", StyleMeta, basename="style-meta")
router.register("meta/suppliers", SupplierMeta, basename="supplier-meta")
router.register("meta/seasons", SeasonMeta, basename="season-meta")
router.register("meta/units", UnitMeta, basename="unit-meta")
router.register("meta/accessories", AccessoryMeta, basename="accessory-meta")
router.register("meta/bom", BOMMeta, basename="bom-meta")

urlpatterns =[]+ router.urls