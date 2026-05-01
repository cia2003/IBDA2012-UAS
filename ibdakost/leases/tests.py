from django.test import TestCase
from django.urls import reverse

from rooms.models import Room, RoomType
from kosts.models import Kost
from api.models import User, Tenant, Staff
from leases.models import Lease


from django.contrib.auth.models import Group

from leases.serializers import LeaseSerializer

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

class ModelTest(TestCase):
    def setUp(self):
        image = create_test_image()
        self.kost = Kost.objects.create(
            name='Kost A',
            address='Jl. Example No. 123',
            description='Kost nyaman dan strategis',
            image=image
        )
        self.room_type = RoomType.objects.create(name='Tipe 1', size='2.5 m x 2.5 m', price=750000)
        self.room = Room.objects.create(kost=self.kost, room_type=self.room_type, name='Room 101')
        self.user = User.objects.create_user(username='testuser', email='testuser@example.com', password='testpass')
    
    def test_lease_creation(self):
        image = create_test_image()
        tenant = Tenant.objects.create(
            user=self.user,
            full_name='John Doe',
            gender='male',
            phone_number='08123',
            occupation='Student',
            institution='XYZ',
            identity_type='KTP',
            identity_card=image
        )

        lease = Lease.objects.create(
            tenant = tenant, 
            room = self.room, 
            start_date = "2025-10-01",
            end_date = "2025-10-31"
        )

        self.assertEqual(lease.tenant.full_name, "John Doe")

class SerializerTest(TestCase):
    def setUp(self):
        image = create_test_image()
        self.kost = Kost.objects.create(
            name='Kost A',
            address='Jl. Example No. 123',
            description='Kost nyaman dan strategis',
            image=image
        )
        self.room_type = RoomType.objects.create(name='Tipe 1', size='2.5 m x 2.5 m', price=750000)
        self.room = Room.objects.create(kost=self.kost, room_type=self.room_type, name='Room 101')
        self.user = User.objects.create_user(username='testuser', email='testuser@example.com', password='testpass')
    
    def test_lease_serializer(self):
        image = create_test_image()
        tenant = Tenant.objects.create(
            user=self.user,
            full_name='John Doe',
            gender='male',
            phone_number='08123',
            occupation='Student',
            institution='XYZ',
            identity_type='KTP',
            identity_card=image
        )
    
        lease_data = {
            'tenant': tenant, 
            'room': self.room.id, 
            'start_date': '2025-10-01',
            'end_date': '2025-10-31'
        }

        serializer = LeaseSerializer(data=lease_data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        lease = serializer.save()
        self.assertEqual(lease.tenant.full_name, "John Doe")

    def test_update_status_serializer(self):
        image = create_test_image()
        tenant = Tenant.objects.create(
            user=self.user,
            full_name='John Doe',
            gender='male',
            phone_number='08123',
            occupation='Student',
            institution='XYZ',
            identity_type='KTP',
            identity_card=image
        )
    
        lease_data = {
            'tenant': tenant, 
            'room': self.room.id, 
            'start_date': '2025-10-01',
            'end_date': '2025-10-31'
        }

        serializer = LeaseSerializer(data=lease_data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        lease = serializer.save()

        updated_data = {
            'status': 'accepted'
        }

        serializer = LeaseSerializer(instance=lease, data=updated_data, partial=True)
        self.assertTrue(serializer.is_valid(), serializer.errors)

        updated_lease = serializer.save()

        self.assertEqual(updated_lease.status, 'accepted')

class ViewTest(APITestCase):
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
            name='Room 101'
        )

        # user biasa
        self.user = User.objects.create_user(
            username='user',
            email='user@gmail.com',
            password='pass123'
        )

        # staff/admin
        self.staff = User.objects.create_user(
            username='staff',
            email='staff@gmail.com',
            password='pass123',
        )

        staff_group = Group.objects.create(name='staff')
        self.staff.groups.add(staff_group)

        # tenant
        self.tenant = Tenant.objects.create(
            user=self.user,
            full_name='John Doe',
            gender='male',
            phone_number='08123',
            occupation='Student',
            institution='XYZ',
            identity_type='KTP',
            identity_card=image
        )

        self.lease_url = '/leases/'  # sesuaikan dengan urls.py
    
    def authenticate(self, user):
        response = self.client.post('/login/', {
            'email': user.email,
            'password': 'pass123'
        })
        token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
    
    def test_user_cannot_get_all_leases(self):
        self.authenticate(self.user)

        response = self.client.get(self.lease_url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_staff_can_get_all_leases(self):
        self.authenticate(self.staff)

        response = self.client.get(self.lease_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_staff_can_update_status(self):
        self.authenticate(self.user)

        lease = Lease.objects.create(
            tenant=self.tenant,
            room=self.room,
            start_date='2025-10-01',
            end_date='2025-10-31'
        )

        # login sebagai staff
        self.authenticate(self.staff)

        url = f'/leases/{lease.id}/'

        response = self.client.put(url, {
            'status': 'accepted'
        })

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'accepted')
        
    def test_user_cannot_update_status(self):
        lease = Lease.objects.create(
            tenant=self.tenant,
            room=self.room,
            start_date='2025-10-01',
            end_date='2025-10-31'
        )

        self.authenticate(self.user)

        url = f'/leases/{lease.id}/'

        response = self.client.put(url, {
            'status': 'accepted'
        })

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_user_try_to_delete_lease(self):
        lease = Lease.objects.create(
            tenant=self.tenant,
            room=self.room,
            start_date='2025-10-01',
            end_date='2025-10-31'
        )

        self.authenticate(self.user)

        url = f'/leases/{lease.id}/'

        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_unauthenticated_access(self):
        response = self.client.get(self.lease_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)