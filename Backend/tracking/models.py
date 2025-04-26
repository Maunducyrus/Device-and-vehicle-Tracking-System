# Create your models here.

from django.db import models

class Device(models.Model):
    DEVICE_TYPE_CHOICES = [
        ('smartphone', 'SmartPhone'),
        ('tablet', 'Tablet'),
        ('laptop', 'Laptop'),
        ('other', 'Other'),
    ]

    owner_name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=20)
    serial_number = models.CharField(max_length=100, blank=True, null=True)
    imei = models.CharField(max_length=100, blank=True, null=True)
    mac_address = models.CharField(max_length=100, blank=True, null=True)
    device_type = models.CharField(max_length=20, choices=DEVICE_TYPE_CHOICES)
    last_latitude = models.FloatField(blank=True, null=True)
    last_longitude = models.FloatField(blank=True, null=True)
    is_stolen = models.BooleanField(default=False)
    update_at = models.DateTimeField(auto_now=True)
