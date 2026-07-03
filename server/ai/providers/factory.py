from django.conf import settings

from .base import BaseAIProvider
from .openai import OpenAIProvider


class ProviderFactory:
    """
    Factory responsible for returning the configured AI provider.
    """

    @staticmethod
    def get_provider() -> BaseAIProvider:
        provider = settings.AI_PROVIDER.lower()

        if provider == "openai":
            return OpenAIProvider()

        raise ValueError(
            f"Unsupported AI provider: {provider}"
        )