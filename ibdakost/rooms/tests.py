from django.test import TestCase
from django.urls import reverse

from rooms.models import Room, RoomType, Facility
from kosts.models import Kost
from api.models import User

from django.contrib.auth.models import Group

from rooms.serializers import RoomSerializer, RoomTypeSerializer, FacilitySerializer

from rest_framework.test import APITestCase
from rest_framework import status

import io
from PIL import Image
from django.core.files.uploadedfile import SimpleUploadedFile


def create_test_image():
    file = io.BytesIO()
    image = Image.new('RGB', (100, 100), color='red')
    image.save(file, format='JPEG')
    file.seek(0)

    return SimpleUploadedFile(
        name='test.jpg',
        content=file.read(),
        content_type='image/jpeg'
    )

# Create your tests here
class RoomModelTests(TestCase):
    def setUp(self):
        image = create_test_image()
        self.kost = Kost.objects.create(
            name='Kost A',
            address='Jl. Example No. 123',
            description='Kost nyaman dan strategis',
            image=image
        )
        self.room_type = RoomType.objects.create(name='Tipe 1', size='2.5 m x 2.5 m', price=750000)
        self.room = Room.objects.create(kost=self.kost, room_type=self.room_type, name='Room 101', image=image)

    def test_room_type_creation(self):
        self.assertEqual(self.room_type.name, 'Tipe 1')
        self.assertEqual(self.room_type.size, '2.5 m x 2.5 m')
        self.assertEqual(self.room_type.price, 750000)

    def test_room_creation(self):
        self.assertEqual(self.room.name, 'Room 101')
        self.assertEqual(self.room.kost.name, 'Kost A')
        self.assertEqual(self.room.room_type.name, 'Tipe 1')
        self.assertEqual(self.room.room_type.price, 750000)
    
    def test_room_availability(self):
        self.assertTrue(self.room.is_available)
        self.room.is_available = False
        self.room.save()
        self.assertFalse(self.room.is_available)
    
class RoomSerializerTests(TestCase):
    def setUp(self):
        image = create_test_image()
        self.kost = Kost.objects.create(
            name='Kost A',
            address='Jl. Example No. 123',
            description='Kost nyaman dan strategis',
            image=image
        )
        self.room_type = RoomType.objects.create(name='Tipe 1', size='2.5 m x 2.5 m', price=750000)
        self.room = Room.objects.create(kost=self.kost, room_type=self.room_type, name='Room 101', image=image)

    def test_room_serializer(self):
        serializer = RoomSerializer(instance=self.room)
        data = serializer.data
        self.assertEqual(data['name'], 'Room 101')

    def test_room_type_serializer(self):
        serializer = RoomTypeSerializer(instance=self.room_type)
        data = serializer.data
        self.assertEqual(data['name'], 'Tipe 1')
        self.assertEqual(data['size'], '2.5 m x 2.5 m')
        self.assertEqual(data['price'], '750000.00')
    
    def test_facility_serializer(self):
        facility = Facility.objects.create(name='Kipas Angin')
        serializer = FacilitySerializer(instance=facility)
        data = serializer.data
        self.assertEqual(data['name'], 'Kipas Angin')
    
class RoomViewTests(APITestCase):
    def setUp(self):
        image = create_test_image()
        self.kost = Kost.objects.create(
            name='Kost A',
            address='Jl. Example No. 123',
            description='Kost nyaman dan strategis',
            image=image
        )

        self.room_type = RoomType.objects.create(
            name='Tipe 1',
            size='2.5 m x 2.5 m',
            price=750000
        )

        self.room = Room.objects.create(
            kost=self.kost,
            room_type=self.room_type,
            name='Room 101', 
            image=image
        )

        self.facility_1 = Facility.objects.create(name='Kipas Angin')
        self.facility_2 = Facility.objects.create(name='Kamar Mandi Luar')

        self.admin = User.objects.create_user(
            first_name='admin',
            last_name='test',
            email='admin@test.com',
            password='adminpass'
        )

        self.user = User.objects.create_user(
            first_name='user',
            last_name='test',
            email='user@test.com',
            password='userpass'
        )

        self.staff = User.objects.create_user(
            first_name='staff',
            last_name='test',
            email='staff@test.com',
            password='staffpass'
        )

        admin_group = Group.objects.create(name='admin')
        self.admin.groups.add(admin_group)

        staff_group = Group.objects.create(name='staff')
        self.staff.groups.add(staff_group)

    def test_admin_can_create_room_type_with_facilities(self):
        self.client.force_authenticate(user=self.admin)

        facility1 = Facility.objects.create(name="WiFi")
        facility2 = Facility.objects.create(name="AC")

        url = reverse('roomtype-list')  # sesuaikan dengan nama router kamu

        data = {
            "name": "Tipe 2",
            "size": "3x3",
            "price": 1000000,
            "facilities": [facility1.id, facility2.id]
        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        room_type = RoomType.objects.get(name="Tipe 2")
        self.assertEqual(room_type.facilities.count(), 2)

    def test_user_cannot_create_room_type(self):
        self.client.force_authenticate(user=self.user)

        facility1 = Facility.objects.create(name="WiFi")

        url = reverse('roomtype-list')

        data = {
            "name": "Tipe 3",
            "size": "3x4",
            "price": 900000,
            "facilities": [facility1.id]
        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_staff_can_delete_room_type(self):
        self.client.force_authenticate(user=self.staff)

        room_type = RoomType.objects.create(name="Tipe 4", size="4x4", price=1200000)
        url = reverse('roomtype-detail', args=[room_type.id])

        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(RoomType.objects.filter(id=room_type.id).exists())

    def test_get_room_type_includes_facilities(self):
        self.client.force_authenticate(user=self.user)

        data = {
            "name": "Tipe 5",
            "size": "3x3",
            "price": 850000,
            "facilities": [self.facility_1.id, self.facility_2.id]
        }

        serializer = RoomTypeSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)

        room_type = serializer.save()

        url = reverse('roomtype-detail', args=[room_type.id])

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('facilities', response.data)

        data = response.data
        self.assertEqual(len(data['facilities']), 2)