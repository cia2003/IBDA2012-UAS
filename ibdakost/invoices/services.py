from dateutil.relativedelta import relativedelta
from datetime import date, datetime, timedelta
from .models import Invoice

class InvoiceService:
    @staticmethod
    def calculate_total(unit_price, quantity):
        return unit_price * quantity
    
    @staticmethod
    def build_invoice_data(lease):
        unit_price = lease.room.room_type.price
        quantity = 1

        return {
            'unit_price': unit_price,
            'quantity': quantity,
            'total_amount': InvoiceService.calculate_total(unit_price, quantity)
        }
    
    @staticmethod
    def generate_next_invoice(lease):
        today = date.today()

        if lease.status != 'accepted':
            return None

        # tanda '-' pada '-period_start' berarti urutan dari paling baru
        last_invoice = lease.invoices.order_by('-period_start').first()

        if last_invoice:
            next_start = last_invoice.period_start + relativedelta(months=1)
        else:
            next_start = lease.start_date

        if isinstance(next_start, str):
            next_start = datetime.strptime(next_start, "%Y-%m-%d").date()

        # Jangan generate kalau belum waktunya
        if next_start > today:
            return None

        # Anti-duplicate safety
        if lease.invoices.filter(period_start=next_start).exists():
            return None

        period_end = next_start + relativedelta(months=1) - timedelta(days=1)

        data = InvoiceService.build_invoice_data(lease)
        
        return Invoice.objects.create(
            lease=lease,
            period_start=next_start,
            period_end=period_end,
            issue_date=next_start,
            due_date=next_start + timedelta(days=10),
            unit_price=data['unit_price'],
            quantity=data['quantity'],
            total_amount= data['total_amount']
        )

    staticmethod
    def mark_overdue():
        today = date.today()

        return Invoice.objects.filter(
            status='pending',
            due_date__lt=today # ambil data due_date < today
        ).update(status='overdue')
