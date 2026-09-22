from django.urls import path, include
from rest_framework.routers import DefaultRouter

from apps.users.views import (
    LoginAPI,
    LogoutAPI,
    UserProfile,
    UserViewSet,DashboardAPIView,
    RoleViewSet, RoleMetaViewSet
)
from apps.users.views.reports import InventoryReportAPIView, ProductionReportAPIView, SupplyOrderReportAPIView

router = DefaultRouter()

router.register(
    "users",
    UserViewSet,
    basename="users"
)

router.register(
    "roles",
    RoleViewSet,
    basename="roles"
)
router.register(
    "meta/roles",
    RoleMetaViewSet,
    basename="meta-roles"
)


urlpatterns = [
    path("login/", LoginAPI.as_view(), name="login"),
    path("logout/", LogoutAPI.as_view(), name="logout"),
    path("profile/", UserProfile.as_view(), name="profile"),
    path("dashboard/", DashboardAPIView.as_view(), name="dashboard"),
        path(
        "report/inventory/",
        InventoryReportAPIView.as_view(),
        name="inventory-report",
    ),
    path(
        "report/supply-orders/",
        SupplyOrderReportAPIView.as_view(),
        name="supply-order-report",
    ),
    path(
        "report/production/",
        ProductionReportAPIView.as_view(),
        name="production-report",
    ),

    path("", include(router.urls)),
]