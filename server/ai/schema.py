from pydantic import BaseModel


class ReasoningResponse(BaseModel):
    """
    Standard response returned by the AI reasoning layer.
    """

    text: str