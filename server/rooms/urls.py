from django.urls import path
from . import views
 
urlpatterns = [
    path('roomtypes/', views.RoomTypeListCreateView.as_view(), name='roomtype-list'),
    path('roomtypes/<uuid:pk>/', views.RoomTypeDetailView.as_view(), name='roomtype-detail'),
    path('rooms/', views.RoomListCreateView.as_view(), name='room-list'),
    path('rooms/<uuid:pk>/', views.RoomDetailView.as_view(), name='room-detail'),
    path('facilities/', views.FacilityListCreateView.as_view(), name='facility-list'),
    path('facilities/<uuid:pk>/', views.FacilityDetailView.as_view(), name='facility-detail'),
]