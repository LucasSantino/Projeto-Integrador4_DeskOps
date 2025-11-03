from django.contrib.auth.hashers import make_password
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from .permissions import ChamadoPermission
from .models import Users, Environment, Ativo, Chamado, Notificate
from .serializers import (
    UserSerializer,
    EnvironmentSerializer,
    AtivoSerializer,
    ChamadoSerializer,
    NotificateSerializer,
    CustomTokenObtainPairSerializer
)

# ============================================================
# AUTENTICAÇÃO E PERFIL
# ============================================================

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"detail": "Logout realizado com sucesso."}, status=status.HTTP_205_RESET_CONTENT)
        except Exception:
            return Response({"error": "Token inválido ou já expirado."}, status=status.HTTP_400_BAD_REQUEST)


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data.copy()
        data["is_active"] = False
        data["is_staff"] = False
        data["cargo"] = "aguardando"

        if "password" in data:
            data["password"] = make_password(data["password"])

        serializer = UserSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Usuário cadastrado com sucesso! Aguarde aprovação do administrador."},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def aprovar_usuario(request, pk):
    """Aprova um usuário e define seu role: usuario, tecnico ou admin"""
    try:
        user = Users.objects.get(pk=pk)
    except Users.DoesNotExist:
        return Response({"error": "Usuário não encontrado."}, status=status.HTTP_404_NOT_FOUND)

    role = request.data.get("role")
    if role not in ["usuario", "tecnico", "admin"]:
        return Response({"error": "Role inválida. Use 'usuario', 'tecnico' ou 'admin'."}, status=status.HTTP_400_BAD_REQUEST)

    user.is_active = True

    if role == "admin":
        user.is_staff = True
        user.is_superuser = True
    elif role == "tecnico":
        user.is_staff = True
        user.is_superuser = False
    else:  # usuario
        user.is_staff = False
        user.is_superuser = False

    user.role = role
    user.save()

    return Response({"message": f"Usuário '{user.name}' promovido como {role}."}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_me(request):
    user = request.user
    data = {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "cargo": user.cargo,
        "cpf": user.cpf,
        "dt_nascimento": user.dt_nascimento,
        "endereco": user.endereco,
        "foto_user": user.foto_user.url if user.foto_user else None,
        "is_active": user.is_active,
        "is_staff": user.is_staff,
        "role": user.role,
    }
    return Response(data)


@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def editar_perfil(request):
    """Atualiza perfil do usuário logado, incluindo foto"""
    user = request.user
    serializer = UserSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({
            "message": "Perfil atualizado com sucesso!",
            "user": serializer.data
        }, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ============================================================
# ENDPOINTS EXCLUSIVOS PARA ADMIN - USUÁRIOS
# ============================================================

@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def alterar_status_usuario(request, pk):
    """Permite que o admin ative ou desative um usuário"""
    try:
        user = Users.objects.get(pk=pk)
    except Users.DoesNotExist:
        return Response({"error": "Usuário não encontrado."}, status=status.HTTP_404_NOT_FOUND)

    status_usuario = request.data.get("is_active")
    if status_usuario is None:
        return Response({"error": "Informe o campo 'is_active' como True ou False."}, status=status.HTTP_400_BAD_REQUEST)

    user.is_active = bool(status_usuario)
    user.save()
    return Response({"message": f"Usuário '{user.name}' status alterado para {'ativo' if user.is_active else 'inativo'}."})


@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def alterar_role_usuario(request, pk):
    """Permite que o admin altere o grupo/role do usuário"""
    try:
        user = Users.objects.get(pk=pk)
    except Users.DoesNotExist:
        return Response({"error": "Usuário não encontrado."}, status=status.HTTP_404_NOT_FOUND)

    role = request.data.get("role")
    if role not in ["usuario", "tecnico", "admin"]:
        return Response({"error": "Role inválida. Use 'usuario', 'tecnico' ou 'admin'."}, status=status.HTTP_400_BAD_REQUEST)

    if role == "admin":
        user.is_staff = True
        user.is_superuser = True
    elif role == "tecnico":
        user.is_staff = True
        user.is_superuser = False
    else:  # usuario
        user.is_staff = False
        user.is_superuser = False

    user.role = role
    user.save()
    return Response({"message": f"Usuário '{user.name}' agora pertence ao grupo '{user.role}'."})


@api_view(['GET'])
@permission_classes([IsAdminUser])
def listar_usuarios(request):
    """Retorna todos os usuários cadastrados com filtros opcionais para admin"""
    users = Users.objects.all()

    role = request.query_params.get('role')
    is_active = request.query_params.get('is_active')
    search = request.query_params.get('search')

    if role in ["usuario", "tecnico", "admin"]:
        users = users.filter(role=role)

    if is_active is not None:
        if is_active.lower() == "true":
            users = users.filter(is_active=True)
        elif is_active.lower() == "false":
            users = users.filter(is_active=False)

    if search:
        users = users.filter(name__icontains=search) | users.filter(email__icontains=search)

    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


# ============================================================
# CRUDS PRINCIPAIS + FILTROS DE AMBIENTES
# ============================================================

class UsersView(ModelViewSet):
    queryset = Users.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]


class EnvironmentView(ModelViewSet):
    queryset = Environment.objects.all()
    serializer_class = EnvironmentSerializer
    permission_classes = [IsAuthenticated]

    # 🔹 Filtro por responsável (employee)
    @action(detail=False, methods=['get'], url_path='filter-by-employee/(?P<employee_id>[^/.]+)')
    def filter_by_employee(self, request, employee_id=None):
        ambientes = self.queryset.filter(employee__id=employee_id)
        serializer = self.get_serializer(ambientes, many=True)
        return Response(serializer.data)

    # 🔹 Filtro por nome (search)
    @action(detail=False, methods=['get'], url_path='search')
    def search(self, request):
        query = request.query_params.get('q', '')
        ambientes = self.queryset.filter(name__icontains=query)
        serializer = self.get_serializer(ambientes, many=True)
        return Response(serializer.data)


class AtivoView(ModelViewSet):
    queryset = Ativo.objects.all()
    serializer_class = AtivoSerializer
    permission_classes = [IsAuthenticated]


class ChamadoViewSet(ModelViewSet):
    queryset = Chamado.objects.all()
    serializer_class = ChamadoSerializer
    permission_classes = [IsAuthenticated, ChamadoPermission]

    def get_serializer_context(self):
        return {'request': self.request}

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            queryset = Chamado.objects.all()
        elif user.role == 'tecnico':
            queryset = Chamado.objects.filter(employee=user)
        else:
            queryset = Chamado.objects.filter(creator=user)

        status_param = self.request.query_params.get('status')
        prioridade_param = self.request.query_params.get('prioridade')
        order_param = self.request.query_params.get('order')
        search_param = self.request.query_params.get('search')
        employee_param = self.request.query_params.get('employee')

        if status_param:
            queryset = queryset.filter(status=status_param)
        if prioridade_param:
            queryset = queryset.filter(prioridade=prioridade_param)
        if search_param:
            queryset = queryset.filter(title__icontains=search_param)
        if employee_param:
            queryset = queryset.filter(employee__id=employee_param)

        if order_param == 'asc':
            queryset = queryset.order_by('dt_criacao')
        elif order_param == 'desc':
            queryset = queryset.order_by('-dt_criacao')

        return queryset


# ============================================================
# OUTROS ENDPOINTS (editar chamado, encerrar, notificações)
# ============================================================

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def editar_chamado(request, pk):
    try:
        chamado = Chamado.objects.get(pk=pk)
    except Chamado.DoesNotExist:
        return Response({"error": "Chamado não encontrado."}, status=status.HTTP_404_NOT_FOUND)

    user = request.user
    data = request.data.copy()

    if user.role == 'usuario':
        allowed_fields = ['title', 'description', 'environment', 'prioridade', 'asset', 'photo']
        if chamado.creator != user:
            return Response({"error": "Você não pode editar chamados de outros usuários."}, status=status.HTTP_403_FORBIDDEN)
        data = {k: v for k, v in data.items() if k in allowed_fields}
    elif user.role == 'tecnico':
        allowed_fields = ['status']
        if user not in chamado.employee.all():
            return Response({"error": "Você só pode atualizar chamados atribuídos a você."}, status=status.HTTP_403_FORBIDDEN)
        data = {k: v for k, v in data.items() if k in allowed_fields}

    serializer = ChamadoSerializer(chamado, data=data, partial=True, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Chamado atualizado com sucesso!", "chamado": serializer.data}, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def encerrar_chamado(request, pk):
    try:
        chamado = Chamado.objects.get(pk=pk)
    except Chamado.DoesNotExist:
        return Response({"error": "Chamado não encontrado."}, status=status.HTTP_404_NOT_FOUND)

    user = request.user
    if user.role == 'usuario' and chamado.creator != user:
        return Response({"error": "Você só pode encerrar seus próprios chamados."}, status=status.HTTP_403_FORBIDDEN)
    if user.role == 'tecnico' and user not in chamado.employee.all():
        return Response({"error": "Você só pode encerrar chamados atribuídos a você."}, status=status.HTTP_403_FORBIDDEN)

    chamado.status = 'CANCELADO'
    chamado.save()
    serializer = ChamadoSerializer(chamado, context={'request': request})
    return Response({"message": "Chamado encerrado com sucesso!", "chamado": serializer.data}, status=status.HTTP_200_OK)


class NotificateView(ModelViewSet):
    queryset = Notificate.objects.all()
    serializer_class = NotificateSerializer
    permission_classes = [IsAuthenticated]
