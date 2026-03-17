from django.test import TestCase
from rest_framework.test import APIClient

from .models import Activity, Leaderboard, Team, User, Workout


class OctofitApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create(
            name='Peter Parker',
            email='spiderman@test.app',
            hero_alias='Spider-Man',
        )
        self.team = Team.objects.create(name='marvel team', universe='Marvel')
        self.activity = Activity.objects.create(
            user=self.user,
            activity_type='web-slinging cardio',
            duration_minutes=45,
            calories_burned=420,
        )
        self.leaderboard = Leaderboard.objects.create(user=self.user, score=900, rank=1)
        self.workout = Workout.objects.create(
            user=self.user,
            workout_name='Spider Agility',
            intensity='high',
        )

    def test_api_root_contains_all_collections(self):
        response = self.client.get('/api/')
        self.assertEqual(response.status_code, 200)
        self.assertIn('users', response.data)
        self.assertIn('teams', response.data)
        self.assertIn('activities', response.data)
        self.assertIn('leaderboard', response.data)
        self.assertIn('workouts', response.data)

    def test_users_endpoint_returns_data(self):
        response = self.client.get('/api/users/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    def test_teams_endpoint_returns_data(self):
        response = self.client.get('/api/teams/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    def test_activities_endpoint_returns_data(self):
        response = self.client.get('/api/activities/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    def test_leaderboard_endpoint_returns_data(self):
        response = self.client.get('/api/leaderboard/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    def test_workouts_endpoint_returns_data(self):
        response = self.client.get('/api/workouts/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
