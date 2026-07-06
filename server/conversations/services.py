"""
Write-side business logic for the conversations app.
"""

from __future__ import annotations

from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import ValidationError

from .models import Conversation, Message
from agent.engine import AgentEngine

from .selectors import get_active_conversation

@transaction.atomic
def create_conversation(
    user,
    *,
    channel,
    metadata=None,
) -> Conversation:
    """
    Create a new conversation.

    Every conversation starts in ACTIVE state.
    """

    return Conversation.objects.create(
        user=user,
        channel=channel,
        metadata=metadata or {},
    )


@transaction.atomic
def add_message(
    conversation: Conversation,
    *,
    sender,
    content,
    message_type=Message.MessageType.TEXT,
    metadata=None,
) -> Message:
    """
    Add a message to an active conversation.
    """

    if conversation.status != Conversation.Status.ACTIVE:
        raise ValidationError(
            "Messages can only be added to an active conversation."
        )

    return Message.objects.create(
        conversation=conversation,
        sender=sender,
        message_type=message_type,
        content=content,
        metadata=metadata or {},
    )


def end_conversation(conversation: Conversation) -> Conversation:
    """
    Mark a conversation as completed.
    """

    if conversation.status != Conversation.Status.ACTIVE:
        raise ValidationError(
            "Conversation has already ended."
        )

    conversation.status = Conversation.Status.COMPLETED
    conversation.ended_at = timezone.now()

    conversation.save(
        update_fields=[
            "status",
            "ended_at",
            "updated_at",
        ]
    )

    return conversation


def abandon_conversation(conversation: Conversation) -> Conversation:
    """
    Mark a conversation as abandoned.
    """

    if conversation.status != Conversation.Status.ACTIVE:
        raise ValidationError(
            "Conversation has already ended."
        )

    conversation.status = Conversation.Status.ABANDONED
    conversation.ended_at = timezone.now()

    conversation.save(
        update_fields=[
            "status",
            "ended_at",
            "updated_at",
        ]
    )

    return conversation


def delete_conversation(conversation: Conversation) -> None:
    """
    Hard delete.

    Safe for now because no other modules reference
    Conversation yet.
    """

    conversation.delete()



def get_or_create_active_conversation(*, user, channel):
    conversation = get_active_conversation(
        user=user,
        channel=channel,
    )

    if conversation:
        return conversation

    return create_conversation(
        user=user,
        channel=channel,
    )    
    

@transaction.atomic
def send_message(
    conversation: Conversation,
    *,
    content: str,
) -> tuple[Message, Message]:
    """
    Send a user message and generate the AI response.

    This is the main entry point for every channel
    (Web, Telegram, Voice, WhatsApp).
    """

    # Save user message
    user_message = add_message(
        conversation,
        sender=Message.Sender.USER,
        content=content,
    )

    # Generate AI response
    engine = AgentEngine()

    response = engine.process_message(
        conversation=conversation,
        message=content,
    )
    print("🔥 RAW AI RESPONSE:", response)

    # Save assistant message
    assistant_message = add_message(
        conversation,
        sender=Message.Sender.ASSISTANT,
        content=(response.text if response and response.text else "EMPTY_RESPONSE"),
    )

    return user_message, assistant_message    