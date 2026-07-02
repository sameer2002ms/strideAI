from django.urls import path

from .views import (
    LogoutAPIView,
    RegisterAPIView,
    LoginAPIView,
    MeAPIView,
    ProfileAPIView,
    PreferencesAPIView,
)

urlpatterns = [
    path("register/", RegisterAPIView.as_view(), name="register"),
    path("login/", LoginAPIView.as_view(), name="login"),
    path("me/", MeAPIView.as_view(), name="me"),
    path("logout/", LogoutAPIView.as_view(), name="logout"),
    path("me/profile/", ProfileAPIView.as_view(), name="me-profile"),
    path("me/preferences/", PreferencesAPIView.as_view(), name="me-preferences"),
]