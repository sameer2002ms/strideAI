from abc import ABC, abstractmethod

from ai.schema import ReasoningResponse


class BaseAIProvider(ABC):
    """
    Base contract for all AI providers.

    Every provider (OpenAI, Anthropic, Gemini, etc.)
    must implement this interface so the rest of the
    platform remains provider-agnostic.
    """

    @abstractmethod
    def generate(
        self,
        prompt: str,
        system_prompt: str | None = None,
    ) -> ReasoningResponse:
        """
        Generate a text response from the AI model.

        Args:
            prompt: The user prompt.
            system_prompt: Optional system instruction.

        Returns:
            Generated response as plain text.
        """
        raise NotImplementedError