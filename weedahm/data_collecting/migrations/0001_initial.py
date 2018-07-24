# Generated by Django 2.0.7 on 2018-07-11 11:21

from django.db import migrations, models
import jsonfield.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Patient',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('chart_id', models.CharField(max_length=8, unique=True)),
                ('json_data', jsonfield.fields.JSONField()),
                ('created_date', models.DateField(auto_now_add=True)),
                ('last_modified', models.DateTimeField(auto_now=True)),
            ],
        ),
    ]