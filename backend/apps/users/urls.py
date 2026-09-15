from django.urls import path, include
from rest_framework.routers import DefaultRouter

from apps.users.views import (
    LoginAPI,
    LogoutAPI,
    UserProfile,
    UserViewSet,
)


router = DefaultRouter()

router.register(
    "users",
    UserViewSet,
    basename="user"
)


urlpatterns = [
    path("login/", LoginAPI.as_view(), name="login"),
    path("logout/", LogoutAPI.as_view(), name="logout"),
    path("profile/", UserProfile.as_view(), name="profile"),

    path("", include(router.urls)),
]