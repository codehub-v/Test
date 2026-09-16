from apps.base.models import BaseModel
from django.db import models

class Unit(BaseModel):

    identity = models.CharField(max_length=255)


    def __str__(self):
        return self.identity