from django.urls import path

from .views import GameLeaderboardView, GameSessionListCreateView, GameStatsView


urlpatterns = [
    path('sessions/', GameSessionListCreateView.as_view()),
    path('leaderboard/', GameLeaderboardView.as_view()),
    path('stats/', GameStatsView.as_view()),
]