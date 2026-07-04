from typing import Literal

from pydantic import BaseModel, Field


class PromptMessage(BaseModel):
    """
    A provider-independent chat message.
    """

    role: Literal["system", "user", "assistant"]
    content: str


class Prompt(BaseModel):
    """
    Provider-independent prompt passed to the AI provider.
    """

    messages: list[PromptMessage] = Field(default_factory=list)