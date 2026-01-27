from django.urls import path
from . import views

urlpatterns = [
    path("api/me/", views.me, name="me"),
    path("api/logout/", views.api_logout, name="api_logout"),
]