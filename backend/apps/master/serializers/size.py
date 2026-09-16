from rest_framework.serializers import ModelSerializer
from apps.master.models import Size

class SizeReadSerializer(ModelSerializer):
    class Meta:
        model = Size
        fields = [
            "id",
            "uuid",
            "identity",
            "code",
            "is_active"
        ]


class SizeWriteSerializer(ModelSerializer):
    class Meta:
        model = Size
        fields = [
            "identity",
            "code",
            "is_active"
        ]
