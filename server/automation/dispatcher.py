class NotificationDispatcher:
    """
    Responsible for delivering reminders.

    Currently logs to console.
    Later:
    - Telegram
    - WhatsApp
    - Email
    - Push
    """

    @staticmethod
    def send(*, user, payload):
        print(
            f"[Reminder] {user.email}",
            payload,
        )