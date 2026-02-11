from django.http import JsonResponse
from django.contrib.auth import logout
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Challenge, UserChallenge
from .serializers import ChallengeSerializer, UserChallengeSerializer
from django.views.decorators.csrf import ensure_csrf_cookie
from django.db import transaction
from django.db.models import F, Sum, Count
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny

@ensure_csrf_cookie
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

@api_view(['GET'])
def challenges_list(request):
    """Get all active challenges with user completion status"""
    if not request.user.is_authenticated:
        return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)
    
    challenges = Challenge.objects.filter(is_active=True)
    serializer = ChallengeSerializer(challenges, many=True, context={'request': request})
    return Response(serializer.data)


@csrf_exempt 
@api_view(['POST'])
def submit_flag(request, challenge_id):
    if not request.user.is_authenticated:
        return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)

    submitted_flag = request.data.get('flag', '').strip()

    with transaction.atomic():
        try:
            challenge = Challenge.objects.select_for_update().get(id=challenge_id, is_active=True)
        except Challenge.DoesNotExist:
            return Response({"error": "Challenge not found"}, status=status.HTTP_404_NOT_FOUND)

        if UserChallenge.objects.filter(user=request.user, challenge=challenge).exists():
            return Response({"error": "Challenge already completed"}, status=status.HTTP_400_BAD_REQUEST)

        if submitted_flag != challenge.flag:
            return Response({"success": False, "message": "Incorrect flag. Try again!"}, status=status.HTTP_400_BAD_REQUEST)

        awarded = challenge.current_points

        UserChallenge.objects.create(user=request.user, challenge=challenge, awarded_points=awarded)

        Challenge.objects.filter(id=challenge.id).update(solves_count=F('solves_count') + 1)

    return Response({
        "success": True,
        "message": "Correct! Challenge completed!",
        "points": awarded 
    })


@api_view(['GET'])
def user_stats(request):
    """Get user statistics"""
    if not request.user.is_authenticated:
        return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)
    
    completed = UserChallenge.objects.filter(user=request.user).order_by('-completed_at')
    total_points = completed.aggregate(total=Sum('awarded_points'))['total'] or 0
    
    return Response({
        "challenges_completed": completed.count(),
        "total_points": total_points,
        "recent_completions": UserChallengeSerializer(completed[:5], many=True).data
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def scoreboard(request):
    """Get top users by points"""
    from django.contrib.auth.models import User
    
    users = User.objects.annotate(
        total_points=Sum('completed_challenges__awarded_points'),
        challenges_count=Count('completed_challenges')
    ).filter(total_points__isnull=False).order_by('-total_points', 'challenges_count')[:10]
    
    scoreboard_data = [
        {
            "rank": idx + 1,
            "username": user.username,
            "email": user.email,
            "points": user.total_points or 0,
            "challenges_completed": user.challenges_count
        }
        for idx, user in enumerate(users)
    ]
    
    return Response(scoreboard_data)