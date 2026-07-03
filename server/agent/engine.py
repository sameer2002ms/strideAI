from ai.builder import ContextBuilder
from ai.prompts.builder import PromptBuilder
from ai.reasoning import ReasoningService
from ai.schemas import ReasoningResponse


class AgentEngine:
    """
    Core orchestration engine for AI interactions.

    The Agent Engine builds business context, constructs a
    provider-independent prompt, and delegates reasoning
    to the configured AI provider.
    """

    def __init__(self) -> None:
        self.reasoning = ReasoningService()

    def process_message(
        self,
        *,
        conversation,
    ) -> ReasoningResponse:
        """
        Process a conversation and return the AI response.
        """

        context = ContextBuilder.build(
            conversation=conversation,
        )

        prompt = PromptBuilder.build(
            context=context,
        )

        return self.reasoning.generate(
            prompt=prompt,
            response_model=ReasoningResponse,

        )