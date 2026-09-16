from rest_framework.serializers import ModelSerializer
from apps.master.models import Color

class ColorReadSerializer(ModelSerializer):
    class Meta:
        model = Color
        fields = [
            "id",
            "uuid",
            "identity",
            "code",
            "is_active"
        ]


class ColorWriteSerializer(ModelSerializer):
    class Meta:
        model = Color
        fields = [
            "identity",
            "code",
            "is_active"
        ]
