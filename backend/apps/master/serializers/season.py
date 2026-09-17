from rest_framework.serializers import ModelSerializer
from apps.master.models import Season

class SeasonReadSerializer(ModelSerializer):
    class Meta:
        model = Season
        fields = [
            "id",
            "uuid",
            "identity",
            "code",
            "is_active"
        ]


class SeasonWriteSerializer(ModelSerializer):
    class Meta:
        model = Season
        fields = [
            "identity",
            "code",
            "is_active"
        ]
