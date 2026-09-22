from django.contrib.auth import authenticate

from rest_framework import serializers

from apps.users.models import User, Role


class LoginSerializer(serializers.Serializer):

    email = serializers.EmailField()

    password = serializers.CharField(
        write_only=True
    )

    def validate(self, attrs):

        email = attrs.get("email")
        password = attrs.get("password")

        user = authenticate(
            username=email,
            password=password
        )

        if not user:
            raise serializers.ValidationError(
                "Invalid email or password."
            )

        if not user.is_active:
            raise serializers.ValidationError(
                "User account is inactive."
            )

        attrs["user"] = user

        return attrs


class RoleProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = Role
        fields = [
            "id",
            "identity",

            # Master
            "style",
            "season",
            "size",
            "color",
            "fabric",
            "accessory",
            "category",
            "customer",
            "supplier",
            "bom",

            # Inventory
            "inventory",
            "stock",
            "supply_order",

            # Production
            "production",
            "delivery",

            # Reports
            "reports",

            # User Management
            "users",
            "roles",

            "is_active",
        ]


class UserProfileSerializer(serializers.ModelSerializer):

    role_details = RoleProfileSerializer(
        source="role",
        read_only=True
    )

    class Meta:
        model = User
        fields = [
            "id",
            "identity",
            "email",
            "role",
            "role_details",
            "is_active",
            "is_staff",
            "is_superuser",
        ]