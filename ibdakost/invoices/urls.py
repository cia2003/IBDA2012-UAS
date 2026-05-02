from django.urls import path
from . import views
 
urlpatterns = [
    path('invoices/', views.InvoiceListCreateView.as_view(), name='invoice-list'),
    path('invoices/<uuid:pk>/', views.InvoiceDetailView.as_view(), name='invoice-detail'),
]