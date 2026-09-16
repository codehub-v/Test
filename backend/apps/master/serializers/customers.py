from rest_framework.serializers import ModelSerializer
from apps.master.models import Customer

class CustomerReadSerializer(ModelSerializer):
    class Meta:
        model = Customer
        fields = [
            "id",
            "uuid",
            "identity",
            "email",
            "phone",
            "street",
            "city",
            "pincode",
        ]
        
class CustomerWriteSerializer(ModelSerializer):
    class Meta:
        model = Customer
        fields = [
            "identity",
            "email",
            "phone",
            "street",
            "city",
            "pincode",
        ]