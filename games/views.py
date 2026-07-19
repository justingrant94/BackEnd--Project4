from django.db.models import Avg, Max, Sum
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

from .models import GameSession
from .serializers.common import GameSessionSerializer


class GameSessionListCreateView(APIView):
    permission_classes = (IsAuthenticated, )

    def get(self, request):
        sessions = GameSession.objects.filter(owner=request.user)[:20]
        return Response(GameSessionSerializer(sessions, many=True).data, status.HTTP_200_OK)

    def post(self, request):
        serializer = GameSessionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(owner=request.user)
        return Response(serializer.data, status.HTTP_201_CREATED)


class GameLeaderboardView(APIView):
    permission_classes = (IsAuthenticated, )

    def get(self, _request):
        sessions = GameSession.objects.select_related('owner')[:10]
        return Response(GameSessionSerializer(sessions, many=True).data, status.HTTP_200_OK)


class GameStatsView(APIView):
    permission_classes = (IsAuthenticated, )

    def get(self, request):
        sessions = GameSession.objects.filter(owner=request.user)
        aggregate = sessions.aggregate(
            best_score=Max('score'),
            best_streak=Max('best_streak'),
            total_games=Sum('rounds_played'),
            average_score=Avg('score'),
        )

        games_played = sessions.count()
        correct_answers = sum(session.correct_answers for session in sessions)
        rounds_played = sum(session.rounds_played for session in sessions)

        return Response({
            'games_played': games_played,
            'rounds_played': rounds_played,
            'correct_answers': correct_answers,
            'accuracy': round((correct_answers / rounds_played) * 100) if rounds_played else 0,
            'best_score': aggregate['best_score'] or 0,
            'best_streak': aggregate['best_streak'] or 0,
            'average_score': round(aggregate['average_score'] or 0),
        }, status.HTTP_200_OK)