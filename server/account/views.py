from rest_framework import status
from rest_framework.generics import CreateAPIView, RetrieveUpdateAPIView
from rest_framework.response import Response
from .serializers import LogoutSerializer, RegisterSerializer, LoginSerializer
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer, ProfileSerializer, UserPreferencesSerializer
from .selectors import get_or_create_profile, get_or_create_preferences
from .services import update_profile, update_preferences


class RegisterAPIView(CreateAPIView):
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        return Response(
            {
                "message": "User registered successfully.",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                },
            },
            status=status.HTTP_201_CREATED,
        )
        

class LoginAPIView(APIView):

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        return Response(
            serializer.validated_data,
            status=status.HTTP_200_OK,
        )            
        
        
class MeAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)        
    
    
class LogoutAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        print("Inside Logout View")

        serializer = LogoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            {"message": "Logged out successfully."},
            status=status.HTTP_200_OK,
        )    


class ProfileAPIView(RetrieveUpdateAPIView):
    """
    Retrieve or update the authenticated user's own profile.

    There is no lookup by id in the URL -- the object is always
    request.user's own profile, so there is no cross-user access
    surface to guard against beyond requiring authentication.
    """

    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["get", "put", "patch"]

    def get_object(self):
        return get_or_create_profile(self.request.user)

    def perform_update(self, serializer):
        profile = update_profile(self.request.user, **serializer.validated_data)
        serializer.instance = profile


class PreferencesAPIView(RetrieveUpdateAPIView):
    """
    Retrieve or update the authenticated user's own preferences.
    """

    serializer_class = UserPreferencesSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["get", "put", "patch"]

    def get_object(self):
        return get_or_create_preferences(self.request.user)

    def perform_update(self, serializer):
        preferences = update_preferences(self.request.user, **serializer.validated_data)
        serializer.instance = preferences