from django.contrib import admin
from .models import Challenge, UserChallenge

@admin.register(Challenge)
class ChallengeAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'base_points', 'current_points', 'solves_count', 'is_active')
    list_filter = ('category', 'is_active')
    search_fields = ('title', 'description')
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'category')
        }),
        ('Scoring', {
            'fields': ('base_points', 'decrement', 'min_points', 'solves_count')
        }),
        ('Challenge Content', {
            'fields': ('description', 'prompt', 'flag', 'artifact_path')
        }),
        ('Hints', {
            'fields': ('hint_1', 'hint_2', 'hint_3'),
            'classes': ('collapse',)
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
    )
    
    readonly_fields = ('solves_count',)

@admin.register(UserChallenge)
class UserChallengeAdmin(admin.ModelAdmin):
    list_display = ('get_username', 'challenge', 'completed_at', 'awarded_points') 
    list_filter = ('completed_at',)
    search_fields = ('user__username', 'user__email', 'challenge__title') 
    readonly_fields = ('completed_at', 'awarded_points')
    
    def get_username(self, obj):
        return obj.user.username
    get_username.short_description = 'Username'
    get_username.admin_order_field = 'user__username'