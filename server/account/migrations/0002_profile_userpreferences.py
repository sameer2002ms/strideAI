import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('account', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, related_name='profile', serialize=False, to=settings.AUTH_USER_MODEL)),
                ('bio', models.TextField(blank=True, default='')),
                ('avatar_url', models.URLField(blank=True, default='')),
                ('phone_number', models.CharField(blank=True, default='', max_length=32)),
                ('date_of_birth', models.DateField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'profile',
                'verbose_name_plural': 'profiles',
            },
        ),
        migrations.CreateModel(
            name='UserPreferences',
            fields=[
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, related_name='preferences', serialize=False, to=settings.AUTH_USER_MODEL)),
                ('timezone', models.CharField(default='UTC', max_length=64)),
                ('language', models.CharField(default='en', max_length=10)),
                ('theme', models.CharField(choices=[('light', 'Light'), ('dark', 'Dark'), ('system', 'System')], default='system', max_length=10)),
                ('extra_settings', models.JSONField(blank=True, default=dict)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'user preferences',
                'verbose_name_plural': 'user preferences',
            },
        ),
    ]
