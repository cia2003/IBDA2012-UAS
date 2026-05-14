from django.urls import path
from . import views
 
urlpatterns = [
    path('wishlists/', views.WishlistListCreateView.as_view(), name='wishlist-list'),
    path('wishlists/kost-details/', views.WishlistKostDetailView.as_view(), name="wishlist-kost-detail"),
    path('wishlists/<int:pk>/', views.WishlistDetailView.as_view(), name='wishlist-detail'),
]