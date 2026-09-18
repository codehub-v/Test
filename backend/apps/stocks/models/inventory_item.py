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



