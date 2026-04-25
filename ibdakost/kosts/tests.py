from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile

from kosts.models import Kost
from kosts.serializers import KostSerializer

# Create your tests here.
class KostModelTests(TestCase):
    def setUp(self):
        image = SimpleUploadedFile(name='test_image.jpg', content=b'\x47\x49\x46\x38\x39\x61', content_type='image/jpeg')
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
        image = SimpleUploadedFile(name='test_image.jpg', content=b'\x47\x49\x46\x38\x39\x61', content_type='image/jpeg')
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