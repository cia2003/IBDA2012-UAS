from rest_framework import serializers
from rest_framework.reverse import reverse
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import Group
from api.models import Tenant, User, Staff
from kosts.models import Kost
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
 
class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
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

        data = super().get_token(user)

        return {
            'refresh': str(data),
            'access': str(data.access_token),
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'groups': [group.name for group in user.groups.all()]
            }
        }

class UserSerializer(serializers.HyperlinkedModelSerializer):
    _links = serializers.SerializerMethodField()
 
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'created_at', 'updated_at', 'status', 'is_active', '_links']
        extra_kwargs = {
            'password': {'write_only': True}, 
            'is_active': {'read_only': True}
        }
 
    def create(self, validated_data):
        """
        Override create method to hash password and create user.
        """
        validated_data['email'] = validated_data['email'].lower()

        status = validated_data.get('status', 'active')
        validated_data['is_active'] = status not in ['suspended', 'deleted']

        password = validated_data.pop('password')
        validated_data['password'] = make_password(password)

        user = User.objects.create(**validated_data)

        return user
    
    def update(self, instance, validated_data):
        if 'email' in validated_data:
            validated_data['email'] = validated_data['email'].lower()

        if 'status' in validated_data:
            status = validated_data['status']
            instance.is_active = status not in ['suspended', 'deleted']

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance
    
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
    user = serializers.CharField(source='user.username', read_only=True)

    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source='user',
        write_only=True
    )

    class Meta:
        model = Tenant
        fields = [
            'id', 'user', 'user_id', 'full_name', 'gender', 'phone_number', 'occupation', 'institution', 'identity_type', 'identity_card', '_links'
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
                "href": reverse('tenant-detail', kwargs={'id': obj.id}, request=request), 
                "action": "GET", 
                "types": ["application/json"]
            }, 
            {
                "rel": "self",
                "href": reverse('tenant-detail', kwargs={'id': obj.id}, request=request), 
                "action": "PUT", 
                "types": ["application/json"]
            },
            {
                "rel": "self",
                "href": reverse('tenant-detail', kwargs={'id': obj.id}, request=request), 
                "action": "DELETE", 
                "types": ["application/json"]
            }
        ]
    
class StaffSerializer(serializers.ModelSerializer):
    _links = serializers.SerializerMethodField()
    user = serializers.CharField(source='user.username', read_only=True)
    kost = serializers.CharField(source='kost.name', read_only=True)

    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source='user',
        write_only=True
    )

    kost_id = serializers.PrimaryKeyRelatedField(
        queryset=Kost.objects.all(),
        source='kost',
        write_only=True
    )

    class Meta:
        model = Staff
        fields = ['id', 'user', 'user_id', 'full_name', 'kost', 'kost_id', '_links']

    def create(self, validated_data):
        user = validated_data.pop('user')

        staff_group, _ = Group.objects.get_or_create(name='staff')
        user.groups.add(staff_group)

        staff = Staff.objects.create(user=user, **validated_data)
        return staff

    def get__links(self, obj):
        request = self.context.get('request')
        return [
            {
                "rel": "self",
                "href": reverse('staff-list', request=request), 
                "action": "POST", 
                "types": ["application/json"]
            }, 
            {
                "rel": "self",
                "href": reverse('staff-detail', kwargs={'id': obj.id}, request=request), 
                "action": "GET", 
                "types": ["application/json"]
            }, 
            {
                "rel": "self",
                "href": reverse('staff-detail', kwargs={'id': obj.id}, request=request), 
                "action": "PUT", 
                "types": ["application/json"]
            },
            {
                "rel": "self",
                "href": reverse('staff-detail', kwargs={'id': obj.id}, request=request), 
                "action": "DELETE", 
                "types": ["application/json"]
            }
        ]

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