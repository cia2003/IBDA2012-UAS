from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from api.permissions import  IsAdminOrStaffOrSuperUser
from .models import Invoice
from .serializers import InvoiceSerializer
from django.http import Http404
from django.shortcuts import render
from .services import InvoiceService
from leases.models import Lease

# Create your views here.
class InvoiceListCreateView(APIView):
    authentication_classes = [JWTAuthentication]

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated()]
        return [IsAuthenticated(), IsAdminOrStaffOrSuperUser()]

    def get(self, request):
        Invoices = Invoice.objects.all().order_by('created_at')[:10]
        serializer = InvoiceSerializer(Invoices, many=True)
        return Response({'Invoices': serializer.data})

    def post(self, request):
        lease = Lease.objects.get(id=request.data['lease'])

        data = InvoiceService.create_invoice_data(
            lease=lease,
            period_start=request.data['period_start'],
            period_end=request.data['period_end'],
            issue_date=request.data['issue_date'],
            due_date=request.data['due_date'],
        )

        invoice = Invoice.objects.create(**data)

        serializer = InvoiceSerializer(invoice)

        if serializer.is_valid():
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class InvoiceDetailView(APIView):
    authentication_classes = [JWTAuthentication]

    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsAuthenticated()]
        return [IsAuthenticated(), IsAdminOrStaffOrSuperUser()]

    def get_object(self, pk):
        try:
            return Invoice.objects.get(pk=pk)
        except Invoice.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        Invoice = self.get_object(pk)
        serializer = InvoiceSerializer(Invoice)
        return Response(serializer.data)

    def put(self, request, pk):
        Invoice = self.get_object(pk)
        serializer = InvoiceSerializer(Invoice, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        Invoice = self.get_object(pk)
        Invoice.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
