from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from login import views

urlpatterns = [
    path("bobferguson/", admin.site.urls),
    path('api/', views.index),
    path('api/challenges/', views.challenges_list),
    path('api/challenges/<int:challenge_id>/submit/', views.submit_flag),
    path('api/scoreboard/', views.scoreboard),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)