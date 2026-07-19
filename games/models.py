from django.conf import settings
from django.db import models


class GameSession(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='game_sessions',
        on_delete=models.CASCADE,
    )
    difficulty = models.CharField(max_length=20)
    mode = models.CharField(max_length=30, default='all')
    score = models.PositiveIntegerField(default=0)
    rounds_played = models.PositiveIntegerField(default=0)
    correct_answers = models.PositiveIntegerField(default=0)
    best_streak = models.PositiveIntegerField(default=0)
    duration_seconds = models.PositiveIntegerField(default=0)
    summary = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('-score', '-correct_answers', 'duration_seconds', '-created_at')

    def __str__(self):
        return f'{self.owner} - {self.difficulty} - {self.score}'