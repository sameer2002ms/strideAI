from openai import OpenAI
from django.conf import settings

from ai.schema import ReasoningResponse

from .base import BaseAIProvider


class OpenAIProvider(BaseAIProvider):
    """
    OpenAI implementation of the AI provider interface.
    """

    def __init__(self) -> None:
        self.client = OpenAI(
            api_key=settings.OPENAI_API_KEY,
        )

    def generate(
        self,
        prompt: str,
        system_prompt: str | None = None,
    ) -> ReasoningResponse:
        instructions = system_prompt or ""

        response = self.client.responses.create(
            model=settings.OPENAI_MODEL,
            instructions=instructions,
            input=prompt,
        )

        return ReasoningResponse(
            text=response.output_text,
        )