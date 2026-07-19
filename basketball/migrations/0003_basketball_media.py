from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('basketball', '0002_basketball_directory_fields'),
    ]

    operations = [
        migrations.AddField(
            model_name='basketball',
            name='media',
            field=models.JSONField(blank=True, default=list),
        ),
    ]