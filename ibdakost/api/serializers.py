from rest_framework import serializers
from rest_framework.reverse import reverse
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import Group
from api.models import Tenant, User, Employee
from kosts.models import Kost
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
 
class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    username_field = "email"

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError('Invalid email or password.')

        if not user.check_password(password):
            raise serializers.ValidationError('Invalid email or password.')

        if not user.is_active:
            raise serializers.ValidationError('User account is disabled.')

        refresh = self.get_token(user)

        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'id': user.id,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'email': user.email,
                'groups': [group.name for group in user.groups.all()]
            }
        }

class UserSerializer(serializers.ModelSerializer):
    _links = serializers.SerializerMethodField()
 
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'password', 'is_active', 'is_staff', 'created_at', 'updated_at', '_links']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        """
        Override create method to hash password and create user.
        """
        validated_data['email'] = validated_data['email'].lower()

        password = validated_data.pop('password')
        validated_data['password'] = make_password(password)

        user = User.objects.create(**validated_data)

        return user
    
    def update(self, instance, validated_data):
        if 'email' in validated_data:
            validated_data['email'] = validated_data['email'].lower()

        if 'password' in validated_data:
            password = validated_data.pop('password')
            validated_data['password'] = make_password(password)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        
        return instance
    
    def delete(self, instance):
        instance.groups.clear()  # Hapus semua grup yang terkait dengan user
        instance.delete()
    
    def get__links(self, obj):
        request = self.context.get('request')
        return [
            {
                "rel": "self",
                "href": reverse('user-list', request=request),
                "action": "POST",
                "types": ["application/json"]
            },
            {
                "rel": "self",
                "href": reverse('user-detail', kwargs={'pk': obj.pk}, request=request),
                "action": "GET",
                "types": ["application/json"]
            },
            {
                "rel": "self",
                "href": reverse('user-detail', kwargs={'pk': obj.pk}, request=request),
                "action": "PUT",
                "types": ["application/json"]
            },
            {
                "rel": "self",
                "href": reverse('user-detail', kwargs={'pk': obj.pk}, request=request),
                "action": "DELETE",
                "types": ["application/json"]
            }
        ]
    
    def get_groups(self, obj):
        return [group.name for group in obj.groups.all()]

class TenantSerializer(serializers.ModelSerializer):
    _links = serializers.SerializerMethodField()
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    class Meta:
        model = Tenant
        fields = [
            'user', 'gender', 'phone_number', 'occupation', 'institution', 'identity_type', 'identity_card', 'created_at', 'updated_at', '_links'
        ]

    def create(self, validated_data):
        user = validated_data.pop('user')

        tenant_group, _ = Group.objects.get_or_create(name='tenant')
        user.groups.add(tenant_group)

        tenant = Tenant.objects.create(user=user, **validated_data)
        return tenant

    def get__links(self, obj):
        request = self.context.get('request')
        return [
            {
                "rel": "self",
                "href": reverse('tenant-list', request=request), 
                "action": "POST", 
                "types": ["application/json"]
            }, 
            {
                "rel": "self",
                "href": reverse('tenant-detail', kwargs={'pk': obj.pk}, request=request), 
                "action": "GET", 
                "types": ["application/json"]
            }, 
            {
                "rel": "self",
                "href": reverse('tenant-detail', kwargs={'pk': obj.pk}, request=request), 
                "action": "PUT", 
                "types": ["application/json"]
            },
            {
                "rel": "self",
                "href": reverse('tenant-detail', kwargs={'pk': obj.pk}, request=request), 
                "action": "DELETE", 
                "types": ["application/json"]
            }
        ]

class EmployeeSerializer(serializers.ModelSerializer):
    _links = serializers.SerializerMethodField()
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    class Meta:
        model = Employee
        fields = ['user', 'kost', 'position', 'phone_number', 'created_at', 'updated_at', '_links']

    def create(self, validated_data):
        user = validated_data.pop('user')
        position = validated_data.get('position')

        if position:
            if validated_data['position'] == 'staff':
                employee_group, _ = Group.objects.get_or_create(name='staff')
                user.groups.add(employee_group)
            
            if validated_data['position'] == 'manager':
                employee_group, _ = Group.objects.get_or_create(name='manager')
                user.groups.add(employee_group)

        employee = Employee.objects.create(user=user, **validated_data)
        return employee

    def get__links(self, obj):
        request = self.context.get('request')
        return [
            {
                "rel": "self",
                "href": reverse('employee-list', request=request), 
                "action": "POST", 
                "types": ["application/json"]
            }, 
            {
                "rel": "self",
                "href": reverse('employee-detail', kwargs={'pk': obj.pk}, request=request), 
                "action": "GET", 
                "types": ["application/json"]
            }, 
            {
                "rel": "self",
                "href": reverse('employee-detail', kwargs={'pk': obj.pk}, request=request), 
                "action": "PUT", 
                "types": ["application/json"]
            },
            {
                "rel": "self",
                "href": reverse('employee-detail', kwargs={'pk': obj.pk}, request=request), 
                "action": "DELETE", 
                "types": ["application/json"]
            }
        ]

class EmployeeContactSerializer(serializers.ModelSerializer):
    # user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Employee
        fields = ['full_name', 'phone_number']

    def get_full_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    _links = serializers.SerializerMethodField()

    class Meta:
        model = Group
        fields = ['id', 'name', '_links']

    def get__links(self, obj):
        request = self.context.get('request')
        return [
            {
                "rel": "self",
                "href": reverse('group-list', request=request),
                "action": "POST",
                "types": ["application/json"]
            },
            {
                "rel": "self",
                "href": reverse('group-detail', kwargs={'pk': obj.pk}, request=request),
                "action": "GET",
                "types": ["application/json"]
            },
            {
                "rel": "self",
                "href": reverse('group-detail', kwargs={'pk': obj.pk}, request=request),
                "action": "PUT",
                "types": ["application/json"]
            },
            {
                "rel": "self",
                "href": reverse('group-detail', kwargs={'pk': obj.pk}, request=request),
                "action": "DELETE",
                "types": ["application/json"]
            }
        ]

class AssignRoleSerializer(serializers.Serializer):
    user_id = serializers.UUIDField()
    group_id = serializers.IntegerField()