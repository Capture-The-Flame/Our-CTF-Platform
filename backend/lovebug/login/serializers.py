from django.conf import settings
from rest_framework import serializers
from .models import Challenge, UserChallenge

class ChallengeSerializer(serializers.ModelSerializer):
    completed = serializers.SerializerMethodField()
    points = serializers.SerializerMethodField()
    artifact_url = serializers.SerializerMethodField()  # KEEP THIS!

    class Meta:
        model = Challenge
        fields = [
            'id',
            'title',
            'description',
            'prompt',
            'category',
            'points',
            'is_active',
            'completed',
            'hint_1',
            'hint_2',
            'hint_3',
            'artifact_url',  
        ]

    def get_points(self, obj):
        return obj.current_points

    def get_artifact_url(self, obj):
        if not obj.artifact_path:
            return None
        
        # If it's already a full URL (Google Drive), return as-is
        if obj.artifact_path.startswith('http'):
            return obj.artifact_path
        
        # Otherwise, build the media URL
        request = self.context.get("request")
        if request:
            return request.build_absolute_uri(f"{settings.MEDIA_URL}{obj.artifact_path}")
        return f"{settings.MEDIA_URL}{obj.artifact_path}"

    def get_completed(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return UserChallenge.objects.filter(user=request.user, challenge=obj).exists()
        return False

class UserChallengeSerializer(serializers.ModelSerializer):
    challenge_title = serializers.CharField(source='challenge.title', read_only=True)

    class Meta:
        model = UserChallenge
        fields = ['challenge_title', 'completed_at', 'awarded_points']