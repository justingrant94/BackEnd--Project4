from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='GameSession',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('difficulty', models.CharField(max_length=20)),
                ('mode', models.CharField(default='all', max_length=30)),
                ('score', models.PositiveIntegerField(default=0)),
                ('rounds_played', models.PositiveIntegerField(default=0)),
                ('correct_answers', models.PositiveIntegerField(default=0)),
                ('best_streak', models.PositiveIntegerField(default=0)),
                ('duration_seconds', models.PositiveIntegerField(default=0)),
                ('summary', models.JSONField(blank=True, default=list)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='game_sessions', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ('-score', '-correct_answers', 'duration_seconds', '-created_at'),
            },
        ),
    ]