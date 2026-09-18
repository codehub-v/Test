from apps.base.models import BaseModel
from django.db import models
from django.db.models.functions import Lower
from apps.master.models import Supplier
from apps.master.models import Fabric, Accessory, Color, Unit

class SupplyOrder(models.Model):
    ORDER_STATUS = (
        ("draft", "Draft"),
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
    expected_date = models.DateField(null=True, blank=True)

    status = models.CharField(
        max_length=20,
        choices=ORDER_STATUS,
        default="draft"
    )

    notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)



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

    ordered_quantity = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    received_quantity = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )

    unit_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )

    created_at = models.DateTimeField(auto_now_add=True)