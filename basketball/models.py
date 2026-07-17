from django.db import models

# Create your models here.


class Basketball(models.Model):
    names = models.CharField(max_length=100, default=None)
    image = models.CharField(max_length=300, default=None)
    description = models.CharField(max_length=1000, default=None)
    retired = models.BooleanField(default=True)
    age = models.CharField(max_length=100, default=None)
    position = models.CharField(max_length=50, blank=True, null=True)
    height = models.CharField(max_length=50, blank=True, null=True)
    weight = models.CharField(max_length=50, blank=True, null=True)
    birth_date = models.DateField(blank=True, null=True)
    birth_place = models.CharField(max_length=150, blank=True, null=True)
    nationality = models.CharField(max_length=100, blank=True, null=True)
    draft_year = models.PositiveIntegerField(blank=True, null=True)
    draft_pick = models.PositiveIntegerField(blank=True, null=True)
    college = models.CharField(max_length=150, blank=True, null=True)
    career_start = models.PositiveIntegerField(blank=True, null=True)
    career_end = models.PositiveIntegerField(blank=True, null=True)
    jersey_number = models.CharField(max_length=20, blank=True, null=True)
    hall_of_fame = models.BooleanField(default=False)
    career_points = models.PositiveIntegerField(blank=True, null=True)
    career_rebounds = models.PositiveIntegerField(blank=True, null=True)
    career_assists = models.PositiveIntegerField(blank=True, null=True)
    career_steals = models.PositiveIntegerField(blank=True, null=True)
    career_blocks = models.PositiveIntegerField(blank=True, null=True)
    points_per_game = models.DecimalField(max_digits=4, decimal_places=1, blank=True, null=True)
    rebounds_per_game = models.DecimalField(max_digits=4, decimal_places=1, blank=True, null=True)
    assists_per_game = models.DecimalField(max_digits=4, decimal_places=1, blank=True, null=True)
    championships = models.PositiveIntegerField(default=0)
    mvps = models.PositiveIntegerField(default=0)
    all_star_appearances = models.PositiveIntegerField(default=0)
    source_url = models.URLField(max_length=500, blank=True, null=True)
    teams = models.ManyToManyField(
        'teams.Team',
        related_name='basketball'
    )

    def __str__(self):
        return f"{self.names} - {self.description} - ({self.age})"
