from django.db import models
from apps.base.models import BaseModel


class ProductionLine(BaseModel):

    code = models.CharField(max_length=50, unique=True)
    identity = models.CharField(max_length=100)

    supervisor = models.CharField(
        max_length=100,
        blank=True
    )


    def __str__(self):
        return f"{self.code} - {self.name}"

