from apps.base.models import BaseModel
from django.db import models
from django.db.models.functions import Lower


class Accessory(BaseModel):

    identity = models.CharField(max_length=255)
    code = models.CharField(max_length=255)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                Lower("identity"),
                name="unique_accessory_identity_case_insensitive",
            ),
            models.UniqueConstraint(
                Lower("code"),
                name="unique_accessory_code_case_insensitive",
            ),
        ]

    def __str__(self):
        return self.identity