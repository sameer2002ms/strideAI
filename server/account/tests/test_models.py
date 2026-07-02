from django.contrib.auth import get_user_model
from django.test import TestCase

from account.models import Profile, UserPreferences

User = get_user_model()


class UserProfilePreferencesSignalTests(TestCase):
    """
    Confirms Profile/UserPreferences are auto-provisioned whenever a
    User is created, no matter how it's created (create_user here;
    the same signal covers Django admin / createsuperuser too).
    """

    def test_creating_user_auto_creates_profile(self):
        user = User.objects.create_user(username="alice", password="StrongPass123!")
        self.assertTrue(Profile.objects.filter(user=user).exists())

    def test_creating_user_auto_creates_preferences(self):
        user = User.objects.create_user(username="bob", password="StrongPass123!")
        self.assertTrue(UserPreferences.objects.filter(user=user).exists())

    def test_saving_user_again_does_not_duplicate_profile(self):
        user = User.objects.create_user(username="carol", password="StrongPass123!")
        user.first_name = "Carol"
        user.save()  # created=False on this save
        self.assertEqual(Profile.objects.filter(user=user).count(), 1)
        self.assertEqual(UserPreferences.objects.filter(user=user).count(), 1)


class ProfileModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="dave", password="StrongPass123!")

    def test_default_field_values(self):
        profile = self.user.profile
        self.assertEqual(profile.bio, "")
        self.assertEqual(profile.avatar_url, "")
        self.assertEqual(profile.phone_number, "")
        self.assertIsNone(profile.date_of_birth)

    def test_str_representation(self):
        profile = self.user.profile
        self.assertEqual(str(profile), f"Profile<{self.user.id}>")


class UserPreferencesModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="erin", password="StrongPass123!")

    def test_default_field_values(self):
        preferences = self.user.preferences
        self.assertEqual(preferences.timezone, "UTC")
        self.assertEqual(preferences.language, "en")
        self.assertEqual(preferences.theme, UserPreferences.Theme.SYSTEM)
        self.assertEqual(preferences.extra_settings, {})

    def test_str_representation(self):
        preferences = self.user.preferences
        self.assertEqual(str(preferences), f"Preferences<{self.user.id}>")
