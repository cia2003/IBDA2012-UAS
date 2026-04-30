from rest_framework import serializers
from rest_framework.reverse import reverse
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import Group
from .models import Lease

class LeaseSerializer(serializers.ModelSerializer):
    _links = serializers.SerializerMethodField()
    class Meta:
        model = Lease
        fields = [
            'id', 'tenant', 'room', 'status', 'is_validated', 'start_date', 
            'end_date', 'created_at', 'updated_at', '_links'
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

    def get__links(self, obj):
        request = self.context.get('request')
        return [
            {
                "rel": "self",
                "href": reverse('lease-list', request=request),
                "action": "POST",
                "types": ["application/json"]
            },
            {
                "rel": "self",
                "href": reverse('lease-detail', kwargs={'pk': obj.pk}, request=request),
                "action": "GET",
                "types": ["application/json"]
            },
            {
                "rel": "self",
                "href": reverse('lease-detail', kwargs={'pk': obj.pk}, request=request),
                "action": "PUT",
                "types": ["application/json"]
            },
            {
                "rel": "self",
                "href": reverse('lease-detail', kwargs={'pk': obj.pk}, request=request),
                "action": "DELETE",
                "types": ["application/json"]
            }
        ]
        
    