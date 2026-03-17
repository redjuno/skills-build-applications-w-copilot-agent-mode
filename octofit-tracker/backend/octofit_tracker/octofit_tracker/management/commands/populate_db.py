from django.core.management.base import BaseCommand

from octofit_tracker.models import Activity, Leaderboard, Team, User, Workout


class Command(BaseCommand):
    help = 'octofit_db 데이터베이스에 테스트 데이터를 입력합니다.'

    def handle(self, *args, **options):
        Activity.objects.all().delete()
        Leaderboard.objects.all().delete()
        Workout.objects.all().delete()
        Team.objects.all().delete()
        User.objects.all().delete()

        marvel_team = Team.objects.create(name='marvel team', universe='Marvel')
        dc_team = Team.objects.create(name='dc team', universe='DC')

        users = [
            User.objects.create(name='Peter Parker', email='spiderman@octofit.app', hero_alias='Spider-Man'),
            User.objects.create(name='Tony Stark', email='ironman@octofit.app', hero_alias='Iron Man'),
            User.objects.create(name='Bruce Wayne', email='batman@octofit.app', hero_alias='Batman'),
            User.objects.create(name='Diana Prince', email='wonderwoman@octofit.app', hero_alias='Wonder Woman'),
        ]

        self.stdout.write(f'생성된 팀: {marvel_team.name}, {dc_team.name}')

        for payload in [
            {'user': users[0], 'activity_type': 'web-slinging cardio', 'duration_minutes': 45, 'calories_burned': 420},
            {'user': users[1], 'activity_type': 'arc-reactor HIIT', 'duration_minutes': 35, 'calories_burned': 380},
            {'user': users[2], 'activity_type': 'night patrol run', 'duration_minutes': 55, 'calories_burned': 500},
            {'user': users[3], 'activity_type': 'amazon strength circuit', 'duration_minutes': 50, 'calories_burned': 470},
        ]:
            Activity.objects.create(**payload)

        for payload in [
            {'user': users[0], 'workout_name': 'Spider Agility', 'intensity': 'high'},
            {'user': users[1], 'workout_name': 'Stark Power Circuit', 'intensity': 'medium'},
            {'user': users[2], 'workout_name': 'Gotham Endurance', 'intensity': 'high'},
            {'user': users[3], 'workout_name': 'Themyscira Core', 'intensity': 'high'},
        ]:
            Workout.objects.create(**payload)

        for payload in [
            {'user': users[2], 'score': 980, 'rank': 1},
            {'user': users[3], 'score': 950, 'rank': 2},
            {'user': users[0], 'score': 910, 'rank': 3},
            {'user': users[1], 'score': 890, 'rank': 4},
        ]:
            Leaderboard.objects.create(**payload)

        self.stdout.write(self.style.SUCCESS('octofit_db 테스트 데이터 적재 완료'))
