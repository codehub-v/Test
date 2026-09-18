from django.db import models
from apps.stocks.models import InventoryItem
from apps.base.models import BaseModel



class StockTransaction(BaseModel):

    TRANSACTION_TYPES = (
        ("IN", "Stock In"),
        ("OUT", "Stock Out"),
    )

    item = models.ForeignKey(
        InventoryItem,
        on_delete=models.PROTECT,
        related_name="stock_transactions"
    )

    transaction_type = models.CharField(
        max_length=3,
        choices=TRANSACTION_TYPES
    )

    quantity = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    reference_type = models.CharField(
        max_length=50,
        blank=True,
        null=True
    )

    reference_id = models.PositiveIntegerField(
        blank=True,
        null=True
    )

    transaction_date = models.DateTimeField(
        auto_now_add=True
    )

    notes = models.TextField(
        blank=True
    )

    def __str__(self):
        return f"{self.item.code} - {self.transaction_type} - {self.quantity}"
