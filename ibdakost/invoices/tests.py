from django.test import TestCase

import io
from PIL import Image
from django.core.files.uploadedfile import SimpleUploadedFile

from .services import InvoiceService
from .models import Invoice
from kosts.models import Kost
from rooms.models import Room, RoomType
from api.models import User, Tenant
from leases.models import Lease

# Create your tests here.
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

class InvoiceServiceTest(TestCase):
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

        self.lease = Lease.objects.create(
            tenant = self.tenant, 
            room = self.room, 
            start_date = "2025-10-01",
            end_date = "2025-10-31"
        )
    
    def test_no_invoice_if_not_approved(self):
        InvoiceService.generate_next_invoice(self.lease)

        self.assertEqual(Invoice.objects.count(), 0)