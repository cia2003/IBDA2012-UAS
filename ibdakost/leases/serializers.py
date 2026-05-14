from rest_framework import serializers
from rest_framework.reverse import reverse
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import Group
from .models import Lease
from api.models import Tenant
from rooms.models import Room

class LeaseSerializer(serializers.ModelSerializer):
    tenant = serializers.PrimaryKeyRelatedField(queryset=Tenant.objects.all())
    room = serializers.PrimaryKeyRelatedField(queryset=Room.objects.all())
    class Meta:
        model = Lease
        fields = [
            'id', 'tenant', 'room', 'status', 'is_validated', 'start_date', 
            'end_date', 'created_at', 'updated_at'
            ]
        extra_kwargs = {
            'is_validated': { 'read_only': True }
        }
    
    def update(self, instance, validated_data):
        if 'status' in validated_data:
            status = validated_data['status']
            instance.is_validated = status == 'accepted'

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance

class LeaseNestedSerializer(serializers.ModelSerializer):
    tenant = serializers.SerializerMethodField()
    room = serializers.SerializerMethodField()

    class Meta:
        model = Lease
        fields = [
            'id',
            'tenant',
            'room',
            'status',
            'is_validated',
            'start_date',
            'end_date',
            'created_at',
            'updated_at'
        ]

    def get_tenant(self, obj):
        return {
            "id": str(obj.tenant.user.id),
            "first_name": obj.tenant.user.first_name,
            "last_name": obj.tenant.user.last_name,
            "email": obj.tenant.user.email,
            "gender": obj.tenant.gender,
            "phone_number": obj.tenant.phone_number,
        }

    def get_room(self, obj):
        return {
            "id": str(obj.room.id),
            "room_number": obj.room.name,
            "kost_id": obj.room.kost.id
        }