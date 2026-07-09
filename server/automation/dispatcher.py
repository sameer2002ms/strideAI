from channels.models import ChannelAccount, ChannelType
from channels.adapters.telegram import TelegramAdapter
from channels.schemas import OutgoingMessage


class NotificationDispatcher:

    @staticmethod
    def send(*, user, payload):

        telegram = (
            ChannelAccount.objects
            .filter(
                user=user,
                channel=ChannelType.TELEGRAM,
                is_active=True,
            )
            .first()
        )

        if not telegram:
            print(f"No Telegram account linked for {user.email}")
            return

        TelegramAdapter().send(
            OutgoingMessage(
                channel="telegram",
                chat_id=telegram.chat_id,
                text=payload["message"],
            )
        )