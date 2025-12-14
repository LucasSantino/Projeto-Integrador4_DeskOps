from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UsersView, EnvironmentView, AtivoView, ChamadoViewSet, NotificateView,
    RegisterView, aprovar_usuario, CustomTokenObtainPairView, LogoutView, get_me,
    editar_perfil, editar_chamado, encerrar_chamado,
    alterar_status_usuario, alterar_role_usuario, listar_usuarios
)
from rest_framework_simplejwt.views import TokenRefreshView
from .views import MeView
from .views import UsuarioDetailView




# Criação do router
router = DefaultRouter()

# Registrando os ViewSets
router.register(r'chamados', ChamadoViewSet, basename='chamado')
router.register(r'users', UsersView)
router.register(r'environment', EnvironmentView)
router.register(r'ativo', AtivoView)
router.register(r'notificate', NotificateView)

# Definindo as URLs
urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('aprovar_usuario/<int:pk>/', aprovar_usuario, name='aprovar_usuario'),


    # JWT login e refresh
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Logout
    path('logout/', LogoutView.as_view(), name='logout'),

    # Endpoint de perfil
     path('me/', MeView.as_view(), name='me'),
  
    # Endpoints personalizados de chamado
    path('editar-chamado/<int:pk>/', editar_chamado, name='editar_chamado'),
    path('chamados/<int:pk>/encerrar/', encerrar_chamado, name='encerrar-chamado'),
    path('chamado/<int:pk>/encerrar/', encerrar_chamado, name='encerrar_chamado'),

    # Endpoints administrativos - usuários
    path('usuario/<int:pk>/alterar-status/', alterar_status_usuario, name='alterar_status_usuario'),
    path('usuario/<int:pk>/alterar-role/', alterar_role_usuario, name='alterar_role_usuario'),
    path('usuarios/', listar_usuarios, name='listar_usuarios'),
    path('usuarios/<int:pk>/', UsuarioDetailView.as_view(), name='usuario_detail'),

    # Incluindo todas as rotas do router
    path('', include(router.urls)),
]
