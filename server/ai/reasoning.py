from ai.providers.factory import ProviderFactory
from ai.schema import ReasoningResponse


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
        prompt: str,
        system_prompt: str | None = None,
    ) -> ReasoningResponse:
        """
        Generate a response using the configured AI provider.
        """
        return self.provider.generate(
            prompt=prompt,
            system_prompt=system_prompt,
        )