from django.db import models

from apps.master.models import BOM
from apps.base.models import BaseModel


class ProductionOrder(BaseModel):

    class Status(models.TextChoices):
        WAITING = "WAITING", "Waiting"
        CUTTING = "CUTTING", "Cutting"
        STITCHING = "STITCHING", "Stitching"
        SEWING = "SEWING", "Sewing"
        FINISHING = "FINISHING", "Finishing"
        COMPLETED = "COMPLETED", "Completed"

    production_no = models.CharField(
        max_length=50,
        unique=True
    )

    product = models.ForeignKey(
        BOM,
        on_delete=models.PROTECT,
        related_name="production_orders"
    )

    quantity = models.PositiveIntegerField()

    production_line = models.CharField(
        max_length=100
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.WAITING
    )

    start_date = models.DateField(
        null=True,
        blank=True
    )

    completed_date = models.DateField(
        null=True,
        blank=True
    )

    remarks = models.TextField(
        blank=True
    )

    def __str__(self):
        return self.production_no