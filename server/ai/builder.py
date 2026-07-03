from conversations.selectors import get_recent_conversation_messages
from memory.selectors import get_memory_dict

from .schemas import (
    AgentContext,
    ConversationContext,
    ConversationMessage,
    MemoryContext,
)


class ContextBuilder:
    """
    Builds the context required by AI agents.

    This class gathers information from different business modules
    (conversation, memory, goals, etc.) and converts it into a
    provider-independent AgentContext.
    """

    @staticmethod
    def build(*, conversation) -> AgentContext:
        """
        Build the complete context for an AI agent.
        """

        messages = get_recent_conversation_messages(
            conversation,
            limit=20,
        )

        memory = get_memory_dict(
            user=conversation.user,
        )

        return AgentContext(
            memory=MemoryContext(
                facts=memory,
            ),
            conversation=ConversationContext(
                messages=[
                    ConversationMessage(
                        role=message.sender,
                        content=message.content,
                    )
                    for message in messages
                ]
            ),
        )