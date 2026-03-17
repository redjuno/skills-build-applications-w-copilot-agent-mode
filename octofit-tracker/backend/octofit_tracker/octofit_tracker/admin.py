from django.contrib import admin

from .models import Activity, Leaderboard, Team, User, Workout


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
	list_display = ('name', 'email', 'hero_alias')
	search_fields = ('name', 'email', 'hero_alias')


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
	list_display = ('name', 'universe')
	search_fields = ('name', 'universe')


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
	list_display = ('activity_type', 'user', 'duration_minutes', 'calories_burned')
	list_filter = ('activity_type',)


@admin.register(Leaderboard)
class LeaderboardAdmin(admin.ModelAdmin):
	list_display = ('rank', 'user', 'score')
	ordering = ('rank',)


@admin.register(Workout)
class WorkoutAdmin(admin.ModelAdmin):
	list_display = ('workout_name', 'user', 'intensity')
	list_filter = ('intensity',)
