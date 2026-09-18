from apps.base.models import BaseModel
from django.db import models
from apps.master.models import Supplier
from apps.master.models import Fabric, Accessory, Color, Unit


class SupplyOrder(models.Model):
    ORDER_STATUS = (
        ("ordered", "Ordered"),
        ("partial", "Partially Received"),
        ("received", "Received"),
        ("cancelled", "Cancelled"),
    )

    order_number = models.CharField(
        max_length=50,
        unique=True
    )

    supplier = models.ForeignKey(
        Supplier,
        on_delete=models.PROTECT,
        related_name="supply_orders"
    )

    order_date = models.DateField()

    status = models.CharField(
        max_length=20,
        choices=ORDER_STATUS,
        default="ordered"
    )

    notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def save(self, *args, **kwargs):

        if not self.order_number:

            last_order = (
                SupplyOrder.objects
                .order_by("-id")
                .first()
            )

            if last_order and last_order.order_number:
                try:
                    last_number = int(
                        last_order.order_number.split("-")[-1]
                    )
                except (ValueError, IndexError):
                    last_number = 0
            else:
                last_number = 0

            self.order_number = (
                f"PO-{last_number + 1:05d}"
            )

        super().save(*args, **kwargs)

    def __str__(self):
        return self.order_number

    
class SupplyOrderItem(models.Model):
    supply_order = models.ForeignKey(
        SupplyOrder,
        on_delete=models.CASCADE,
        related_name="items"
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
        on_delete=models.PROTECT,
        related_name="supply_order_items"
    )

    ordered_quantity = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    received_quantity = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )



    created_at = models.DateTimeField(auto_now_add=True)