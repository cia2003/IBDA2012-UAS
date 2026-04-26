from django.contrib import admin

from rooms.models import Room, RoomType, Facility

# Register your models here.
admin.site.register(Facility)
admin.site.register(RoomType)
admin.site.register(Room)