# from datetime import date

# from celery import shared_task

# from goals.models import Goal
# from goals.scheduling import should_create_checkin

# from .models import CheckIn


# @shared_task
# def generate_daily_checkins():
#     """
#     Generate today's check-ins for every active goal
#     whose schedule requires one today.
#     """

#     today = date.today()

#     goals = (
#         Goal.objects
#         .filter(status=Goal.Status.ACTIVE)
#         .select_related("schedule")
#     )

#     created = 0

#     for goal in goals:

#         if not should_create_checkin(
#             schedule=goal.schedule,
#             today=today,
#         ):
#             continue

#         _, created_flag = CheckIn.objects.get_or_create(
#             goal=goal,
#             date=today,
#         )

#         if created_flag:
#             created += 1

#     return {
#         "created": created,
#         "date": str(today),
#     }