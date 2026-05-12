from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import Group
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from api.permissions import IsManagerOrSuperUser, IsOwnerOrManagerOrSuperUser
from .models import User, Tenant, Employee
from .serializers import EmailTokenObtainPairSerializer, TenantSerializer, UserSerializer, EmployeeSerializer, GroupSerializer
from django.http import Http404
from rest_framework_simplejwt.views import TokenObtainPairView

class EmailLoginView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer
    
class UserListCreateView(APIView):
    authentication_classes = [JWTAuthentication]

    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsAuthenticated(), IsManagerOrSuperUser()]
        return []
    

    def get(self, request):
        users = User.objects.all().order_by('first_name')[:10]
        serializer = UserSerializer(users, many=True)
        return Response({'users': serializer.data})

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserDetailView(APIView):
    authentication_classes = [JWTAuthentication]

    def get_permissions(self):
        if self.request.method == 'DELETE':
            return [IsAuthenticated(), IsManagerOrSuperUser()]
        return [IsAuthenticated(), IsOwnerOrManagerOrSuperUser()]

    def get_object(self, pk):
        try:
            user = User.objects.get(pk=pk)
            self.check_object_permissions(self.request, user)
            return user
        except User.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        user = self.get_object(pk)
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def put(self, request, pk):
        user = self.get_object(pk)
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        user = self.get_object(pk)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# Tenant and employee views are omitted for brevity. They should follow a similar pattern to User views, with appropriate permissions and serializers.
class TenantListCreateView(APIView):
    # Implementation similar to UserListCreateView with appropriate permissions and serializer
    authentication_classes = [JWTAuthentication]

    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsAuthenticated(), IsManagerOrSuperUser()]
        return []

    def get(self, request):
        tenants = Tenant.objects.all().order_by('created_at')[:10]
        serializer = TenantSerializer(tenants, many=True)
        return Response({'tenants': serializer.data})

    def post(self, request):
        serializer = TenantSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TenantDetailView(APIView):
    # Implementation similar to UserDetailView with appropriate permissions and serializer
    authentication_classes = [JWTAuthentication]

    def get_permissions(self):
        if self.request.method == 'DELETE':
            return [IsAuthenticated(), IsManagerOrSuperUser()]
        return [IsAuthenticated(), IsOwnerOrManagerOrSuperUser()]

    def get_object(self, pk):
        try:
            tenant = Tenant.objects.get(pk=pk)
            self.check_object_permissions(self.request, tenant)
            return tenant
        except Tenant.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        tenant = self.get_object(pk)
        serializer = TenantSerializer(tenant)
        return Response(serializer.data)

    def put(self, request, pk):
        tenant = self.get_object(pk)
        serializer = TenantSerializer(tenant, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        tenant = self.get_object(pk)
        tenant.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class EmployeeListCreateView(APIView):
    # Implementation similar to UserListCreateView with appropriate permissions and serializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsManagerOrSuperUser]

    def get(self, request):
        employees = Employee.objects.all().order_by('created_at')[:10]
        role = request.query_params.get('role')

        if role:
            employees = employees.filter(position=role)

        serializer = EmployeeSerializer(employees, many=True)
        return Response({'employees': serializer.data})

    def post(self, request):
        serializer = EmployeeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class EmployeeDetailView(APIView):
    # Implementation similar to UserDetailView with appropriate permissions and serializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsManagerOrSuperUser]

    def get_object(self, pk):
        try:
            employee = Employee.objects.get(pk=pk)
            self.check_object_permissions(self.request, employee)
            return employee
        except employee.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        employee = self.get_object(pk)
        role = request.query_params.get('role')

        if role:
            employees = employees.filter(employee__position=role)
            
        serializer = EmployeeSerializer(employee)
        return Response(serializer.data)

    def put(self, request, pk):
        employee = self.get_object(pk)
        serializer = EmployeeSerializer(employee, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        employee = self.get_object(pk)
        employee.delete()
        print(request.user.groups.all())
        return Response(status=status.HTTP_204_NO_CONTENT)

class GroupListCreateView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsManagerOrSuperUser]

    def get(self, request):
        groups = Group.objects.all().order_by('name')[:10]
        serializer = GroupSerializer(groups, many=True)
        return Response({'groups': serializer.data})

    def post(self, request):
        serializer = GroupSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GroupDetailView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsManagerOrSuperUser]

    def get_object(self, pk):
        try:
            group = Group.objects.get(pk=pk)
            self.check_object_permissions(self.request, group)
            return group
        except Group.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        group = self.get_object(pk)
        serializer = GroupSerializer(group)
        return Response(serializer.data)

    def put(self, request, pk):
        group = self.get_object(pk)
        serializer = GroupSerializer(group, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        group = self.get_object(pk)
        group.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class AssignRoleView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsManagerOrSuperUser]

    def post(self, request):
        user = get_object_or_404(User, pk=request.data['user_id'])
        group = get_object_or_404(Group, pk=request.data['group_id'])
        user.groups.add(group)

        return Response({
            "message": "Role assigned",
            "user_id": str(user.id),
            "groups": [g.name for g in user.groups.all()]
        }, status=status.HTTP_200_OK)