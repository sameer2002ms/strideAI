from typing import Type

from pydantic import BaseModel

from ai.prompts import Prompt
from ai.providers.factory import ProviderFactory


class ReasoningService:
    """
    Public interface for AI reasoning.

    The rest of the platform should interact only with this
    service and never communicate directly with providers.
    """

    def __init__(self) -> None:
        self.provider = ProviderFactory.get_provider()

    def generate(
        self,
        *,
        prompt: Prompt,
        response_model: Type[BaseModel],
    ) -> BaseModel:
        """
        Generate a structured response using the configured AI provider.
        """
        return self.provider.generate(
            prompt=prompt,
            response_model=response_model,
        )