from django.contrib import admin
from .models import Challenge, UserChallenge

@admin.register(Challenge)
class ChallengeAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'points', 'is_active', 'created_at']
    list_filter = ['category', 'is_active']
    search_fields = ['title', 'description']
    ordering = ['points', 'title']

@admin.register(UserChallenge)
class UserChallengeAdmin(admin.ModelAdmin):
    list_display = ['user', 'challenge', 'completed_at']
    list_filter = ['completed_at', 'challenge__category']
    search_fields = ['user__username', 'user__email', 'challenge__title']
    ordering = ['-completed_at']

