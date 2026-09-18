from apps.base.models import BaseModel
from django.db import models
class BOM(BaseModel):
    style = models.ForeignKey(
        "master.Style",
        on_delete=models.PROTECT,
        related_name="boms"
    )

    identity = models.CharField(max_length=255)

    version = models.CharField(
        max_length=50,
        default="1.0"
    )

    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.style} - {self.identity}"




class BOMItem(BaseModel):

    MATERIAL_TYPE_CHOICES = (
        ("fabric", "Fabric"),
        ("accessory", "Accessory"),
    )

    bom = models.ForeignKey(
        BOM,
        on_delete=models.CASCADE,
        related_name="items"
    )

    material_type = models.CharField(
        max_length=20,
        choices=MATERIAL_TYPE_CHOICES
    )

    fabric = models.ForeignKey(
        "master.Fabric",
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="bom_items"
    )

    accessory = models.ForeignKey(
        "master.Accessory",
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="bom_items"
    )

    quantity = models.DecimalField(
        max_digits=10,
        decimal_places=3
    )

    wastage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0
    )

    def __str__(self):
        return f"{self.bom} - {self.quantity}"