from abc import ABC, abstractmethod
from typing import Type

from pydantic import BaseModel

from ai.prompts import Prompt


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
        *,
        prompt: Prompt,
        response_model: Type[BaseModel],
    ) -> BaseModel:
        """
        Generate a structured response from the AI model.

        Args:
            prompt: Provider-independent prompt.
            response_model: Pydantic model describing the expected output.

        Returns:
            An instance of the requested Pydantic model.
        """
        raise NotImplementedError