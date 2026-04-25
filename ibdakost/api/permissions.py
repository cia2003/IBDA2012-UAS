from rest_framework.permissions import BasePermission

class IsSuperUser(BasePermission):
    """
    Allows access to superusers.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_superuser

class IsAdmin(BasePermission):
    """
    Allows access to admin.
    """

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.groups.filter(name='admin').exists()

class IsTenant(BasePermission):
    """
    Allows access to tenants.
    """

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.groups.filter(name='tenant').exists()
    
class IsKostStaff(BasePermission):
    """
    Allows access to kost staff.
    """

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.groups.filter(name='kost_staff').exists()

class IsAdminOrSuperUser(BasePermission):
    """
    Allows access to admin and superusers.
    """
    def has_permission(self, request, view):
      return (
          request.user and request.user.is_authenticated and (
              request.user.is_superuser or
              request.user.groups.filter(name='admin').exists()
          )
      )

class IsAdminOrKostManagerOrSuperUser(BasePermission):
    """
    Allows access to admin, kost managers, and superusers.
    """
    def has_permission(self, request, view):
      return (
          request.user and request.user.is_authenticated and (
              request.user.is_superuser or
              request.user.groups.filter(name='admin').exists() or
              request.user.groups.filter(name='kost_manager').exists()
          )
      )

class IsOwnerOrAdminOrSuperUser(BasePermission):
    """
    Allows access to the owner of the object, admin, and superusers.
    """
    def has_object_permission(self, request, view, obj):
        return (
            request.user and request.user.is_authenticated and (
                request.user.is_superuser or
                request.user.groups.filter(name='admin').exists() or
                obj == request.user
            )
        )

class IsKostManager(BasePermission):
    """
    Allows access to the manager of the kost, admin, and superusers.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.groups.filter(name='kost_manager').exists()