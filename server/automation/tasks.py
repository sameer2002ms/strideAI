from datetime import date

from celery import shared_task

from goals.models import Goal
from goals.scheduling import should_create_checkin

from checkins.models import CheckIn
from django.contrib.auth import get_user_model

from goals.selectors import get_goals_due_for_reminder
from conversations.selectors import has_recent_user_activity
from collections import defaultdict

from .dispatcher import NotificationDispatcher
from .reminders import ReminderEngine
from .behavior_engine import BehaviorEngine

User = get_user_model()

@shared_task
def generate_daily_checkins():
    """
    Generate today's check-ins for every active goal
    whose schedule requires one today.
    """

    today = date.today()

    goals = (
        Goal.objects
        .filter(status=Goal.Status.ACTIVE)
        .select_related("schedule")
    )

    created = 0

    for goal in goals:

        if not should_create_checkin(
            schedule=goal.schedule,
            today=today,
        ):
            continue

        _, created_flag = CheckIn.objects.get_or_create(
            goal=goal,
            date=today,
        )

        if created_flag:
            created += 1

    return {
        "created": created,
        "date": str(today),
    }
    


@shared_task
def send_pending_reminders():

    # Goals whose reminder time matches the current minute
    due_goals = get_goals_due_for_reminder()

    # Group goals by user
    user_goals = defaultdict(list)

    for goal in due_goals:
        user_goals[goal.user].append(goal)

    # Process one reminder per user
    for user, goals in user_goals.items():

        # Build reminder payload for only the due goals
        payload = ReminderEngine.build_payload(
            user=user,
            goals=goals,
        )

        # Decide reminder tone/content
        decision = BehaviorEngine.analyze(
            user=user,
            pending_checkins=payload,
        )

        if decision.type == "none":
            continue

        # Don't interrupt if the user is already chatting
        if has_recent_user_activity(
            user=user,
            minutes=30,
        ):
            print(
                f"[Reminder] Skipping {user.email} "
                "(recent conversation activity)"
            )
            continue

        # Send one notification
        NotificationDispatcher.send(
            user=user,
            payload={
                "type": decision.type,
                "message": decision.message,
                "data": payload,
            },
        )