from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from channels.models import ChannelAccount, ChannelType
from channels.schemas import IncomingMessage
from channels.service import ChannelService


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


class TelegramRelinkingTests(APITestCase):
    def test_valid_token_moves_existing_telegram_account_to_current_user(self):
        old_user = User.objects.create_user(username="old-user")
        new_user = User.objects.create_user(username="new-user")
        account = ChannelAccount.objects.create(
            user=old_user,
            channel=ChannelType.TELEGRAM,
            external_user_id="12345",
            chat_id="12345",
        )
        token = ChannelService().create_link_token(new_user)

        linked_account, link_status = ChannelService().link_channel(
            channel=ChannelType.TELEGRAM,
            token=token.token,
            external_user_id="12345",
            chat_id="12345",
            metadata={
                "message": {
                    "from": {
                        "username": "stride_user",
                        "first_name": "Stride",
                    },
                },
            },
        )

        account.refresh_from_db()
        token.refresh_from_db()
        self.assertEqual(link_status, "LINKED")
        self.assertEqual(linked_account.pk, account.pk)
        self.assertEqual(account.user, new_user)
        self.assertEqual(account.username, "stride_user")
        self.assertTrue(token.is_used)

    def test_link_command_is_processed_before_existing_account_chat(self):
        old_user = User.objects.create_user(username="previous-owner")
        new_user = User.objects.create_user(username="current-owner")
        account = ChannelAccount.objects.create(
            user=old_user,
            channel=ChannelType.TELEGRAM,
            external_user_id="443980788",
            chat_id="443980788",
        )
        token = ChannelService().create_link_token(new_user)
        message = IncomingMessage(
            channel=ChannelType.TELEGRAM,
            external_user_id="443980788",
            chat_id="443980788",
            text=f"/link {token.token}",
            first_name="Sameer",
            metadata={
                "message": {
                    "from": {
                        "id": 443980788,
                        "first_name": "Sameer",
                    },
                },
            },
        )

        link_status = ChannelService().handle_incoming_message(message)

        account.refresh_from_db()
        self.assertEqual(link_status, "LINKED")
        self.assertEqual(account.user, new_user)

    def test_start_deep_link_connects_telegram_account(self):
        user = User.objects.create_user(username="deep-link-user")
        token = ChannelService().create_link_token(user)
        message = IncomingMessage(
            channel=ChannelType.TELEGRAM,
            external_user_id="98765",
            chat_id="98765",
            text=f"/start {token.token}",
            metadata={"message": {"from": {"id": 98765}}},
        )

        link_status = ChannelService().handle_incoming_message(message)

        self.assertEqual(link_status, "LINKED")
        self.assertTrue(
            ChannelAccount.objects.filter(
                user=user,
                channel=ChannelType.TELEGRAM,
                external_user_id="98765",
            ).exists()
        )
