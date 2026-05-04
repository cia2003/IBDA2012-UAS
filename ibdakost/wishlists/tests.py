from django.test import TestCase
from django.urls import reverse

from rooms.models import Room, RoomType
from kosts.models import Kost
from api.models import User
from wishlists.models import Wishlist


from django.contrib.auth.models import Group

from wishlists.serializers import WishlistSerializer

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
        self.room = Room.objects.create(kost=self.kost, room_type=self.room_type, name='Room 101', image=image)
        self.user = User.objects.create_user(first_name='test', last_name='user', email='testuser@example.com', password='testpass')
    
    def test_wishlist_creation(self):
        wishlist = Wishlist.objects.create(
            user = self.user, 
            room = self.room, 
        )

        self.assertEqual(wishlist.user.first_name, "test")

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
        self.room = Room.objects.create(kost=self.kost, room_type=self.room_type, name='Room 101', image=image)
        self.user = User.objects.create_user(first_name='test', last_name='user', email='testuser@example.com', password='testpass')
    
    def test_wishlist_serializer(self):
        wishlist_data = {
            'user': self.user.id, 
            'room': self.room.id, 
        }

        serializer = WishlistSerializer(data=wishlist_data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        wishlist = serializer.save()
        self.assertEqual(wishlist.user.first_name, "test")

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
            name='Room 101', 
            image=image
        )

        # user biasa
        self.user = User.objects.create_user(first_name='test', last_name='user', email='testuser@example.com', password='pass123')

        # staff/admin
        self.staff = User.objects.create_user(
            first_name='staff',
            last_name='test',
            email='staff@gmail.com',
            password='pass123',
        )

        staff_group = Group.objects.create(name='staff')
        self.staff.groups.add(staff_group)

        self.wishlist_url = '/wishlists/'  # sesuaikan dengan urls.py
    
    def authenticate(self, user):
        response = self.client.post('/login/', {
            'email': user.email,
            'password': 'pass123'
        })
        token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
    
    def test_user_can_get_their_own_wishlists(self):
        self.authenticate(self.user)

        response = self.client.get(self.wishlist_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_staff_can_get_all_wishlists(self):
        self.authenticate(self.staff)

        response = self.client.get(self.wishlist_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_can_delete_their_own_wishlist(self):
        self.authenticate(self.user)

        wishlist = Wishlist.objects.create(
            user=self.user,
            room=self.room,
        )

        url = f'/wishlists/{wishlist.id}/'

        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        
    def test_unauthenticated_access(self):
        response = self.client.get(self.wishlist_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)