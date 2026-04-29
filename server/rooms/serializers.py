from rest_framework import serializers
from rest_framework.reverse import reverse
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import Group
from .models import RoomType, Facility, Room


class FacilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Facility
        fields = ['id', 'name', 'created_at', 'updated_at']
    
class RoomTypeSerializer(serializers.ModelSerializer):
    _links = serializers.SerializerMethodField()
    facilities = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Facility.objects.all()
    )

    class Meta:
        model = RoomType
        fields = ['id', 'name', 'size', 'price', 'facilities', 'created_at', 'updated_at', '_links']
    
    def create(self, validated_data):
        facilities_data = validated_data.pop('facilities', [])
        room_type = RoomType.objects.create(**validated_data)
        room_type.facilities.set(facilities_data)
        return room_type
    
    def get__links(self, obj):
        request = self.context.get('request')
        return [
            {
                "rel": "self",
                "href": reverse('roomtype-list', request=request),
                "action": "POST",
                "types": ["application/json"]
            },
            {
                "rel": "self",
                "href": reverse('roomtype-detail', kwargs={'pk': obj.pk}, request=request),
                "action": "GET",
                "types": ["application/json"]
            },
            {
                "rel": "self",
                "href": reverse('roomtype-detail', kwargs={'pk': obj.pk}, request=request),
                "action": "PUT",
                "types": ["application/json"]
            },
            {
                "rel": "self",
                "href": reverse('roomtype-detail', kwargs={'pk': obj.pk}, request=request),
                "action": "DELETE",
                "types": ["application/json"]
            }
        ]

class RoomSerializer(serializers.ModelSerializer):
    _links = serializers.SerializerMethodField()

    class Meta:
        model = Room
        fields = ['id', 'kost', 'room_type', 'name', 'is_available', 'created_at', 'updated_at', '_links']

    def get__links(self, obj):
        request = self.context.get('request')
        return [
            {
                "rel": "self",
                "href": reverse('room-list', request=request),
                "action": "POST",
                "types": ["application/json"]
            },
            {
                "rel": "self",
                "href": reverse('room-detail', kwargs={'pk': obj.pk}, request=request),
                "action": "GET",
                "types": ["application/json"]
            },
            {
                "rel": "self",
                "href": reverse('room-detail', kwargs={'pk': obj.pk}, request=request),
                "action": "PUT",
                "types": ["application/json"]
            },
            {
                "rel": "self",
                "href": reverse('room-detail', kwargs={'pk': obj.pk}, request=request),
                "action": "DELETE",
                "types": ["application/json"]
            }
        ]

