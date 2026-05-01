from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from api.permissions import IsOwnerOrAdminOrSuperUser, IsAdminOrSuperUser
from .models import Wishlist
from .serializers import WishlistSerializer
from django.http import Http404
from django.shortcuts import render

# Create your views here.
class WishlistListCreateView(APIView):
    authentication_classes = [JWTAuthentication]

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated()]
        return [IsAuthenticated(), IsOwnerOrAdminOrSuperUser()]

    def get(self, request):
        user = request.user

        # jika admin atau superuser
        is_superuser = user.is_superuser
        is_admin = user.groups.filter(name='admin').exists()

        if is_superuser or is_admin:
            Wishlists = Wishlist.objects.all().order_by('created_at')[:10]
        else:
            Wishlists = Wishlist.objects.filter(user=user).order_by('created_at')
        serializer = WishlistSerializer(Wishlists, many=True)
        return Response({'Wishlists': serializer.data})

    def post(self, request):
        serializer = WishlistSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class WishlistDetailView(APIView):
    authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated, IsOwnerOrAdminOrSuperUser]

    def get_permissions(self):
        if self.request.method == 'PUT':
            return [IsAuthenticated(), IsAdminOrSuperUser()]
        return [IsAuthenticated(), IsOwnerOrAdminOrSuperUser()]

    def get_object(self, pk):
        try:
            return Wishlist.objects.get(pk=pk)
        except Wishlist.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        Wishlist = self.get_object(pk)
        serializer = WishlistSerializer(Wishlist)
        return Response(serializer.data)

    def put(self, request, pk):
        Wishlist = self.get_object(pk)
        serializer = WishlistSerializer(Wishlist, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        Wishlist = self.get_object(pk)
        Wishlist.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
