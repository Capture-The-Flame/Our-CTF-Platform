import re
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from django.utils.crypto import get_random_string
from django.conf import settings

class SocialAccountAdapter(DefaultSocialAccountAdapter):
    def populate_user(self, request, sociallogin, data):
        user = super().populate_user(request, sociallogin, data)

        if not user.username:
            email = (user.email or data.get("email") or "").lower()
            base = re.sub(r"[^a-z0-9]+", "", email.split("@")[0])[:20] or "user"
            candidate = base

            from django.contrib.auth import get_user_model
            User = get_user_model()

            while User.objects.filter(username=candidate).exists():
                candidate = f"{base}{get_random_string(4).lower()}"

            user.username = candidate

        return user
    
    def get_login_redirect_url(self, request):
        return f"{settings.FRONTEND_URL}/auth/callback"