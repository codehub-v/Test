from apps.base.models import BaseModel
from django.db import models


class Customer(BaseModel):
    identity = models.CharField(max_length=512)
    email = models.EmailField(null=True, blank=True)
    phone = models.CharField(max_length=10)

    address = models.TextField(null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    pincode = models.CharField(max_length=10, null=True, blank=True)

    def __str__(self):
        return self.identity