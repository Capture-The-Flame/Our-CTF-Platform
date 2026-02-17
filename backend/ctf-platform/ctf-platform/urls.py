from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from login import views

urlpatterns = [
    path("bobferguson/", admin.site.urls),
    path('accounts/', include('allauth.urls')),
    path('api/', views.index),
    path('api/me/', views.me),
    path('api/logout/', views.api_logout),
    path('api/challenges/', views.challenges_list),
    path('api/challenges/<int:challenge_id>/submit/', views.submit_flag),
    path('api/stats/', views.user_stats),
    path('api/scoreboard/', views.scoreboard),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)