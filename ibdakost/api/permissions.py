from rest_framework.permissions import BasePermission

class IsSuperUser(BasePermission):
    """
    Allows access to superusers.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_superuser

class IsManager(BasePermission):
    """
    Allows access to Manager.
    """

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.groups.filter(name='manager').exists()

class IsStaff(BasePermission):
    """
    Allows access to staff.
    """

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.groups.filter(name='staff').exists()

class IsManagerOrSuperUser(BasePermission):
    """
    Allows access to Manager and superusers.
    """
    def has_permission(self, request, view):
      return (
          request.user and request.user.is_authenticated and (
              request.user.is_superuser or
              request.user.groups.filter(name='manager').exists()
          )
      )

class IsManagerOrStaffOrSuperUser(BasePermission):
    """
    Allows access to Manager, staff, and superusers.
    """
    def has_permission(self, request, view):
      return (
          request.user and request.user.is_authenticated and (
              request.user.is_superuser or
              request.user.groups.filter(name='manager').exists() or
              request.user.groups.filter(name='staff').exists()
          )
      )

class IsOwnerOrManagerOrSuperUser(BasePermission):
    """
    Allows access to the owner of the object, Manager, and superusers.
    """
    def has_object_permission(self, request, view, obj):
        return (
            request.user and request.user.is_authenticated and (
                request.user.is_superuser or
                request.user.groups.filter(name='manager').exists() or
                obj.user == request.user or
                obj == request.user
            )
        )