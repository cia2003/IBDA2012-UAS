from rest_framework import serializers
from rest_framework.reverse import reverse
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import Group
from api.models import Tenant, User
 
class UserSerializer(serializers.HyperlinkedModelSerializer):
    _links = serializers.SerializerMethodField()
 
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', '_links']
        extra_kwargs = {
            'password': {'write_only': True}
        }
 
    def create(self, validated_data):
        """
        Override create method to hash password and create user.
        """
        password = validated_data.pop('password')
        validated_data['password'] = make_password(password)
        return User.objects.create(**validated_data)
 
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
    url = serializers.SerializerMethodField()
    user = serializers.CharField(source='user.username', read_only=True)

    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source='user',
        write_only=True
    )

    class Meta:
        model = Tenant
        fields = [
            'id', 'user', 'user_id', 'full_name', 'gender', 'phone_number', 'occupation', 'institution', 'identity_type', 'identity_card', 'url'
        ]

    def get_url(self, obj):
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
    
# class StaffSerializer(serializers.ModelSerializer):
#     url = serializers.SerializerMethodField()
#     user = serializers.CharField(source='user.username', read_only=True)

#     user_id = serializers.PrimaryKeyRelatedField(
#         queryset=User.objects.all(),
#         source='user',
#         write_only=True
#     )

#     class Meta:
#         model = Staff
#         fields = ['id', 'name', 'user', 'user_id', 'full_name', 'assignedKost', 'url']

#     def get_url(self, obj):
#         request = self.context.get('request')
#         return [
#             {
#                 "rel": "self",
#                 "href": reverse('staff-list', request=request), 
#                 "action": "POST", 
#                 "types": ["application/json"]
#             }, 
#             {
#                 "rel": "self",
#                 "href": reverse('staff-detail', kwargs={'id': obj.id}, request=request), 
#                 "action": "GET", 
#                 "types": ["application/json"]
#             }, 
#             {
#                 "rel": "self",
#                 "href": reverse('staff-detail', kwargs={'id': obj.id}, request=request), 
#                 "action": "PUT", 
#                 "types": ["application/json"]
#             },
#             {
#                 "rel": "self",
#                 "href": reverse('staff-detail', kwargs={'id': obj.id}, request=request), 
#                 "action": "DELETE", 
#                 "types": ["application/json"]
#             }
#         ]

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