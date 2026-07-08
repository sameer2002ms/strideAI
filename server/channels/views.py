import json
from urllib import request

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from channels.parsers.telegram import TelegramParser
from channels.service import ChannelService
from channels.models import ChannelAccount, ChannelType

@api_view(["POST"])
def telegram_webhook(request):

    payload = request.data
    
    print("Webhook hit!")
    print(request.data)

    if not payload:
        return Response({"error": "empty payload"}, status=400)

    parser = TelegramParser()
    message = parser.parse(payload)

    service = ChannelService()
    result = service.handle_incoming_message(message)

    if isinstance(result, dict) and result.get("status") == "OK":
        service.send_telegram_response(
            chat_id=result["chat_id"],
            text=result["response"],
        )

    elif result == "NOT_LINKED":
        service.send_telegram_response(
            chat_id=message.chat_id,
            text="Please link your account first from web app.",
        )

    elif result == "LINKED":
        service.send_telegram_response(
            chat_id=message.chat_id,
            text="✅ Telegram linked successfully!",
        )

    elif result == "ALREADY_LINKED":
        service.send_telegram_response(
            chat_id=message.chat_id,
            text="Your Telegram account is already linked.",
        )

    elif result == "INVALID_TOKEN":
        service.send_telegram_response(
            chat_id=message.chat_id,
            text="❌ Invalid link token.",
        )

    elif result == "TOKEN_EXPIRED":
        service.send_telegram_response(
            chat_id=message.chat_id,
            text="⏳ Link token expired.",
        )

    return Response({"ok": True})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_telegram_link(request):

    service = ChannelService()

    token_obj = service.create_link_token(
        user=request.user,
        channel=ChannelType.TELEGRAM,
    )

    return Response({
        "token": token_obj.token,
        "expires_at": token_obj.expires_at,
    })


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def telegram_status(request):
    account = (
        ChannelAccount.objects
        .filter(
            user=request.user,
            channel=ChannelType.TELEGRAM,
            is_active=True,
        )
        .only("username", "created_at")
        .first()
    )

    return Response({
        "linked": account is not None,
        "username": (account.username or None) if account else None,
        "linked_at": account.created_at if account else None,
    })


def handle_telegram_link(self, message, token: str):

    account, status = self.link_channel(
        channel="telegram",
        token=token,
        external_user_id=message.external_user_id,
        chat_id=message.chat_id,
        metadata=message.metadata,
    )

    return account, status
