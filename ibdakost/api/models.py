import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser

from kosts.models import Kost

# Create your models here.
class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(
        max_length=20,
        choices=[
            ('active', 'Active'),
            ('inactive', 'Inactive'),
            ('suspended', 'Suspended'),
            ('deleted', 'Deleted'),
        ],
        default='active'
    )
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.username
    
    class Meta:
        db_table = 'users'

class Tenant(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    full_name = models.CharField(max_length=255)
    gender = models.CharField(max_length=10)
    phone_number = models.CharField(max_length=20)
    occupation = models.CharField(max_length=255)
    institution = models.CharField(max_length=255)
    identity_type = models.CharField(max_length=100)
    identity_card = models.ImageField(upload_to='identity_cards/')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.full_name
    
    class Meta:
        db_table = 'tenants'

class Staff(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    full_name = models.CharField(max_length=255)
    kost = models.ForeignKey(Kost, on_delete=models.CASCADE)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.full_name
    
    class Meta:
        db_table = 'staffs'
