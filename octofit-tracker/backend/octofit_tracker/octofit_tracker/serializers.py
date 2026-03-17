from rest_framework import serializers

from .models import Activity, Leaderboard, Team, User, Workout


class ObjectIdStringField(serializers.Field):
    def to_representation(self, value):
        return str(value)

    def to_internal_value(self, data):
        return str(data)


class UserSerializer(serializers.ModelSerializer):
    id = ObjectIdStringField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'hero_alias']


class TeamSerializer(serializers.ModelSerializer):
    id = ObjectIdStringField(read_only=True)

    class Meta:
        model = Team
        fields = ['id', 'name', 'universe']


class ActivitySerializer(serializers.ModelSerializer):
    id = ObjectIdStringField(read_only=True)

    class Meta:
        model = Activity
        fields = ['id', 'user', 'activity_type', 'duration_minutes', 'calories_burned']


class LeaderboardSerializer(serializers.ModelSerializer):
    id = ObjectIdStringField(read_only=True)

    class Meta:
        model = Leaderboard
        fields = ['id', 'user', 'score', 'rank']


class WorkoutSerializer(serializers.ModelSerializer):
    id = ObjectIdStringField(read_only=True)

    class Meta:
        model = Workout
        fields = ['id', 'user', 'workout_name', 'intensity']
