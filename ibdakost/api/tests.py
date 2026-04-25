from django.test import TestCase

from api.models import User, Tenant
from api.serializers import UserSerializer, TenantSerializer
# from ibdakost.api.models import User, Tenant
# from ibdakost.api.serializers import UserSerializer, TenantSerializer

# Create your tests here.
class ModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')

    def test_user_creation(self):
        # Test creating a user
        self.assertEqual(self.user.username, 'testuser')
        self.assertTrue(self.user.check_password('testpass'))
        self.assertIsNotNone(self.user.id)

    def test_tenant_creation(self):
        # Test creating a tenant
        tenant = Tenant.objects.create(
            user=self.user,
            full_name='John Doe',
            gender='male',
            phone_number='08123',
            occupation='Student',
            institution='XYZ',
            identity_type='KTP',
            identity_card='123'
        )

        self.assertEqual(tenant.user, self.user)
        self.assertEqual(tenant.full_name, 'John Doe')

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
        self.user = User.objects.create_user(username='testuser', password='testpass')

    def test_user_serializer(self):
        # Test user serializer
        serializer = UserSerializer(self.user)
        self.assertEqual(serializer.data['username'], 'testuser')

    def test_tenant_serializer(self):
        # Test tenant serializer
        tenant = Tenant.objects.create(
            user=self.user,
            full_name='John Doe',
            gender='male',
            phone_number='08123',
            occupation='Student',
            institution='XYZ',
            identity_type='KTP',
            identity_card='123'
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
        self.user = User.objects.create_user(username='testuser', password='testpass')

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