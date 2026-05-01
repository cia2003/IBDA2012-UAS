from rest_framework import serializers
from rest_framework.reverse import reverse
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import Group
from .models import Wishlist
from api.models import User
from rooms.models import Room

class WishlistSerializer(serializers.ModelSerializer):
    _links = serializers.SerializerMethodField()
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    room = serializers.PrimaryKeyRelatedField(queryset=Room.objects.all())

    class Meta:
        model = Wishlist
        fields = [
            'id', 'user', 'room', 'created_at', 'updated_at', '_links'
            ]

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
        
    