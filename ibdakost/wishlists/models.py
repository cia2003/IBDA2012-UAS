from django.db import models
from api.models import User
from rooms.models import Room

# Create your models here.
class Wishlist(models.Model):
    id = models.AutoField(primary_key=True, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    room = models.ForeignKey(Room, on_delete=models.CASCADE) 
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'wishlists'
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'room'],
                name='unique_user_room_wishlist'
            )
        ]