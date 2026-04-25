from django.contrib import admin
from .models import User, Tenant, Staff

# Register your models here.
admin.site.register(User)
admin.site.register(Tenant)
admin.site.register(Staff)