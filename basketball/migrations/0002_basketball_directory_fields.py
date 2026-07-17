# Generated manually for the basketball directory revamp

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('basketball', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='basketball',
            name='position',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='basketball',
            name='height',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='basketball',
            name='weight',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='basketball',
            name='birth_date',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='basketball',
            name='birth_place',
            field=models.CharField(blank=True, max_length=150, null=True),
        ),
        migrations.AddField(
            model_name='basketball',
            name='nationality',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='basketball',
            name='draft_year',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='basketball',
            name='draft_pick',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='basketball',
            name='college',
            field=models.CharField(blank=True, max_length=150, null=True),
        ),
        migrations.AddField(
            model_name='basketball',
            name='career_start',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='basketball',
            name='career_end',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='basketball',
            name='jersey_number',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
        migrations.AddField(
            model_name='basketball',
            name='hall_of_fame',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='basketball',
            name='career_points',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='basketball',
            name='career_rebounds',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='basketball',
            name='career_assists',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='basketball',
            name='career_steals',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='basketball',
            name='career_blocks',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='basketball',
            name='points_per_game',
            field=models.DecimalField(blank=True, decimal_places=1, max_digits=4, null=True),
        ),
        migrations.AddField(
            model_name='basketball',
            name='rebounds_per_game',
            field=models.DecimalField(blank=True, decimal_places=1, max_digits=4, null=True),
        ),
        migrations.AddField(
            model_name='basketball',
            name='assists_per_game',
            field=models.DecimalField(blank=True, decimal_places=1, max_digits=4, null=True),
        ),
        migrations.AddField(
            model_name='basketball',
            name='championships',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AddField(
            model_name='basketball',
            name='mvps',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AddField(
            model_name='basketball',
            name='all_star_appearances',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AddField(
            model_name='basketball',
            name='source_url',
            field=models.URLField(blank=True, max_length=500, null=True),
        ),
    ]
