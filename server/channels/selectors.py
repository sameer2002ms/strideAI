from channels.models import ChannelAccount


def get_channel_account(
    *,
    channel: str,
    external_user_id: str,
) -> ChannelAccount | None:
    return (
        ChannelAccount.objects
        .select_related("user")
        .filter(
            channel=channel,
            external_user_id=external_user_id,
            is_active=True,
        )
        .first()
    )


def get_user_channel_accounts(*, user):
    return (
        ChannelAccount.objects
        .filter(user=user, is_active=True)
    )