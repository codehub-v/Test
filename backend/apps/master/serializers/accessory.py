from rest_framework.serializers import ModelSerializer
from apps.master.models import Accessory

class AccessoryReadSerializer(ModelSerializer):
    class Meta:
        model = Accessory
        fields = [
            "id",
            "uuid",
            "identity",
            "code",
            "is_active"
        ]


class AccessoryWriteSerializer(ModelSerializer):
    class Meta:
        model = Accessory
        fields = [
            "identity",
            "code",
            "is_active"
        ]
