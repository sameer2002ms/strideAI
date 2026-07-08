from django.utils import timezone

from channels.models import ChannelAccount, ChannelLinkToken, ChannelType
from channels.selectors import get_channel_account
from .adapters.telegram import TelegramAdapter
from .schemas import OutgoingMessage
from .schemas import OutgoingMessage
from conversations.services import get_or_create_active_conversation, send_message

class ChannelService:

    def create_link_token(self, user, channel=ChannelType.TELEGRAM):
        return ChannelLinkToken.create_for_user(
            user=user,
            channel=channel,
        )

    def link_channel(self, *, channel: str, token: str, external_user_id: str, chat_id: str, metadata: dict = None):

        metadata = metadata or {}

        link_token = (
            ChannelLinkToken.objects
            .select_related("user")
            .filter(token=token, channel=channel, is_used=False)
            .first()
        )

        if not link_token:
            return None, "INVALID_TOKEN"

        if link_token.is_expired():
            return None, "TOKEN_EXPIRED"

        # Check if already linked
        existing = get_channel_account(
            channel=channel,
            external_user_id=external_user_id,
        )

        if existing:
            # A valid one-time token proves access to the target web account,
            # while this message proves control of the Telegram account. This
            # safely supports moving Telegram from an old StrideAI account.
            if existing.user_id != link_token.user_id:
                telegram_user = metadata.get("message", {}).get("from", {})
                existing.user = link_token.user
                existing.chat_id = chat_id
                existing.username = telegram_user.get("username", "")
                existing.first_name = telegram_user.get("first_name", "")
                existing.last_name = telegram_user.get("last_name", "")
                existing.metadata = metadata
                existing.is_active = True
                existing.save()

                link_token.is_used = True
                link_token.save(update_fields=["is_used"])
                return existing, "LINKED"

            link_token.is_used = True
            link_token.save(update_fields=["is_used"])
            return existing, "ALREADY_LINKED"

        telegram_user = metadata.get("message", {}).get("from", {})

        account = ChannelAccount.objects.create(
            user=link_token.user,
            channel=channel,
            external_user_id=external_user_id,
            chat_id=chat_id,
            username=telegram_user.get("username", ""),
            first_name=telegram_user.get("first_name", ""),
            last_name=telegram_user.get("last_name", ""),
            metadata=metadata,
        )

        link_token.is_used = True
        link_token.save(update_fields=["is_used"])

        return account, "LINKED"
    
    def handle_telegram_link(self, message, token: str):

        account, status = self.link_channel(
            channel="telegram",
            token=token,
            external_user_id=message.external_user_id,
            chat_id=message.chat_id,
            metadata=message.metadata,
        )

        return account, status
    
    
    def send_telegram_response(self, chat_id: str, text: str):

        adapter = TelegramAdapter()

        print("DEBUG chat_id:", chat_id)
        print("DEBUG text:", text)

        adapter.send(
            OutgoingMessage(
                channel="telegram",
                chat_id=str(chat_id),   # 🔥 FORCE STRING
                text=text or "EMPTY_MESSAGE",
            )
        )
        
        
    def handle_incoming_message(self, message):
        from channels.models import ChannelAccount, ChannelLinkToken

        account = get_channel_account(
            channel=message.channel,
            external_user_id=message.external_user_id,
        )

        if not account:
            return self._handle_unlinked(message)

        return self._handle_linked(message, account)


    def _handle_unlinked(self, message):

        text = (message.text or "").strip()

        if text.startswith("/link"):
            token = text.replace("/link", "").strip()

            account, status = self.link_channel(
                channel="telegram",
                token=token,
                external_user_id=message.external_user_id,
                chat_id=message.chat_id,
                metadata=message.metadata,
            )

            return status

        return "NOT_LINKED"


    def _handle_linked(self, message, account):

        # 1. Get or create conversation
        conversation = get_or_create_active_conversation(
            user=account.user,
            channel=message.channel,
        )

        # 2. Send message into conversation system (AI pipeline already inside)
        user_msg, assistant_msg = send_message(
            conversation=conversation,
            content=message.text,
        )

        # 3. Return AI response text
        return {
            "status": "OK",
            "response": assistant_msg.content,
            "chat_id": message.chat_id,
        }
