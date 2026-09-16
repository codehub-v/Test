from rest_framework.serializers import ModelSerializer
from apps.master.models import Supplier

class SupplierReadSerializer(ModelSerializer):
    class Meta:
        model = Supplier
        fields = [
            "id",
            "uuid",
            "identity",
            "email",
            "phone",
            "street",
            "city",
            "pincode",
            "is_active"
        ]
        
class SupplierWriteSerializer(ModelSerializer):
    class Meta:
        model = Supplier
        fields = [
            "identity",
            "email",
            "phone",
            "street",
            "city",
            "pincode",
            "is_active"
        ]