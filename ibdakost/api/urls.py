from django.urls import path
from . import views
 
urlpatterns = [
  path('users/', views.UserListCreateView.as_view(), name='user-list'),
  path('users/<uuid:pk>/', views.UserDetailView.as_view(), name='user-detail'),

  path('tenants/', views.TenantListCreateView.as_view(), name='tenant-list'),
  path('tenants/<uuid:id>/', views.TenantDetailView.as_view(), name='tenant-detail'),

  path('employees/', views.EmployeeListCreateView.as_view(), name='employee-list'),
  path('employees/<uuid:pk>/', views.EmployeeDetailView.as_view(), name='employee-detail'),
  path('kosts/<uuid:kost_id>/contact/', views.KostContactView.as_view(), name='kost-contact-detail'),

  path('groups/', views.GroupListCreateView.as_view(), name='group-list'),
  path('groups/<int:pk>/', views.GroupDetailView.as_view(), name='group-detail'),

  path('assign-roles/', views.AssignRoleView.as_view(), name='assign-roles'),
]