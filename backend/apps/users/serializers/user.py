from rest_framework import serializers

from apps.users.models import User, Role


class UserSerializer(serializers.ModelSerializer):
    role_name = serializers.CharField(
        source="role.identity",
        read_only=True
    )

    class Meta:
        model = User
        fields = [
            "id",
            "identity",
            "email",
            "phone",
            "role",
            "role_name",
            "is_active",
            "is_staff",
            "is_superuser",
        ]


class RoleListSerializer(serializers.ModelSerializer):
    user_count = serializers.IntegerField(
        source="assigned_users.count",
        read_only=True
    )

    class Meta:
        model = Role
        fields = [
            "id",
            "identity",
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
            "inventory",
            "stock",
            "supply_order",
            "production",
            "delivery",
            "reports",
            "users",
            "roles",
            "is_active",
            "user_count",
        ]


class RoleRetrieveSerializer(serializers.ModelSerializer):
    user_count = serializers.IntegerField(
        source="assigned_users.count",
        read_only=True
    )

    class Meta:
        model = Role
        fields = [
            "id",
            "identity",
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
            "inventory",
            "stock",
            "supply_order",
            "production",
            "delivery",
            "reports",
            "users",
            "roles",
            "is_active",
            "user_count",
            "created_at",
            "updated_at",
        ]


class RoleWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = [
            "identity",
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
            "inventory",
            "stock",
            "supply_order",
            "production",
            "delivery",
            "reports",
            "users",
            "roles",
            "is_active",
        ]

    def validate_identity(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Role name is required."
            )

        return value


class UserListSerializer(serializers.ModelSerializer):
    role_name = serializers.CharField(
        source="role.identity",
        read_only=True
    )

    class Meta:
        model = User
        fields = [
            "id",
            "identity",
            "email",
            "phone",
            "role",
            "role_name",
            "is_active",
            "is_staff",
            "is_superuser",
        ]


class UserRetrieveSerializer(serializers.ModelSerializer):
    role_details = RoleRetrieveSerializer(
        source="role",
        read_only=True
    )

    class Meta:
        model = User
        fields = [
            "id",
            "identity",
            "email",
            "phone",
            "role",
            "role_details",
            "is_active",
            "is_staff",
            "is_superuser",
        ]


class UserWriteSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=False,
        allow_blank=False,
        min_length=6
    )

    class Meta:
        model = User
        fields = [
            "identity",
            "email",
            "phone",
            "password",
            "role",
            "is_active",
            "is_staff",
        ]

    def validate_identity(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Name is required."
            )

        return value

    def validate_email(self, value):
        value = value.lower().strip()

        if not value:
            raise serializers.ValidationError(
                "Email is required."
            )

        return value

    def validate_phone(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Phone number is required."
            )

        return value

    def create(self, validated_data):
        password = validated_data.pop("password", None)

        if not password:
            raise serializers.ValidationError({
                "password": "Password is required."
            })

        return User.objects.create_user(
            password=password,
            **validated_data
        )

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)

        instance.save()

        return instance