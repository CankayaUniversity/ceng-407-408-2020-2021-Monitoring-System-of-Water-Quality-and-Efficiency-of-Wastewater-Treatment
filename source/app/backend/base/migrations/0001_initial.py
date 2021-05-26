# Generated by Django 3.1.7 on 2021-04-05 20:48

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
            name='Location',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('bolge_adi', models.CharField(max_length=50)),
                ('numune_adi', models.CharField(max_length=10, null=True)),
                ('yer', models.CharField(max_length=50)),
                ('utm_x', models.PositiveIntegerField(null=True)),
                ('utm_y', models.PositiveIntegerField(null=True)),
            ],
        ),
        migrations.CreateModel(
            name='ReadingType',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('min_value', models.FloatField(null=True)),
                ('max_value', models.FloatField(null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Reading',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('table_type', models.CharField(max_length=15)),
                ('reading_value', models.FloatField(null=True)),
                ('reading_string_value', models.TextField(null=True)),
                ('date', models.DateField()),
                ('added_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
                ('location', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='base.location')),
                ('reading_type', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='base.readingtype')),
            ],
        ),
    ]
