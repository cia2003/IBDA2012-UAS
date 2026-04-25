from django.contrib.auth.models import Group

from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile

from api.models import User, Tenant
from api.serializers import UserSerializer, TenantSerializer

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
        image = SimpleUploadedFile(name='test_image.jpg', content=b'\x47\x49\x46\x38\x39\x61', content_type='image/jpeg')
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



    # def test_staff_creation(self):
    #     # Test creating a staff member
    #     staff = Staff.objects.create(
    #         user=self.user,
    #         full_name='Jane Smith',
    #         gender='female',
    #         phone_number='08456',
    #         position='Manager'
    #     )

    #     self.assertEqual(staff.user, self.user)
    #     self.assertEqual(staff.full_name, 'Jane Smith')

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

    def test_tenant_serializer(self):
        # Test tenant serializer
        image = SimpleUploadedFile(name='test_image.jpg', content=b'\x47\x49\x46\x38\x39\x61', content_type='image/jpeg')
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
        serializer = TenantSerializer(tenant)
        self.assertEqual(serializer.data['full_name'], 'John Doe')

    # def test_staff_serializer(self):
    #     # Test staff serializer
    #     staff = Staff.objects.create(
    #         user=self.user,
    #         full_name='Jane Smith',
    #         gender='female',
    #         phone_number='08456',
    #         position='Manager'
    #     )
    #     serializer = StaffSerializer(staff)
    #     self.assertEqual(serializer.data['full_name'], 'Jane Smith')

class ViewTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', email='testuser@example.com', password='testpass')

    def test_user_list_create_view(self):
        # Test user list and create view
        pass

    def test_user_detail_view(self):
        # Test user detail view
        pass

    def test_tenant_list_create_view(self):
        # Test tenant list and create view
        pass

    def test_tenant_detail_view(self):
        # Test tenant detail view
        pass

    def test_staff_list_create_view(self):
        # Test staff list and create view
        pass

    def test_staff_detail_view(self):
        # Test staff detail view
        pass