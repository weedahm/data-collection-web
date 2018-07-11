from django.db import models
from jsonfield import JSONField

class Patient(models.Model):
    chart_id = models.CharField(max_length=8, unique=True)
    json_data = JSONField()
    created_date = models.DateField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.chart_id