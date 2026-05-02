from dateutil.relativedelta import relativedelta
from datetime import date, timedelta

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
    def generate_initial_invoice(lease):
        today = date.today()

        period_start = lease.start_date
        period_end = period_start + relativedelta(months=1) - timedelta(days=1)

        if lease.invoices.filter(period_start=period_start).exists():
            return None
        
        data = InvoiceService.build_invoice_data(lease)

        return {
            'lease': lease,
            'period_start': period_start,
            'period_end': period_end,
            'issue_date': today,
            'due_date': today + timedelta(days=3)
            **data
        }
    
    @staticmethod
    def generate_monthly_invoice_for_lease(lease):
        today = date.today()

        last_period_end = lease.invoices.order_by('-period_end').values_list('period_end', flat=True).first()

        if last_period_end:
            period_start = last_period_end + timedelta(days=1)
        else:
            period_start = lease.start_date
        
        if period_start > today:
            return None
        
        while period_start + relativedelta(months=1) <= today:
            period_start += relativedelta(months=1)
        
        period_end = period_start + relativedelta(months=1) - timedelta(days=1)

        if lease.invoices.filter(period_start=period_start).exists():
            return None
        
        data = InvoiceService.build_invoice_data(lease)

        return {
            'lease': lease,
            'period_start': period_start,
            'period_end': period_end,
            'issue_date': today,
            'due_date': period_start - timedelta(days=7),
            **data
        }
    
    def mark_overdue():
        today = date.today()

        return {
            'status': 'overdue'
        }
