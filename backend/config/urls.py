from django.contrib import admin
from django.urls import path, include

from django.apps import apps


for model in apps.get_models():
    try:
        admin.site.register(model)
    except admin.sites.AlreadyRegistered:
        pass

urlpatterns = [
    path("admin/", admin.site.urls),

    path(
        "auth/",
        include("apps.users.urls")
    ),
    path(
        "master/",
        include("apps.master.urls")
    ),
    path(
        "inventory/",
        include("apps.stocks.urls")
    ),
]