from django.db import models
from apps.master.models import Fabric, Color, Unit, Accessory
from apps.base.models import BaseModel


class InventoryItem(BaseModel):

    code = models.CharField(
        max_length=100,
        unique=True
    )

    fabric = models.ForeignKey(
        Fabric,
        on_delete=models.PROTECT,
        null=True,
        blank=True
    )

    accessory = models.ForeignKey(
        Accessory,
        on_delete=models.PROTECT,
        null=True,
        blank=True
    )

    color = models.ForeignKey(
        Color,
        on_delete=models.PROTECT
    )

    unit = models.ForeignKey(
        Unit,
        on_delete=models.PROTECT
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["fabric", "accessory", "color", "unit"],
                # fields=["fabric", "accessory", "color"],
                name="unique_inventory_item"
            ),
            models.CheckConstraint(
                condition=(
                    models.Q(
                        fabric__isnull=False,
                        accessory__isnull=True
                    )
                    |
                    models.Q(
                        fabric__isnull=True,
                        accessory__isnull=False
                    )
                ),
                name="inventory_item_fabric_or_accessory"
            )
        ]





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
