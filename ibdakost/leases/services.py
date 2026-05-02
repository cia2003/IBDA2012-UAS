from .serializers import LeaseSerializer
from rest_framework.response import Response
from rest_framework import status

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
        

