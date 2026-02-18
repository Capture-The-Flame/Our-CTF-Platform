from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import Challenge, UserChallenge
from .serializers import ChallengeSerializer
from django.db import transaction
from django.db.models import F, Sum, Count


def index(request):
    return JsonResponse({"ok": True, "service": "ctf-platform-backend"})


def get_username_from_request(request):
    return request.headers.get('X-Username', '').strip() or None


@api_view(['GET'])
@permission_classes([AllowAny])
def challenges_list(request):
    username = get_username_from_request(request)
    if not username:
        return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)

    challenges = Challenge.objects.filter(is_active=True)
    serializer = ChallengeSerializer(challenges, many=True, context={'request': request, 'username': username})
    return Response(serializer.data)


@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def submit_flag(request, challenge_id):
    username = get_username_from_request(request)
    if not username:
        return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)

    submitted_flag = request.data.get('flag', '').strip()

    with transaction.atomic():
        try:
            challenge = Challenge.objects.select_for_update().get(id=challenge_id, is_active=True)
        except Challenge.DoesNotExist:
            return Response({"error": "Challenge not found"}, status=status.HTTP_404_NOT_FOUND)

        if UserChallenge.objects.filter(username=username, challenge=challenge).exists():
            return Response({"error": "Challenge already completed"}, status=status.HTTP_400_BAD_REQUEST)

        if submitted_flag != challenge.flag:
            return Response({"success": False, "message": "Incorrect flag. Try again!"}, status=status.HTTP_400_BAD_REQUEST)

        awarded = challenge.current_points
        UserChallenge.objects.create(username=username, challenge=challenge, awarded_points=awarded)
        Challenge.objects.filter(id=challenge.id).update(solves_count=F('solves_count') + 1)

    return Response({
        "success": True,
        "message": "Correct! Challenge completed!",
        "points": awarded
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def scoreboard(request):
    results = (
        UserChallenge.objects
        .values('username')
        .annotate(
            total_points=Sum('awarded_points'),
            challenges_count=Count('id')
        )
        .order_by('-total_points', 'challenges_count')[:10]
    )

    return Response([
        {
            "rank": idx + 1,
            "username": entry['username'],
            "points": entry['total_points'],
            "challenges_completed": entry['challenges_count']
        }
        for idx, entry in enumerate(results)
    ])