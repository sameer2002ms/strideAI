from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from channels.models import ChannelAccount, ChannelType


User = get_user_model()


class TelegramStatusAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="telegram-user",
            password="StrongPass123!",
        )

    def test_status_requires_authentication(self):
        response = self.client.get(reverse("telegram-status"))

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_status_returns_unlinked_without_account(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.get(reverse("telegram-status"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data["linked"])
        self.assertIsNone(response.data["username"])

    def test_status_returns_linked_for_active_telegram_account(self):
        ChannelAccount.objects.create(
            user=self.user,
            channel=ChannelType.TELEGRAM,
            external_user_id="12345",
            chat_id="12345",
            username="stride_user",
        )
        self.client.force_authenticate(user=self.user)

        response = self.client.get(reverse("telegram-status"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["linked"])
        self.assertEqual(response.data["username"], "stride_user")
        self.assertIsNotNone(response.data["linked_at"])
