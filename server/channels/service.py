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
            return existing, "ALREADY_LINKED"

        account = ChannelAccount.objects.create(
            user=link_token.user,
            channel=channel,
            external_user_id=external_user_id,
            chat_id=chat_id,
            metadata=metadata,
        )

        link_token.is_used = True
        link_token.save()

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

        adapter.send(
            OutgoingMessage(
                channel="telegram",
                chat_id=chat_id,
                text=text,
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