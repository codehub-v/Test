from django.db import models
from django.contrib.auth.models import (
    BaseUserManager,
    AbstractBaseUser,
    PermissionsMixin,
)


class Role(models.Model):

    identity = models.CharField(
        max_length=100,
        unique=True,
    )
    style = models.BooleanField(default=False)
    season = models.BooleanField(default=False)
    size = models.BooleanField(default=False)
    color = models.BooleanField(default=False)
    fabric = models.BooleanField(default=False)
    accessory = models.BooleanField(default=False)
    category = models.BooleanField(default=False)
    customer = models.BooleanField(default=False)
    supplier = models.BooleanField(default=False)
    bom = models.BooleanField(default=False)
    inventory = models.BooleanField(default=False)
    stock = models.BooleanField(default=False)
    supply_order = models.BooleanField(default=False)
    production = models.BooleanField(default=False)
    delivery = models.BooleanField(default=False)
    reports = models.BooleanField(default=False)
    users = models.BooleanField(default=False)
    roles = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return self.identity


class UserManager(BaseUserManager):

    def create_user(self, email, password=None, **extra_fields):

        if not email:
            raise ValueError("Email is required")

        email = self.normalize_email(email)

        user = self.model(
            email=email,
            **extra_fields
        )

        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, password=None, **extra_fields):

        extra_fields.setdefault("is_active", True)
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError(
                "Superuser must have is_staff=True"
            )

        if extra_fields.get("is_superuser") is not True:
            raise ValueError(
                "Superuser must have is_superuser=True"
            )

        return self.create_user(
            email=email,
            password=password,
            **extra_fields
        )


class User(AbstractBaseUser, PermissionsMixin):

    identity = models.CharField(
        max_length=256,
        null=True,
        blank=True
    )

    email = models.EmailField(
        unique=True
    )
    phone = models.CharField(
            max_length=10,
            null=True,
            blank=True
        )
    

    role = models.ForeignKey(
        Role,
        on_delete=models.PROTECT,
        related_name="assigned_users",
        null=True,
        blank=True,
    )

    is_staff = models.BooleanField(
        default=False
    )

    is_active = models.BooleanField(
        default=True
    )

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email