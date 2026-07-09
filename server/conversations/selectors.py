"""
Read-side accessors for the conversations app.
"""

from __future__ import annotations

from django.http import Http404

from .models import Conversation, Message


def get_user_conversations(user, status=None):
    queryset = (
        Conversation.objects
        .filter(user=user)
        .prefetch_related("messages")
    )

    if status:
        queryset = queryset.filter(status=status)

    return queryset


def get_user_conversation_or_404(user, conversation_id):
    try:
        return (
            Conversation.objects
            .prefetch_related("messages")
            .get(
                user=user,
                pk=conversation_id,
            )
        )
    except Conversation.DoesNotExist:
        raise Http404("Conversation not found.")


def get_conversation_messages(conversation):
    return (
        Message.objects
        .filter(conversation=conversation)
        .order_by("created_at")
    )
    
    
def get_recent_conversation_messages(
    conversation,
    *,
    limit: int = 20,
):
    """
    Return the most recent conversation messages in chronological order.
    """

    messages = list(
        Message.objects
        .filter(conversation=conversation)
        .order_by("-created_at")[:limit]
    )

    return list(reversed(messages))



def get_active_conversation(*, user, channel):
    return (
        Conversation.objects
        .filter(
            user=user,
            channel=channel,
            status=Conversation.Status.ACTIVE,
        )
        .order_by("-created_at")
        .first()
    )
    
from datetime import timedelta

from django.utils import timezone


def has_recent_user_activity(
    *,
    user,
    minutes: int = 30,
) -> bool:
    """
    Returns True if the user has sent any message within
    the last `minutes`.

    Used by reminder system to avoid sending reminders
    while the user is actively engaged.
    """

    cutoff = timezone.now() - timedelta(minutes=minutes)

    return Message.objects.filter(
        conversation__user=user,
        sender=Message.Sender.USER,
        created_at__gte=cutoff,
    ).exists()    