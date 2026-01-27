from django.contrib import admin
from django.urls import path, include
from login import views as login_views

urlpatterns = [
    path("admin/", admin.site.urls),
    path("accounts/", include("allauth.urls")),
    path("api/me/", login_views.me, name="me"),
    path("api/logout/", login_views.api_logout, name="api_logout"),
    path("", login_views.index, name="index"),
    path("", include("login.urls")) 
]
