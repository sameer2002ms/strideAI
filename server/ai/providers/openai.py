from typing import Type

from django.conf import settings
from openai import OpenAI
from pydantic import BaseModel

from ai.prompts import Prompt

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
        *,
        prompt: Prompt,
        response_model: Type[BaseModel],
    ) -> BaseModel:
        response = self.client.responses.parse(
            model=settings.OPENAI_MODEL,
            input=[
                {
                    "role": message.role,
                    "content": message.content,
                }
                for message in prompt.messages
            ],
            text_format=response_model,
        )

        return response.output_parsed