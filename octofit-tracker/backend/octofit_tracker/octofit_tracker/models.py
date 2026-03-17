from bson import ObjectId
from djongo import models


class User(models.Model):
    id = models.ObjectIdField(primary_key=True, default=ObjectId, editable=False)
    name = models.CharField(max_length=120)
    email = models.EmailField(unique=True)
    hero_alias = models.CharField(max_length=120)

    class Meta:
        db_table = 'users'

    def __str__(self):
        return f"{self.name} ({self.hero_alias})"


class Team(models.Model):
    id = models.ObjectIdField(primary_key=True, default=ObjectId, editable=False)
    name = models.CharField(max_length=80, unique=True)
    universe = models.CharField(max_length=40)

    class Meta:
        db_table = 'teams'

    def __str__(self):
        return self.name


class Activity(models.Model):
    id = models.ObjectIdField(primary_key=True, default=ObjectId, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities')
    activity_type = models.CharField(max_length=80)
    duration_minutes = models.PositiveIntegerField()
    calories_burned = models.PositiveIntegerField()

    class Meta:
        db_table = 'activities'

    def __str__(self):
        return f"{self.activity_type} - {self.user.name}"


class Leaderboard(models.Model):
    id = models.ObjectIdField(primary_key=True, default=ObjectId, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='leaderboard_entries')
    score = models.PositiveIntegerField(default=0)
    rank = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = 'leaderboard'

    def __str__(self):
        return f"#{self.rank} {self.user.name} ({self.score})"


class Workout(models.Model):
    id = models.ObjectIdField(primary_key=True, default=ObjectId, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='workouts')
    workout_name = models.CharField(max_length=120)
    intensity = models.CharField(max_length=40)

    class Meta:
        db_table = 'workouts'

    def __str__(self):
        return f"{self.workout_name} - {self.user.name}"
