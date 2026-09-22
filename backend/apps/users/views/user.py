from rest_framework.viewsets import ModelViewSet

from apps.users.models import User, Role

from apps.users.serializers import (
    UserListSerializer,
    UserRetrieveSerializer,
    UserWriteSerializer,
    RoleListSerializer,
    RoleRetrieveSerializer,
    RoleWriteSerializer,
)


class UserViewSet(ModelViewSet):

    queryset = User.objects.all()

    def get_serializer_class(self):

        if self.action == "list":
            return UserListSerializer

        if self.action == "retrieve":
            return UserRetrieveSerializer

        return UserWriteSerializer


class RoleViewSet(ModelViewSet):

    queryset = Role.objects.all()

    def get_serializer_class(self):

        if self.action == "list":
            return RoleListSerializer

        if self.action == "retrieve":
            return RoleRetrieveSerializer

        return RoleWriteSerializer

class RoleMetaViewSet(ModelViewSet):

    queryset = Role.objects.filter(is_active=True)

    def get_serializer_class(self):

        return RoleListSerializer