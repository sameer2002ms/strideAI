from channels.adapters.base import BaseChannelAdapter


class ChannelRegistry:
    _registry: dict[str, BaseChannelAdapter] = {}

    @classmethod
    def register(
        cls,
        adapter: BaseChannelAdapter,
    ) -> None:
        cls._registry[adapter.channel_name] = adapter

    @classmethod
    def get(
        cls,
        channel: str,
    ) -> BaseChannelAdapter:
        return cls._registry[channel]