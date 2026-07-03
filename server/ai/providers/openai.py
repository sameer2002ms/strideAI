from django.conf import settings
from openai import OpenAI

from ai.prompts import Prompt
from ai.schemas import ReasoningResponse
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
        prompt: Prompt,
    ) -> ReasoningResponse:
        response = self.client.responses.create(
            model=settings.OPENAI_MODEL,
            input=[
                {
                    "role": message.role,
                    "content": message.content,
                }
                for message in prompt.messages
            ],
        )

        return ReasoningResponse(
            text=response.output_text,
        )