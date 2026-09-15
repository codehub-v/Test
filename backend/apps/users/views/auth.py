from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from apps.users.serializers import LoginSerializer, UserProfileSerializer
from apps.users.models import User

class LoginAPI(APIView):

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(
            data=request.data
        )
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        token, created = Token.objects.get_or_create(
            user=user
        )
        return Response(
            {
                "message": "Login successful",
                "token": token.key,
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "identity": user.identity,
                    "role": user.role,
                }
            },
            status=status.HTTP_200_OK
        )

class LogoutAPI(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):
        request.user.auth_token.delete()
        return Response(
            {
                "message": "Logout successful"
            },
            status=status.HTTP_200_OK
        )

class UserProfile(APIView):

    def get(self, request):
        user = request.user
        serializer = UserProfileSerializer(instance=user)
        return Response(serializer.data)