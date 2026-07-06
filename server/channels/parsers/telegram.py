from channels.models import ChannelType
from channels.schemas import IncomingMessage


class TelegramParser:
    def parse(self, payload: dict) -> IncomingMessage:
        message = payload["message"]

        return IncomingMessage(
            channel=ChannelType.TELEGRAM,
            external_user_id=str(message["from"]["id"]),
            chat_id=str(message["chat"]["id"]),
            text=message.get("text", ""),
            username=message["from"].get("username"),
            first_name=message["from"].get("first_name"),
            last_name=message["from"].get("last_name"),
            metadata=payload,
        )