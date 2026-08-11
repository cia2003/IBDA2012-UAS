import os

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
# from django.shortcuts import get_object_or_404
from django.contrib.auth.models import Group
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from api.permissions import IsManagerOrSuperUser
from .serializers import KostSerializer
from .models import Kost
from django.http import Http404
# from ibdakost.supabase_client import StorageService
from ibdakost.storages.storage import StorageService

# Create your views here.
class KostListCreateView(APIView):
    authentication_classes = [JWTAuthentication]

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated(), IsManagerOrSuperUser()]

    def get(self, request):
        kosts = Kost.objects.all().order_by('created_at')
        serializer = KostSerializer(kosts, many=True)
        data = serializer.data
        
        return Response({'kosts': data})

    def post(self, request):
        serializer = KostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class KostDetailView(APIView):
    authentication_classes = [JWTAuthentication]

    def get_permissions(self):
        if self.request.method == 'DELETE' or self.request.method == 'PUT':
            return [IsAuthenticated(), IsManagerOrSuperUser()]
        if self.request.method == 'GET':
            return [AllowAny()]
        # return [IsAuthenticated()]

    def get_object(self, pk):
        try:
            return Kost.objects.get(pk=pk)
        except Kost.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        kost = self.get_object(pk)
        serializer = KostSerializer(kost)
        return Response(serializer.data)

    def put(self, request, pk):
        kost = self.get_object(pk)
        serializer = KostSerializer(kost, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        kost = self.get_object(pk)
        kost.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)