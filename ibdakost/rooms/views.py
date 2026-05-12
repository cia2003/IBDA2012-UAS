from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
# from django.shortcuts import get_object_or_404
from django.contrib.auth.models import Group
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from api.permissions import IsManagerOrStaffOrSuperUser, IsManagerOrSuperUser
from .serializers import RoomTypeSerializer, FacilitySerializer, RoomSerializer
from .models import RoomType, Facility, Room
from django.http import Http404

# Create your views here.
class RoomListCreateView(APIView):
    authentication_classes = [JWTAuthentication]

    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsAuthenticated()]
        return [IsAuthenticated(), IsManagerOrStaffOrSuperUser()]

    def get(self, request):
        rooms = Room.objects.all().order_by('created_at')[:10]
        serializer = RoomSerializer(rooms, many=True)
        return Response({'rooms': serializer.data})

    def post(self, request):
        serializer = RoomSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RoomDetailView(APIView):
    authentication_classes = [JWTAuthentication]

    def get_permissions(self):
        if self.request.method == 'DELETE':
            return [IsAuthenticated(), IsManagerOrStaffOrSuperUser()]
        return [IsAuthenticated()]
        # return []

    def get_object(self, pk):
        try:
            return Room.objects.get(pk=pk)
        except Room.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        room = self.get_object(pk)
        serializer = RoomSerializer(room)
        return Response(serializer.data)

    def put(self, request, pk):
        room = self.get_object(pk)
        serializer = RoomSerializer(room, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        room = self.get_object(pk)
        room.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class RoomTypeListCreateView(APIView):
    authentication_classes = [JWTAuthentication]

    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsAuthenticated()]
        return [IsAuthenticated(), IsManagerOrStaffOrSuperUser()]
        # return []

    def get(self, request):
        room_types = RoomType.objects.all().order_by('created_at')[:10]
        serializer = RoomTypeSerializer(room_types, many=True)
        return Response({'room_types': serializer.data})

    def post(self, request):
        serializer = RoomTypeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FacilityListCreateView(APIView):
    authentication_classes = [JWTAuthentication]

    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsAuthenticated()]
        return [IsAuthenticated(), IsManagerOrStaffOrSuperUser()]

    def get(self, request):
        facilities = Facility.objects.all().order_by('created_at')
        serializer = FacilitySerializer(facilities, many=True)
        return Response({'facilities': serializer.data})

    def post(self, request):
        serializer = FacilitySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RoomTypeDetailView(APIView):
    authentication_classes = [JWTAuthentication]

    def get_permissions(self):
        if self.request.method == 'DELETE':
            return [IsAuthenticated(), IsManagerOrStaffOrSuperUser()]
        return [IsAuthenticated()]
        # return []

    def get_object(self, pk):
        try:
            return RoomType.objects.get(pk=pk)
        except RoomType.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        room_type = self.get_object(pk)
        serializer = RoomTypeSerializer(room_type)
        return Response(serializer.data)

    def put(self, request, pk):
        room_type = self.get_object(pk)
        serializer = RoomTypeSerializer(room_type, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        room_type = self.get_object(pk)
        room_type.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class FacilityDetailView(APIView):
    authentication_classes = [JWTAuthentication]

    def get_permissions(self):
        if self.request.method == 'DELETE':
            return [IsAuthenticated(), IsManagerOrStaffOrSuperUser()]
        return [IsAuthenticated()]
        # return []

    def get_object(self, pk):
        try:
            return Facility.objects.get(pk=pk)
        except Facility.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        facility = self.get_object(pk)
        serializer = FacilitySerializer(facility)
        return Response(serializer.data)

    def put(self, request, pk):
        facility = self.get_object(pk)
        serializer = FacilitySerializer(facility, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        facility = self.get_object(pk)
        facility.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)