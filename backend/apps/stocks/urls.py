from rest_framework.routers import DefaultRouter

from apps.stocks.views import InventoryItemViewSet


router = DefaultRouter()

router.register(
    "items",
    InventoryItemViewSet,
    basename="inventory-item"
)

urlpatterns = router.urls