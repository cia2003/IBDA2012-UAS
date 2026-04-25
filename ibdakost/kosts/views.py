from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import Group
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from api.permissions import IsAdminOrSuperUser
from .serializers import KostSerializer
from .models import Kost
from django.http import Http404

# Create your views here.
class KostListCreateView(APIView):
    authentication_classes = [JWTAuthentication]

    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsAuthenticated()]
        return [IsAuthenticated(), IsAdminOrSuperUser()]

    def get(self, request):
        kosts = Kost.objects.all().order_by('created_at')[:10]
        serializer = KostSerializer(kosts, many=True)
        return Response({'kosts': serializer.data})

    def post(self, request):
        serializer = KostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class KostDetailView(APIView):
    authentication_classes = [JWTAuthentication]

    def get_permissions(self):
        if self.request.method == 'DELETE':
            return [IsAuthenticated(), IsAdminOrSuperUser()]
        return [IsAuthenticated()]

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
        serializer = KostSerializer(kost, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        kost = self.get_object(pk)
        kost.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)