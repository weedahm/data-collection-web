from django.db import models
from django.conf import settings
from jsonfield import JSONField
from django.contrib.auth import get_user_model

class Patient(models.Model):
    chart_id = models.CharField(max_length=8, unique=True)
    json_data = JSONField()
    created_date = models.DateField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)

    created_user = models.ForeignKey(
        get_user_model(),
        on_delete = models.PROTECT
    )

    def __str__(self):
        return self.chart_id