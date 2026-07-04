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