from celery import shared_task
from leases.models import Lease
from .services import InvoiceService

@shared_task
def generate_monthly_invoices():
    leases = Lease.objects.filter(status='approved')

    for lease in leases:
        InvoiceService.generate_next_invoice(lease)

@shared_task
def update_overdue_invoices():
    InvoiceService.mark_overdue()
