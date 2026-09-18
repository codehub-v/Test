from rest_framework.routers import DefaultRouter

from apps.stocks.views import InventoryItemViewSet, InventoryItemMeta, StockItemViewSet


router = DefaultRouter()

router.register(
    "items",
    InventoryItemViewSet,
    basename="inventory-item"
)
router.register(
    "stock",
    StockItemViewSet,
    basename="stock-item"

)

# Meta
router.register(
    "meta/items",
    InventoryItemMeta,
    basename="meta-inventory-item"
)


urlpatterns = router.urls