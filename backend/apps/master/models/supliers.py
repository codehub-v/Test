from apps.base.models import BaseModel
from django.db import models


class Supplier(BaseModel):

    identity = models.CharField(max_length=512)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)

    address = models.TextField(null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    pincode = models.CharField(max_length=10, null=True, blank=True)



    def __str__(self):
        return self.identity