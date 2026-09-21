from django.db import models
from django.utils import timezone

from apps.base.models import BaseModel
from apps.stocks.models import ProductionOrder


class Delivery(BaseModel):

    class Status(models.TextChoices):
        PACKED = "PACKED", "Packed"
        DISPATCHED = "DISPATCHED", "Dispatched"
        DELIVERED = "DELIVERED", "Delivered"

    delivery_no = models.CharField(
        max_length=50,
        unique=True
    )

    production_order = models.ForeignKey(
        ProductionOrder,
        on_delete=models.PROTECT,
        related_name="deliveries"
    )

    quantity = models.PositiveIntegerField()

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PACKED
    )

    packed_at = models.DateTimeField(
        null=True,
        blank=True
    )

    dispatched_at = models.DateTimeField(
        null=True,
        blank=True
    )

    delivered_at = models.DateTimeField(
        null=True,
        blank=True
    )

    delivery_address = models.TextField(
        blank=True
    )

    vehicle_number = models.CharField(
        max_length=50,
        blank=True
    )

    remarks = models.TextField(
        blank=True
    )

    def save(self, *args, **kwargs):
        now = timezone.now()

        if self.status == self.Status.PACKED:

            if not self.packed_at:
                self.packed_at = now

        elif self.status == self.Status.DISPATCHED:

            if not self.packed_at:
                self.packed_at = now

            if not self.dispatched_at:
                self.dispatched_at = now

        elif self.status == self.Status.DELIVERED:

            if not self.packed_at:
                self.packed_at = now

            if not self.dispatched_at:
                self.dispatched_at = now

            if not self.delivered_at:
                self.delivered_at = now

        super().save(*args, **kwargs)

    def __str__(self):
        return self.delivery_no