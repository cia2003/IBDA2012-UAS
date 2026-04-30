from django.contrib import admin
from django.urls import include, path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from api.views import EmailLoginView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('api.urls')),  # Sertakan URL dari aplikasi api
    path('', include('kosts.urls')),  # Sertakan URL dari aplikasi kosts
    path('', include('rooms.urls')),  # Sertakan URL dari aplikasi rooms
    path('login/', EmailLoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='refresh'),
    path('api-auth/', include('rest_framework.urls')),  # Untuk login/logout di browsable API
]
