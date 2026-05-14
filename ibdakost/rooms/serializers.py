from rest_framework import serializers
from rest_framework.reverse import reverse
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import Group
from .models import RoomType, Facility, Room
from kosts.models import Kost
from leases.models import Lease


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
        fields = ['id', 'kost', 'room_type', 'name', 'is_available', 'image', 'created_at', 'updated_at', '_links']

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

class RoomTypeMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomType
        fields = ['id', 'name', 'price', 'size']


class KostMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Kost
        fields = ['id', 'name', 'address']


class RoomDetailsSerializer(serializers.ModelSerializer):
    room_type = RoomTypeMiniSerializer(read_only=True)
    kost = KostMiniSerializer(read_only=True)
    facilities = FacilitySerializer(
        many=True,
        read_only=True,
        source='room_type.facilities'
    )

    class Meta:
        model = Room
        fields = [
            'id',
            'kost',
            'room_type',
            'facilities',
            'name',
            'is_available',
            'image',
            'created_at',
            'updated_at'
        ]

class RoomProductionSerializer(serializers.ModelSerializer):
    roomNumber = serializers.CharField(source="name")
    price = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    room_type = serializers.SerializerMethodField()
    resident = serializers.SerializerMethodField()

    class Meta:
        model = Room
        fields = [
            "id",
            "roomNumber",
            "status",
            "price",
            "image",
            "room_type",
            "resident",
        ]

    # =========================
    # PRICE dari RoomType
    # =========================
    def get_price(self, obj):
        return obj.room_type.price

    # =========================
    # ROOM TYPE MINI
    # =========================
    def get_room_type(self, obj):
        return {
            "id": str(obj.room_type.id),
            "name": obj.room_type.name,
            "size": obj.room_type.size,
        }

    # =========================
    # STATUS (LEASE BASED)
    # =========================
    def get_status(self, obj):
        return Lease.objects.filter(
            room=obj,
            status="accepted",
            is_validated=True
        ).exists() and "Occupied" or "Available"

    # =========================
    # RESIDENT (FROM LEASE)
    # =========================
    def get_resident(self, obj):
        leases = (
            Lease.objects
            .filter(room=obj, status="accepted", is_validated=True)
            .select_related("tenant__user")
        )

        return [
            {
                "id": str(l.id),
                "name": f"{l.tenant.user.first_name} {l.tenant.user.last_name}",
                "contact": l.tenant.phone_number,
            }
            for l in leases
        ]