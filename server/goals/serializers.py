from rest_framework import serializers

from .models import Goal, GoalSchedule
from .services import create_goal, update_goal


class GoalScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = GoalSchedule
        fields = (
            "frequency",
            "days_of_week",
            "day_of_month",
            "interval",
            "start_date",
            "end_date",
            "custom_rule",
        )

    def validate_days_of_week(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError("days_of_week must be a list of integers.")
        for day in value:
            if not isinstance(day, int) or isinstance(day, bool) or not (0 <= day <= 6):
                raise serializers.ValidationError(
                    "Each day must be an integer 0-6 (Monday=0 ... Sunday=6)."
                )
        return value

    def validate_interval(self, value):
        if value < 1:
            raise serializers.ValidationError("interval must be at least 1.")
        return value


class GoalSerializer(serializers.ModelSerializer):
    """
    `status` is read-only here on purpose: it can only change through
    the dedicated pause/resume/archive endpoints, which enforce valid
    state transitions. Allowing it through general update would let
    a client set any status directly, bypassing that validation.
    """

    schedule = GoalScheduleSerializer()

    class Meta:
        model = Goal
        fields = (
            "id",
            "title",
            "description",
            "status",
            "metadata",
            "schedule",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "status", "created_at", "updated_at")

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Propagate partial=True (set on PATCH requests) down to the
        # nested schedule serializer -- DRF doesn't do this by default,
        # which would otherwise force every schedule field to be
        # re-supplied on every partial update of the parent goal.
        if self.partial:
            self.fields["schedule"].partial = True

    def create(self, validated_data):
        schedule_data = validated_data.pop("schedule")
        user = self.context["request"].user
        return create_goal(user, schedule_data=schedule_data, **validated_data)

    def update(self, instance, validated_data):
        schedule_data = validated_data.pop("schedule", None)
        return update_goal(instance, schedule_data=schedule_data, **validated_data)