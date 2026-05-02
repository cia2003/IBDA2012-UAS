from rest_framework import serializers
from rest_framework.reverse import reverse
from .models import Invoice
from invoices.models import Invoice

class InvoiceSerializer(serializers.ModelSerializer):
    _links = serializers.SerializerMethodField()
    invoice = serializers.PrimaryKeyRelatedField(queryset=Invoice.objects.all())

    class Meta:
        model = Invoice
        fields = [
            'id', 'invoice', 'period_start', 'period_end', 'issue_date', 'due_date', 
            'unit_price', 'quantity', 'total_amount', 'status', 'created_at', 'updated_at', '_links'
            ]
        read_only_fields = [
            'unit_price', 'quantity', 'total_amount',
            'created_at', 'updated_at'
        ]

    def get__links(self, obj):
        request = self.context.get('request')
        return [
            {
                "rel": "self",
                "href": reverse('invoice-list', request=request),
                "action": "POST",
                "types": ["application/json"]
            },
            {
                "rel": "self",
                "href": reverse('invoice-detail', kwargs={'pk': obj.pk}, request=request),
                "action": "GET",
                "types": ["application/json"]
            },
            {
                "rel": "self",
                "href": reverse('invoice-detail', kwargs={'pk': obj.pk}, request=request),
                "action": "PUT",
                "types": ["application/json"]
            },
            {
                "rel": "self",
                "href": reverse('invoice-detail', kwargs={'pk': obj.pk}, request=request),
                "action": "DELETE",
                "types": ["application/json"]
            }
        ]
        
    