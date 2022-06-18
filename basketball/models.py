from django.db import models

# Create your models here.


class Basketball(models.Model):
    names = models.CharField(max_length=100, default=None)
    image = models.CharField(max_length=300, default=None)
    description = models.CharField(max_length=1000, default=None)
    retired = models.BooleanField(default=True)
    age = models.CharField(max_length=100, default=None)
    teams = models.ManyToManyField(
        'teams.Team',
        related_name='basketball'
    )

    def __str__(self):
        return f"{self.names} - {self.description} - ({self.age})"
