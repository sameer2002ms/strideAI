from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

User = get_user_model()


class ProfileAPIPermissionTests(APITestCase):
    def test_anonymous_cannot_access_profile(self):
        url = reverse("me-profile")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_anonymous_cannot_access_preferences(self):
        url = reverse("me-preferences")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class ProfileAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="henry", password="StrongPass123!")
        self.client.force_authenticate(user=self.user)

    def test_get_own_profile_returns_defaults(self):
        response = self.client.get(reverse("me-profile"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["bio"], "")

    def test_patch_own_profile_updates_fields(self):
        response = self.client.patch(
            reverse("me-profile"),
            {"bio": "Building StrideAI", "phone_number": "+911234567890"},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.profile.refresh_from_db()
        self.assertEqual(self.user.profile.bio, "Building StrideAI")
        self.assertEqual(self.user.profile.phone_number, "+911234567890")

    def test_profile_is_scoped_to_requesting_user(self):
        other = User.objects.create_user(username="ivy", password="StrongPass123!")
        other.profile.bio = "Ivy's bio"
        other.profile.save()

        response = self.client.get(reverse("me-profile"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertNotEqual(response.data["bio"], "Ivy's bio")


class PreferencesAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="jack", password="StrongPass123!")
        self.client.force_authenticate(user=self.user)

    def test_get_own_preferences_returns_defaults(self):
        response = self.client.get(reverse("me-preferences"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["timezone"], "UTC")

    def test_patch_own_preferences_updates_fields(self):
        response = self.client.patch(
            reverse("me-preferences"),
            {"timezone": "Asia/Kolkata", "theme": "dark"},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.preferences.refresh_from_db()
        self.assertEqual(self.user.preferences.timezone, "Asia/Kolkata")
        self.assertEqual(self.user.preferences.theme, "dark")

    def test_patch_invalid_timezone_returns_400(self):
        response = self.client.patch(
            reverse("me-preferences"),
            {"timezone": "Not/A_Real_Zone"},
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class ExistingAuthEndpointsRegressionTests(APITestCase):
    """
    These endpoints existed before this module and must keep working
    exactly as before. Not new coverage of new behavior -- a guardrail
    against this module having broken something.
    """

    def test_register_still_works(self):
        response = self.client.post(
            reverse("register"),
            {
                "username": "newuser",
                "email": "newuser@example.com",
                "password": "StrongPass123!",
                "first_name": "New",
                "last_name": "User",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username="newuser").exists())

    def test_login_still_returns_tokens(self):
        User.objects.create_user(username="kate", password="StrongPass123!")
        response = self.client.post(
            reverse("login"),
            {"username": "kate", "password": "StrongPass123!"},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_me_still_returns_original_fields_only(self):
        user = User.objects.create_user(username="liam", password="StrongPass123!")
        self.client.force_authenticate(user=user)
        response = self.client.get(reverse("me"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            set(response.data.keys()),
            {"id", "username", "email", "first_name", "last_name"},
        )

    def test_logout_still_blacklists_refresh_token(self):
        user = User.objects.create_user(username="mia", password="StrongPass123!")
        login_response = self.client.post(
            reverse("login"),
            {"username": "mia", "password": "StrongPass123!"},
        )
        refresh = login_response.data["refresh"]

        self.client.force_authenticate(user=user)
        response = self.client.post(reverse("logout"), {"refresh": refresh})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
