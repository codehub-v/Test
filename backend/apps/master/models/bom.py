from django.db import models

from apps.base.models import BaseModel
from apps.master.models import (
    Fabric,
    Accessory,
    Color,
    Unit,
)


class BOM(BaseModel):

    STATUS_CHOICES = (
        ("active", "Active"),
        ("inactive", "Inactive"),
    )

    bom_number = models.CharField(
        max_length=50,
        unique=True,
    )

    identity = models.CharField(
        max_length=200,
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="active",
    )

    notes = models.TextField(
        blank=True,
    )

    def save(self, *args, **kwargs):

        if not self.bom_number:

            last_bom = (
                BOM.objects
                .order_by("-id")
                .first()
            )

            if last_bom and last_bom.bom_number:

                try:
                    last_number = int(
                        last_bom.bom_number.split("-")[-1]
                    )

                except (ValueError, IndexError):

                    last_number = 0

            else:

                last_number = 0

            self.bom_number = (
                f"BOM-{last_number + 1:05d}"
            )

        super().save(*args, **kwargs)

    def __str__(self):
        return self.bom_number


class BOMItem(models.Model):

    bom = models.ForeignKey(
        BOM,
        on_delete=models.CASCADE,
        related_name="items",
    )

    fabric = models.ForeignKey(
        Fabric,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="bom_items",
    )

    accessory = models.ForeignKey(
        Accessory,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="bom_items",
    )

    color = models.ForeignKey(
        Color,
        on_delete=models.PROTECT,
        related_name="bom_items",
    )

    unit = models.ForeignKey(
        Unit,
        on_delete=models.PROTECT,
        related_name="bom_items",
    )

    quantity = models.DecimalField(
        max_digits=12,
        decimal_places=2,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:

        constraints = [

            models.CheckConstraint(
                condition=(
                    models.Q(
                        fabric__isnull=False,
                        accessory__isnull=True,
                    )
                    |
                    models.Q(
                        fabric__isnull=True,
                        accessory__isnull=False,
                    )
                ),
                name="bom_item_fabric_or_accessory",
            ),

            models.CheckConstraint(
                condition=models.Q(
                    quantity__gt=0
                ),
                name="bom_item_quantity_positive",
            ),
        ]

    def __str__(self):

        material = (
            self.fabric.identity
            if self.fabric
            else self.accessory.identity
        )

        return (
            f"{self.bom.bom_number} - "
            f"{material}"
        )