import requests
from django.conf import settings

from channels.adapters.base import BaseChannelAdapter
from channels.schemas import OutgoingMessage


class TelegramAdapter(BaseChannelAdapter):
    channel_name = "telegram"

    def verify_webhook(self, request):
        return True

    def parse(self, payload):
        raise NotImplementedError

    def send(self, message: OutgoingMessage):

        url = f"https://api.telegram.org/bot{settings.TELEGRAM_BOT_TOKEN}/sendMessage"

        response = requests.post(
            url,
            json={
                "chat_id": message.chat_id,
                "text": message.text,
            },
            timeout=10,
        )

        response.raise_for_status()