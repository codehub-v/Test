from django.db import models
from apps.stocks.models import InventoryItem
from apps.base.models import BaseModel


class Stock(BaseModel):
    item = models.OneToOneField(
        InventoryItem,
        on_delete=models.CASCADE,
        related_name="stock"
    )

    quantity = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )
