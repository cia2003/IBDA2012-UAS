import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    def __str__(self):
        return self.username
    
    class Meta:
        db_table = 'users'

class Tenant(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=255)
    gender = models.CharField(max_length=10)
    phone_number = models.CharField(max_length=20)
    occupation = models.CharField(max_length=255)
    institution = models.CharField(max_length=255)
    identity_type = models.CharField(max_length=100)
    identity_card = models.CharField(max_length=100)

    def __str__(self):
        return self.full_name
    
    class Meta:
        db_table = 'tenants'

class Staff(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=255)
    assignedKost = models.ForeignKey('Kost', on_delete=models.CASCADE)

    def __str__(self):
        return self.full_name
    
    class Meta:
        db_table = 'staffs'
