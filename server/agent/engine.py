from ai.reasoning import ReasoningService
from ai.schema import ReasoningResponse


class AgentEngine:
    """
    Core orchestration engine for AI interactions.

    The Agent Engine coordinates conversations and delegates
    reasoning to the AI layer. It intentionally contains no
    provider-specific logic.
    """

    def __init__(self) -> None:
        self.reasoning = ReasoningService()

    def process_message(
        self,
        message: str,
        system_prompt: str | None = None,
    ) -> ReasoningResponse:
        """
        Process a user message and return the AI response.
        """

        return self.reasoning.generate(
            prompt=message,
            system_prompt=system_prompt,
        )