from django.db import models
from apps.stocks.models import InventoryItem
from apps.base.models import BaseModel


class StockItem(BaseModel):
    item = models.OneToOneField(
        InventoryItem,
        on_delete=models.CASCADE,
        related_name="inventory_item"
    )

    quantity = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )
