from celery import shared_task
from leases.models import Lease
from .services import InvoiceService

@shared_task
def generate_monthly_invoices():
    pass

@shared_task
def update_overdue_invoices():
    InvoiceService.mark_overdue()
