from rest_framework.routers import DefaultRouter

from apps.stocks.views import (
    InventoryItemViewSet,
    InventoryItemMeta,
    StockItemViewSet,
    StockTransactionViewSet,
    SupplyOrderViewSet,
    ProductionOrderViewSet,
    ProductionOrderMetaViewSet,
    DeliveryViewSet,
)

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

router.register(
    "stock-logs",
    StockTransactionViewSet,
    basename="stock-log"
)
router.register(
    "supply-orders",
    SupplyOrderViewSet,
    basename="supplies"
)
router.register(
    "order",
    ProductionOrderViewSet,
    basename="order"
)
router.register(
    r"delivery",
    DeliveryViewSet,
    basename="order-delivery",
)

# Meta
router.register(
    "meta/items",
    InventoryItemMeta,
    basename="meta-inventory-item"
)
router.register(
    "meta/order",
    ProductionOrderMetaViewSet,
    basename="meta-inventory-order"
)

urlpatterns = router.urls