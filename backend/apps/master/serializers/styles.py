from rest_framework.serializers import ModelSerializer
from apps.master.models import Style

class StyleReadSerializer(ModelSerializer):
    class Meta:
        model = Style
        fields = [
            "id",
            "uuid",
            "identity",
            "code",
        ]


class StyleWriteSerializer(ModelSerializer):
    class Meta:
        model = Style
        fields = [
            "identity",
            "code",
        ]
