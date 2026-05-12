from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from api.permissions import  IsManagerOrStaffOrSuperUser
from .models import Lease
from .serializers import LeaseSerializer
from django.http import Http404
from django.shortcuts import render

# Create your views here.
class LeaseListCreateView(APIView):
    authentication_classes = [JWTAuthentication]

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated()]
        return [IsAuthenticated(), IsManagerOrStaffOrSuperUser()]

    def get(self, request):
        leases = Lease.objects.all().order_by('created_at')
        serializer = LeaseSerializer(leases, many=True)
        return Response({'leases': serializer.data})

    def post(self, request):
        serializer = LeaseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LeaseDetailView(APIView):
    authentication_classes = [JWTAuthentication]

    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsAuthenticated()]
        return [IsAuthenticated(), IsManagerOrStaffOrSuperUser()]

    def get_object(self, pk):
        try:
            return Lease.objects.get(pk=pk)
        except Lease.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        lease = self.get_object(pk)
        serializer = LeaseSerializer(lease)
        return Response(serializer.data)

    def put(self, request, pk):
        lease = self.get_object(pk)
        serializer = LeaseSerializer(lease, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        lease = self.get_object(pk)
        lease.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
