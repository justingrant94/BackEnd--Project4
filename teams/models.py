from django.db import models

# Create your models here.


class Team(models.Model):
    name = models.CharField(max_length=50)
    city = models.CharField(max_length=80, blank=True, null=True)
    abbreviation = models.CharField(max_length=5, blank=True, null=True)
    conference = models.CharField(max_length=20, blank=True, null=True)
    division = models.CharField(max_length=30, blank=True, null=True)
    logo = models.URLField(max_length=500, blank=True, null=True)
    primary_color = models.CharField(max_length=20, blank=True, null=True)
    secondary_color = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return f"{self.name}"
