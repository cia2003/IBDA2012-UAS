from rest_framework import serializers
from rest_framework.reverse import reverse
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import Group
from kosts.models import Kost
from rooms.models import Room
from api.serializers import StaffRoomSerializer
from storages.backends.s3boto3 import S3Boto3Storage

class KostSerializer(serializers.HyperlinkedModelSerializer):
    _links = serializers.SerializerMethodField()

    class Meta:
        model = Kost
        fields = ['id', 'name', 'address', 'description', 'image', 'created_at', 'updated_at', '_links']
    
    def get__links(self, obj):
        request = self.context.get('request')
        return [
            {
                "rel": "self",
                "href": reverse('kost-list', request=request),
                "action": "POST",
                "types": ["application/json"]
            },
            {
                "rel": "self",
                "href": reverse('kost-detail', kwargs={'pk': obj.pk}, request=request),
                "action": "GET",
                "types": ["application/json"]
            },
            {
                "rel": "self",
                "href": reverse('kost-detail', kwargs={'pk': obj.pk}, request=request),
                "action": "PUT",
                "types": ["application/json"]
            },
            {
                "rel": "self",
                "href": reverse('kost-detail', kwargs={'pk': obj.pk}, request=request),
                "action": "DELETE",
                "types": ["application/json"]
            }
        ]

class ResidentMiniSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    name = serializers.CharField()
    contact = serializers.CharField()
    paymentDueDate = serializers.IntegerField()


# class RoomSerializer(serializers.ModelSerializer):
#     roomNumber = serializers.CharField(source="name")
#     status = serializers.SerializerMethodField()
#     resident = serializers.SerializerMethodField()
#     price = serializers.DecimalField(
#         source="room_type.price",
#         max_digits=12,
#         decimal_places=2
#     )

#     class Meta:
#         model = Room
#         fields = ["id", "roomNumber", "status", "resident", "price"]

#     def get_status(self, obj):
#         return "Occupied" if obj.lease_set.filter(status="accepted", is_validated=True).exists() else "Vacant"

#     def get_resident(self, obj):
#         leases = Lease.objects.filter(
#             room=obj,
#             status="accepted",
#             is_validated=True
#         ).select_related("tenant__user")

#         return [
#             {
#                 "id": str(lease.id),
#                 "name": f"{lease.tenant.user.first_name} {lease.tenant.user.last_name}",
#                 "contact": lease.tenant.phone_number,
#                 "paymentDueDate": lease.end_date.day
#             }
#             for lease in leases
#         ]


class StaffManagedKostSerializer(serializers.ModelSerializer):
    rooms = serializers.SerializerMethodField()

    class Meta:
        model = Kost
        fields = ["id", "name", "address", "description", "rooms"]

    def get_rooms(self, obj):
        rooms = Room.objects.filter(kost=obj).prefetch_related("lease_set")
        return StaffRoomSerializer(rooms, many=True).data