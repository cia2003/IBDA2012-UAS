from .serializers import LeaseSerializer
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from leases.models import Lease
from wishlists.models import Wishlist

class LeaseService:
    @staticmethod
    def approve_lease(lease):
        data = {
            'status': 'approved'
        }
        serializer = LeaseSerializer(lease, data=data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @staticmethod
    @transaction.atomic
    def accept_lease(lease_id):
        lease = Lease.objects.select_related("room", "tenant").get(id=lease_id)

        lease.status = "accepted"
        lease.save()

        room = lease.room
        room.is_available = False
        room.save()

        Wishlist.objects.filter(
            room=room,
            user=lease.tenant.user_id
        ).delete()

        return lease
        

