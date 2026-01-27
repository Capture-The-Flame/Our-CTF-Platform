from django.http import JsonResponse
from django.contrib.auth import logout
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST


def me(request):
    """Check if user is authenticated and return user data"""
    if not request.user.is_authenticated:
        return JsonResponse({"authenticated": False}, status=401)

    return JsonResponse({
        "authenticated": True,
        "id": request.user.id,
        "email": request.user.email,
        "username": request.user.get_username(),
    })


@csrf_exempt
@require_POST
def api_logout(request):
    logout(request)
    return JsonResponse({"ok": True})


def index(request):
    return JsonResponse({"ok": True, "service": "lovebug-backend"})