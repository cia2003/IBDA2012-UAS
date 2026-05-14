from rest_framework import serializers
from rest_framework.reverse import reverse
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import Group
from .models import Wishlist
from api.models import User
from rooms.models import Room

class WishlistSerializer(serializers.ModelSerializer):
    _links = serializers.SerializerMethodField()
    user = serializers.SerializerMethodField()
    room = serializers.SerializerMethodField()

    class Meta:
        model = Wishlist
        fields = [
            'id', 'user', 'room', 'created_at', 'updated_at', '_links'
            ]
        
    def get_room(self, obj):
        return {
            "id": obj.room.id,
            "image": obj.room.image.url, 
            "kost_name": obj.room.kost.name, 
            "room_number": obj.room.name, 
            "price": obj.room.room_type.price, 
            "location": obj.room.kost.address
        }
    
    def get_user(self, obj):
        return {
            "full_name": f"{obj.user.first_name} {obj.user.last_name}"
        }
    
    def get__links(self, obj):
        request = self.context.get('request')
        return [
            {
                "rel": "self",
                "href": reverse('wishlist-list', request=request),
                "action": "POST",
                "types": ["application/json"]
            },
            {
                "rel": "self",
                "href": reverse('wishlist-detail', kwargs={'pk': obj.pk}, request=request),
                "action": "GET",
                "types": ["application/json"]
            },
            {
                "rel": "self",
                "href": reverse('wishlist-detail', kwargs={'pk': obj.pk}, request=request),
                "action": "PUT",
                "types": ["application/json"]
            },
            {
                "rel": "self",
                "href": reverse('wishlist-detail', kwargs={'pk': obj.pk}, request=request),
                "action": "DELETE",
                "types": ["application/json"]
            }
        ]
        
    