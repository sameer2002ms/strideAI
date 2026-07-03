from pydantic import BaseModel, Field


class MemoryFact(BaseModel):
    key: str
    value: str


class MemoryExtraction(BaseModel):
    memories: list[MemoryFact] = Field(default_factory=list)