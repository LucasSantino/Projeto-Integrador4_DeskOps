from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsTecnico(BasePermission):
    """Permite acesso total apenas a usuários com cargo 'tecnico' ou admin."""
    def has_permission(self, request, view):
        if request.user.is_staff:
            return True
        return request.user.cargo == "tecnico"


class IsUsuario(BasePermission):
    """Permite acesso a usuários com cargo 'usuario'."""
    def has_permission(self, request, view):
        return request.user.cargo == "usuario"


class ChamadoPermission(BasePermission):
    """
    - Usuário pode criar (POST) e editar (PUT/PATCH) chamados, mas não excluir.
    - Técnico e admin podem tudo.
    """

    def has_permission(self, request, view):
        if request.user.is_staff or request.user.cargo == "tecnico":
            return True

        if request.user.cargo == "usuario":
            # Pode apenas listar, criar e editar (não excluir)
            return request.method in ['GET', 'POST', 'PUT', 'PATCH']
        return False
