from django.contrib.auth.models import Group

from django.test import TestCase
from rest_framework.test import APITestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse

from api.models import User, Tenant, Staff
from api.serializers import UserSerializer, TenantSerializer, StaffSerializer
from kosts.models import Kost

import io
from PIL import Image


# create test image
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
class ModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', email='testuser@example.com', password='testpass')

    def test_user_creation(self):
        # Test creating a user
        self.assertEqual(self.user.username, 'testuser')
        self.assertEqual(self.user.email, 'testuser@example.com')
        self.assertTrue(self.user.check_password('testpass'))
        self.assertIsNotNone(self.user.id)

    def test_tenant_creation(self):
        # Test creating a tenant
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

        self.assertEqual(tenant.user, self.user)
        self.assertEqual(tenant.full_name, 'John Doe')
    
    def test_email_uniqueness(self):
        # Test that email must be unique
        with self.assertRaises(Exception):
            User.objects.create_user(username='anotheruser', email='testuser@example.com', password='testpass')
    
    def test_user_role_admin(self):
        # Test that user role is set correctly
        admin_group = Group.objects.create(name='admin')

        self.user.groups.add(admin_group)

        self.assertTrue(self.user.groups.filter(name='admin').exists())
    
    def test_user_role_staff(self):
        # Test that user role is set correctly
        staff_group = Group.objects.create(name='staff')

        self.user.groups.add(staff_group)

        self.assertTrue(self.user.groups.filter(name='staff').exists())

    def test_user_role_tenant(self):
        # Test that user role is set correctly
        tenant_group = Group.objects.create(name='tenant')

        self.user.groups.add(tenant_group)

        self.assertTrue(self.user.groups.filter(name='tenant').exists())
    
    def test_double_role_assignment(self):
        # Test that a user can have multiple roles
        admin_group = Group.objects.create(name='admin')
        staff_group = Group.objects.create(name='staff')

        self.user.groups.add(admin_group)
        self.user.groups.add(staff_group)

        self.assertTrue(self.user.groups.filter(name='admin').exists())
        self.assertTrue(self.user.groups.filter(name='staff').exists())

    def test_staff_creation(self):
        # Test creating a staff member
        staff = Staff.objects.create(
            user=self.user,
            full_name='Jane Smith',
            kost=Kost.objects.create(
                name='Kost A',
                address='Jl. Example No. 123',
                description='Kost nyaman dan strategis',
                image=create_test_image()
            )
        )

        self.assertEqual(staff.user, self.user)
        self.assertEqual(staff.full_name, 'Jane Smith')

class SerializerTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', email='testuser@example.com', password='testpass')

    def test_user_serializer_output(self):
        # Test user serializer
        serializer = UserSerializer(self.user)
        self.assertEqual(serializer.data['username'], 'testuser')
        self.assertEqual(serializer.data['email'], 'testuser@example.com')
    
    def test_suspended_user_become_inactive(self):
        # Test that a suspended user becomes inactive
        serializer = UserSerializer(self.user, data={'status': 'suspended'}, partial=True)
        self.assertTrue(serializer.is_valid())

        serializer.save()
        self.assertFalse(serializer.instance.is_active)

    def test_tenant_serializer_create(self):
        # Test tenant serializer create method
        image = create_test_image()
        tenant_data = {
            'user_id': self.user.id,
            'full_name': 'John Doe',
            'gender': 'male',
            'phone_number': '08123',
            'occupation': 'Student',
            'institution': 'XYZ',
            'identity_type': 'KTP',
            'identity_card': image
        }

        serializer = TenantSerializer(data=tenant_data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        tenant = serializer.save()
        self.assertEqual(tenant.user.groups.filter(name='tenant').exists(), True)

    def test_staff_serializer_create(self):
        # Test staff serializer create method
        image_kost = create_test_image()
        assigned_kost = Kost.objects.create(
            name='Kost A',
            address='Jl. Example No. 123',
            description='Kost nyaman dan strategis',
            image=image_kost
        )

        staff_data = {
            'user_id': self.user.id,
            'full_name': 'Jane Smith',
            'kost_id': assigned_kost.id,
        }
        serializer = StaffSerializer(data=staff_data)
        self.assertTrue(serializer.is_valid())
        staff = serializer.save()
        self.assertEqual(staff.user.groups.filter(name='staff').exists(), True)

class ViewTests(APITestCase):
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
    
    def test_admin_can_delete_user(self):
        # Test that admin can delete a user
        url = reverse('user-detail', kwargs={'pk': self.user.pk})
        self.client.force_authenticate(user=self.admin)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 204)
    
    def test_non_admin_cannot_delete_user(self):
        # Test that non-admin cannot delete a user
        url = reverse('user-detail', kwargs={'pk': self.admin.pk})
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 403)