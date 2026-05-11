import uuid
from django.db import models
from django.contrib.auth.models import AbstractBaseUser
from kosts.models import Kost
from .validators import validate_ktp_image_size

# Create your models here.
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(unique=True, null=False, blank=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def __str__(self):
        return self.email
    
    class Meta:
        db_table = "users"

class Tenant(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    gender = models.CharField(max_length=10)
    phone_number = models.CharField(max_length=20)
    occupation = models.CharField(max_length=255)
    institution = models.CharField(max_length=255)
    identity_type = models.CharField(max_length=100)
    identity_card = models.ImageField(upload_to='identity_cards/', validators=[validate_ktp_image_size])

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.email
    
    class Meta:
        db_table = 'tenants'

class Role(models.TextChoices):
    STAFF = 'staff', 'Staff'
    MANAGER = 'manager', 'Manager'

class Employee(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    kost = models.ForeignKey(Kost, on_delete=models.SET_NULL, null=True, blank=True)
    position = models.CharField(
        max_length=20, 
        choices=Role.choices, 
        default=Role.STAFF
        )
    phone_number = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.email
    
    class Meta:
        db_table = 'employees'
