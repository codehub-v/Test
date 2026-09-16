from rest_framework.serializers import ModelSerializer
from apps.master.models import Fabric

class FabricReadSerializer(ModelSerializer):
    class Meta:
        model = Fabric
        fields = [
            "id",
            "uuid",
            "identity",
            "code",
            "is_active"
        ]


class FabricWriteSerializer(ModelSerializer):
    class Meta:
        model = Fabric
        fields = [
            "identity",
            "code",
            "is_active"
        ]
