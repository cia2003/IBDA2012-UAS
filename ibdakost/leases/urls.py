from django.urls import path
from . import views
 
urlpatterns = [
    path('leases/', views.LeaseListCreateView.as_view(), name='lease-list'),
    path('leases/<uuid:pk>/', views.LeaseDetailView.as_view(), name='lease-detail'),
]