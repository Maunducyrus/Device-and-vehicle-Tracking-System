# Create your models here.

from django.db import models

class Device(models.Model):
    DEVICE_TYPE_CHOICES = [
        ('smartphone', 'SmartPhone'),
        ('tablet', 'Tablet'),
        ('laptop', 'Laptop'),
        ('other', 'Other'),
    ]
