from django.contrib.auth import authenticate
from rest_framework import serializers
from apps.users.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "identity",
            "email",
            "role",
            "is_active",
            "is_staff",
        ]
