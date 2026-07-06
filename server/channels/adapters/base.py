from abc import ABC, abstractmethod

from channels.schemas import IncomingMessage, OutgoingMessage


class BaseChannelAdapter(ABC):
    """
    Base contract for all communication channels.
    """

    channel_name: str

    @abstractmethod
    def verify_webhook(self, request) -> bool:
        """
        Verify incoming webhook requests.
        """
        raise NotImplementedError

    @abstractmethod
    def parse(self, payload: dict) -> IncomingMessage:
        """
        Convert provider payload into our internal schema.
        """
        raise NotImplementedError

    @abstractmethod
    def send(self, message: OutgoingMessage) -> None:
        """
        Send message through provider.
        """
        raise NotImplementedError