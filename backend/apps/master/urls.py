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
)


router = DefaultRouter()

router.register("colors", ColorViewSet, basename="color")
router.register("customers", CustomerViewSet, basename="customer")
router.register("suppliers", SupplierViewSet, basename="supplier")
router.register("styles", StylesViewSet, basename="style")
router.register("sizes", SizesViewSet, basename="size")
router.register("fabrics", FabricsViewSet, basename="fabric")
router.register("units", UnitViewSet, basename="unit")


urlpatterns =[]+ router.urls