from django.db import models
from django.utils import timezone

from apps.master.models import BOM
from apps.base.models import BaseModel
from apps.master.models import Customer


class ProductionOrder(BaseModel):

    class Status(models.TextChoices):
        WAITING = "WAITING", "Waiting"
        CUTTING = "CUTTING", "Cutting"
        STITCHING = "STITCHING", "Stitching"
        SEWING = "SEWING", "Sewing"
        FINISHING = "FINISHING", "Finishing"
        COMPLETED = "COMPLETED", "Completed"
        CANCELLED = "CANCELLED", "Cancelled"

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

    cutting_date = models.DateField(
        null=True,
        blank=True
    )
    customer = models.ForeignKey(
        Customer,
        on_delete=models.PROTECT,
        related_name="production_orders"
    )

    stitching_date = models.DateField(
        null=True,
        blank=True
    )

    sewing_date = models.DateField(
        null=True,
        blank=True
    )

    finishing_date = models.DateField(
        null=True,
        blank=True
    )

    completed_date = models.DateField(
        null=True,
        blank=True
    )

    cancelled_date = models.DateField(
        null=True,
        blank=True
    )

    remarks = models.TextField(
        blank=True
    )

    def save(self, *args, **kwargs):
        today = timezone.localdate()

        if self.status == self.Status.CUTTING and not self.cutting_date:
            self.cutting_date = today

        elif self.status == self.Status.STITCHING and not self.stitching_date:
            self.stitching_date = today

        elif self.status == self.Status.SEWING and not self.sewing_date:
            self.sewing_date = today

        elif self.status == self.Status.FINISHING and not self.finishing_date:
            self.finishing_date = today

        elif self.status == self.Status.COMPLETED and not self.completed_date:
            self.completed_date = today

        elif self.status == self.Status.CANCELLED and not self.cancelled_date:
            self.cancelled_date = today

        super().save(*args, **kwargs)

    def __str__(self):
        return self.production_no