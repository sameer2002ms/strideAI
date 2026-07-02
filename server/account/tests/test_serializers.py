from django.contrib.auth import get_user_model
from django.test import TestCase

from account.serializers import ProfileSerializer, UserPreferencesSerializer

User = get_user_model()


class ProfileSerializerTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="frank", password="StrongPass123!")

    def test_expected_fields_present(self):
        data = ProfileSerializer(self.user.profile).data
        self.assertEqual(
            set(data.keys()),
            {"bio", "avatar_url", "phone_number", "date_of_birth", "created_at", "updated_at"},
        )

    def test_created_and_updated_at_are_read_only(self):
        serializer = ProfileSerializer(
            self.user.profile,
            data={"bio": "hello", "created_at": "2000-01-01T00:00:00Z"},
            partial=True,
        )
        self.assertTrue(serializer.is_valid(), serializer.errors)
        self.assertNotIn("created_at", serializer.validated_data)


class UserPreferencesSerializerTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="grace", password="StrongPass123!")

    def test_expected_fields_present(self):
        data = UserPreferencesSerializer(self.user.preferences).data
        self.assertEqual(
            set(data.keys()),
            {"timezone", "language", "theme", "extra_settings", "created_at", "updated_at"},
        )

    def test_valid_timezone_accepted(self):
        serializer = UserPreferencesSerializer(
            self.user.preferences,
            data={"timezone": "Asia/Kolkata"},
            partial=True,
        )
        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_invalid_timezone_rejected(self):
        serializer = UserPreferencesSerializer(
            self.user.preferences,
            data={"timezone": "Not/A_Real_Zone"},
            partial=True,
        )
        self.assertFalse(serializer.is_valid())
        self.assertIn("timezone", serializer.errors)
