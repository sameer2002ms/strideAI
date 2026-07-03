from abc import ABC, abstractmethod

from ai.prompts import Prompt
from ai.schemas import ReasoningResponse

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
        prompt: Prompt,
    ) -> ReasoningResponse:
        """
        Generate a structured reasoning response
        from a provider-independent prompt.

        Args:
            prompt: Provider-independent prompt.

        Returns:
            Structured reasoning response.
        """
        raise NotImplementedError