from dataclasses import dataclass, field
from typing import Any


@dataclass(slots=True)
class IncomingAttachment:
    type: str
    url: str | None = None
    metadata: dict[str, Any] = field(default_factory=dict)


@dataclass(slots=True)
class IncomingMessage:
    channel: str
    external_user_id: str
    chat_id: str
    text: str
    username: str | None = None
    first_name: str | None = None
    last_name: str | None = None
    attachments: list[IncomingAttachment] = field(default_factory=list)
    metadata: dict[str, Any] = field(default_factory=dict)


@dataclass(slots=True)
class OutgoingAttachment:
    type: str
    url: str
    metadata: dict[str, Any] = field(default_factory=dict)


@dataclass(slots=True)
class OutgoingMessage:
    channel: str
    chat_id: str
    text: str
    attachments: list[OutgoingAttachment] = field(default_factory=list)
    metadata: dict[str, Any] = field(default_factory=dict)