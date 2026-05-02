from django.db import models
from leases.models import Lease

class Invoice(models.Model):
    id = models.AutoField(primary_key=True, editable=False)
    lease = models.ForeignKey(Lease, on_delete=models.CASCADE, related_name='invoices')

    period_start = models.DateField()
    period_end = models.DateField()

    issue_date = models.DateField()
    due_date = models.DateField()

    unit_price = models.DecimalField(max_digits=12, decimal_places=2)
    quantity = models.DecimalField(max_digits=10, decimal_places=2, default=1)

    total_amount = models.DecimalField(max_digits=10, decimal_places=2)

    status = models.CharField(
        max_length=20, 
        choices=[
            ('pending', 'Pending'),
            ('paid', 'Paid'),
            ('overdue', 'Overdue'), 
            ('canceled', 'Canceled')
        ],
        default='pending'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Invoice {self.id} - {self.status}"

    class Meta:
        db_table = 'invoices'
        unique_together = ('lease', 'period_start')