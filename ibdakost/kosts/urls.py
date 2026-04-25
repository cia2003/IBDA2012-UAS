from django.urls import path
from . import views
 
urlpatterns = [
    path('kosts/', views.KostListCreateView.as_view(), name='kost-list'),
    path('kosts/<uuid:pk>/', views.KostDetailView.as_view(), name='kost-detail'),
]