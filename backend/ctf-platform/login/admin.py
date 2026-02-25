from django.contrib import admin
from .models import Challenge, UserChallenge


def recompute_challenge(challenge: Challenge):
    solves = UserChallenge.objects.filter(challenge=challenge).count()
    challenge.solves_count = solves
    challenge.current_points = max(
        challenge.min_points,
        challenge.base_points - solves * challenge.decrement
    )
    challenge.save(update_fields=["solves_count", "current_points"])


@admin.action(description="Reset selected challenges (solves=0, current_points=base_points)")
def reset_selected_challenges(modeladmin, request, queryset):
    for c in queryset:
        c.solves_count = 0
        c.current_points = c.base_points  
        c.save(update_fields=["solves_count", "current_points"])


@admin.action(description="Delete selected user challenges (and recompute challenge points)")
def delete_user_challenges_and_recompute(modeladmin, request, queryset):
    affected = list(
        Challenge.objects.filter(userchallenge__in=queryset).distinct()
    )
    queryset.delete()
    for ch in affected:
        recompute_challenge(ch)


@admin.register(Challenge)
class ChallengeAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'base_points', 'current_points', 'solves_count', 'is_active')
    list_filter = ('category', 'is_active')
    search_fields = ('title', 'description')

    fieldsets = (
        ('Basic Information', {'fields': ('title', 'category')}),
        ('Scoring', {'fields': ('base_points', 'decrement', 'min_points', 'solves_count')}),
        ('Challenge Content', {'fields': ('description', 'prompt', 'flag', 'artifact_path')}),
        ('Hints', {'fields': ('hint_1', 'hint_2', 'hint_3'), 'classes': ('collapse',)}),
        ('Status', {'fields': ('is_active',)}),
    )

    readonly_fields = ('solves_count',)
    actions = [reset_selected_challenges]


@admin.register(UserChallenge)
class UserChallengeAdmin(admin.ModelAdmin):
    list_display = ('get_username', 'challenge', 'completed_at', 'awarded_points')
    list_filter = ('completed_at',)
    search_fields = ('user__username', 'user__email', 'challenge__title')
    readonly_fields = ('completed_at', 'awarded_points')
    actions = [delete_user_challenges_and_recompute]

    def get_username(self, obj):
        return obj.user.username

    get_username.short_description = 'Username'
    get_username.admin_order_field = 'user__username'