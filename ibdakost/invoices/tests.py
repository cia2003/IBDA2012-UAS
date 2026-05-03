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
from leases.serializers import LeaseSerializer
from datetime import datetime, timedelta, date

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
            start_date = "2026-01-24",
            end_date = "2026-06-24"
        )
    
    def test_no_invoice_if_not_approved(self):
        InvoiceService.generate_next_invoice(self.lease)

        self.assertEqual(Invoice.objects.count(), 0)
    
    def test_generate_initial_invoice_when_approved(self):
        data = {
            'status': 'accepted'
        }

        serializer = LeaseSerializer(self.lease, data=data, partial=True)
        self.assertTrue(serializer.is_valid(), serializer.errors)

        updated_lease = serializer.save()

        InvoiceService.generate_next_invoice(updated_lease)

        self.assertEqual(updated_lease.tenant.user.id, self.tenant.user.id)
        self.assertEqual(Invoice.objects.count(), 1)
    
    def test_not_duplicate_invoice(self):
        data = {
            'status': 'accepted'
        }
        serializer = LeaseSerializer(self.lease, data, partial=True)
        self.assertTrue(serializer.is_valid(), serializer.errors)

        updated_lease = serializer.save()

        InvoiceService.generate_next_invoice(updated_lease)
        InvoiceService.generate_next_invoice(updated_lease)

        start_date = datetime.strptime(updated_lease.start_date, "%Y-%m-%d").date()

        self.assertEqual(
            Invoice.objects.filter(
                lease=updated_lease, 
                period_start = start_date
            ).count(), 
            1
        )
    
    def test_generate_next_month_invoice(self):
        data = {
            'status': 'accepted'
        }
        serializer = LeaseSerializer(self.lease, data, partial=True)
        self.assertTrue(serializer.is_valid(), serializer.errors)

        updated_lease = serializer.save()

        InvoiceService.generate_next_invoice(updated_lease)
        InvoiceService.generate_next_invoice(updated_lease)

        start_date = datetime.strptime(updated_lease.start_date, "%Y-%m-%d").date()

        self.assertEqual(
            Invoice.objects.filter(
                lease=updated_lease, 
                period_start = start_date
            ).count(), 
            1
        )
        self.assertEqual(
            Invoice.objects.filter(lease=updated_lease).count(), 2
        )
    
    def test_mark_overdue(self):
        serializer = LeaseSerializer(self.lease, {'status': 'accepted'}, partial=True)
        self.assertTrue(serializer.is_valid(), serializer.errors)

        updated_lease = serializer.save()

        InvoiceService.generate_next_invoice(updated_lease)

        invoice = Invoice.objects.get(lease=updated_lease)

        # paksa overdue
        invoice.due_date = date.today() - timedelta(days=1)
        invoice.save()

        InvoiceService.mark_overdue()

        invoice.refresh_from_db()
        self.assertEqual(invoice.status, 'overdue')