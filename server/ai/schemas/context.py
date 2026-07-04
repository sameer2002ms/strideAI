from pydantic import BaseModel, Field


class ConversationMessage(BaseModel):
    role: str
    content: str


class ConversationContext(BaseModel):
    messages: list[ConversationMessage] = Field(default_factory=list)


class MemoryContext(BaseModel):
    facts: dict[str, str] = Field(default_factory=dict)


class GoalContext(BaseModel):
    title: str
    description: str = ""
    frequency: str
    status: str


class AgentContext(BaseModel):
    memory: MemoryContext = Field(default_factory=MemoryContext)
    conversation: ConversationContext = Field(default_factory=ConversationContext)
    goals: list[GoalContext] = Field(default_factory=list)