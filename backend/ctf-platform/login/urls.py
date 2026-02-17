from django.urls import path
from . import views

urlpatterns = [
    path("api/me/", views.me, name="me"),
    path("api/logout/", views.api_logout, name="api_logout"),
    path("api/challenges/", views.challenges_list, name="challenges_list"),
    path("api/challenges/<int:challenge_id>/submit/", views.submit_flag, name="submit_flag"),
    path("api/stats/", views.user_stats, name="user_stats"),
    path("api/scoreboard/", views.scoreboard, name="scoreboard"),
]