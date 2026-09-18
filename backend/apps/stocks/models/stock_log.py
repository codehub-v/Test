from django.db import models
from apps.stocks.models import InventoryItem
from apps.base.models import BaseModel


class StockTransaction(BaseModel):

    item = models.ForeignKey(
        InventoryItem,
        on_delete=models.PROTECT,
        related_name="stock_transactions"
    )

    transaction_date = models.DateTimeField(
        auto_now_add=True
    )

    transaction_in = models.DecimalField(
        default=0,
        max_digits=12,
        decimal_places=2
    )

    transaction_out = models.DecimalField(
        default=0,
        max_digits=12,
        decimal_places=2
    )

    quantity = models.DecimalField(
        default=0,
        max_digits=12,
        decimal_places=2
    )

    notes = models.TextField(
        blank=True
    )

    class Meta:
        constraints = [
            models.CheckConstraint(
                condition=(
                    models.Q(
                        transaction_in__gt=0,
                        transaction_out=0
                    )
                    |
                    models.Q(
                        transaction_in=0,
                        transaction_out__gt=0
                    )
                ),
                name="stock_transaction_in_or_out",
            )
        ]

    def __str__(self):
        return f"{self.item.code} - {self.quantity}"