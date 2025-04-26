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

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('investigating', 'Investigating'),
        ('resolved', 'Resolved'),
    ]

    alert_type = models.CharField(max_length=50, choices=ALERT_TYPES)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES)
    location = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.alert_type} - {self.location} - {self.status}"