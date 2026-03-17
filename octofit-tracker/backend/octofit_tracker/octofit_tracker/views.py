from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Activity, Leaderboard, Team, User, Workout
from .serializers import (
    ActivitySerializer,
    LeaderboardSerializer,
    TeamSerializer,
    UserSerializer,
    WorkoutSerializer,
)


@api_view(['GET'])
def api_root(request):
    return Response(
        {
            'users': request.build_absolute_uri('/api/users/'),
            'teams': request.build_absolute_uri('/api/teams/'),
            'activities': request.build_absolute_uri('/api/activities/'),
            'leaderboard': request.build_absolute_uri('/api/leaderboard/'),
            'workouts': request.build_absolute_uri('/api/workouts/'),
        }
    )


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('name')
    serializer_class = UserSerializer
    lookup_field = 'id'


class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all().order_by('name')
    serializer_class = TeamSerializer
    lookup_field = 'id'


class ActivityViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.all().order_by('activity_type')
    serializer_class = ActivitySerializer
    lookup_field = 'id'


class LeaderboardViewSet(viewsets.ModelViewSet):
    queryset = Leaderboard.objects.all().order_by('rank')
    serializer_class = LeaderboardSerializer
    lookup_field = 'id'


class WorkoutViewSet(viewsets.ModelViewSet):
    queryset = Workout.objects.all().order_by('workout_name')
    serializer_class = WorkoutSerializer
    lookup_field = 'id'
