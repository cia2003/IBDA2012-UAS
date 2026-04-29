from django.contrib.auth.models import Group

from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse

from rest_framework.test import APITestCase

from api.models import User
from kosts.models import Kost
from kosts.serializers import KostSerializer

import io
from PIL import Image


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

# Create your tests here.
class KostModelTests(TestCase):
    def setUp(self):
        image = create_test_image()
        self.kost = Kost.objects.create(
            name='Kost A',
            address='Jl. Example No. 123',
            description='Kost nyaman dan strategis',
            image=image
        )

    def test_kost_creation(self):
        # Test creating a kost
        self.assertEqual(self.kost.name, 'Kost A')
        self.assertEqual(self.kost.address, 'Jl. Example No. 123')
        self.assertEqual(self.kost.description, 'Kost nyaman dan strategis')

class KostSerializerTests(TestCase):
    def setUp(self):
        image = create_test_image()
        self.kost = Kost.objects.create(
            name='Kost A',
            address='Jl. Example No. 123',
            description='Kost nyaman dan strategis',
            image=image
        )

    def test_kost_serializer(self):
        # Test kost serializer
        serializer = KostSerializer(self.kost)
        self.assertEqual(serializer.data['name'], 'Kost A')
        self.assertEqual(serializer.data['address'], 'Jl. Example No. 123')
        self.assertEqual(serializer.data['description'], 'Kost nyaman dan strategis')
    
    def test_kost_update_serializer(self):
        # Test kost update serializer
        data = {
            'name': 'Kost B',
        }
        serializer = KostSerializer(instance=self.kost, data=data, partial=True)
        self.assertTrue(serializer.is_valid())
        updated_kost = serializer.save()
        self.assertEqual(updated_kost.name, 'Kost B')
        self.assertEqual(updated_kost.address, 'Jl. Example No. 123')
        self.assertEqual(updated_kost.description, 'Kost nyaman dan strategis')

class KostViewTests(APITestCase):
    def setUp(self):
        image = create_test_image()
        self.kost = Kost.objects.create(
            name='Kost A',
            address='Jl. Example No. 123',
            description='Kost nyaman dan strategis',
            image=image
        )

        self.admin = User.objects.create_user(
            username='admin',
            email = 'admin@test.com',
            password='adminpass'
        )

        self.user = User.objects.create_user(
            username='user',
            email = 'user@test.com',
            password='userpass'
        )

        admin_group = Group.objects.create(name='admin')
        self.admin.groups.add(admin_group)

    def test_admin_can_delete_kost(self):
        url = reverse('kost-detail', kwargs={'pk': self.kost.pk})
        self.client.force_authenticate(user=self.admin)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 204)
    
    def test_user_cannot_delete_kost(self):
        # Test that regular user cannot delete a kost
        url = reverse('kost-detail', kwargs={'pk': self.kost.pk})
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 403)