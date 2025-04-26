# Create your models here.

from django.db import models

class Alert(models.Model):
    ALERT_TYPES = [
        ('theft', 'Theft'),
        ('unauthorized', 'Unauthorized Access'),
        ('suspicious', 'Suspicious Activity'),
        ('violence', 'Violence'),
        ('other', 'Other'),
    ]