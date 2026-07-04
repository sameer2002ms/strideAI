from conversations.selectors import get_recent_conversation_messages

from memory.selectors import MemorySelector
from .schemas import (
    AgentContext,
    ConversationContext,
    ConversationMessage,
    MemoryContext,
    GoalContext
)
from goals.models import Goal
from goals.selectors import get_user_goals

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

        memory = MemorySelector.memory_dict(
            user=conversation.user,
        )
        
        goals = get_user_goals(
            conversation.user,
            status=Goal.Status.ACTIVE,
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
            goals=[
                GoalContext(
                    title=goal.title,
                    description=goal.description,
                    frequency=goal.schedule.frequency,
                    status=goal.status,
                )
                for goal in goals
            ],
        )