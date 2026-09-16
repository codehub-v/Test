from rest_framework.serializers import ModelSerializer
from apps.master.models import Unit

class UnitReadSerializer(ModelSerializer):
    class Meta:
        model = Unit
        fields = [
            "id",
            "uuid",
            "identity",
            "code",
            "is_active"
        ]


class UnitWriteSerializer(ModelSerializer):
    class Meta:
        model = Unit
        fields = [
            "identity",
            "code",
            "is_active"
        ]
