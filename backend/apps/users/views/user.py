from apps.users.models import User
from rest_framework.viewsets import ModelViewSet
from apps.users.serializers import UserSerialzier

class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerialzier
    