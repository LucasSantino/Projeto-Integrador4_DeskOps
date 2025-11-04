from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UsersView, EnvironmentView, AtivoView, ChamadoViewSet, NotificateView,
    RegisterView, aprovar_usuario, CustomTokenObtainPairView, LogoutView, get_me,
    editar_perfil, editar_chamado, encerrar_chamado,
    alterar_status_usuario, alterar_role_usuario, listar_usuarios,
    ativos_admin, ativo_admin_detalhe, alterar_status_ativo,
    dashboard_totais, dashboard_chamados_ultimo_mes
)
from rest_framework_simplejwt.views import TokenRefreshView


# Criação do router
router = DefaultRouter()

# Registrando os ViewSets
router.register(r'chamados', ChamadoViewSet, basename='chamado')
router.register(r'users', UsersView)
router.register(r'environment', EnvironmentView)
router.register(r'ativo', AtivoView)  # Inclui filtros via actions: status, environment e search
router.register(r'notificate', NotificateView)

# Definindo as URLs
urlpatterns = [
    # Registro e aprovação de usuários
    path('register/', RegisterView.as_view(), name='register'),
    path('aprovar_usuario/<int:pk>/', aprovar_usuario, name='aprovar_usuario'),

    # JWT login e refresh
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Logout
    path('logout/', LogoutView.as_view(), name='logout'),

    # Endpoint de perfil
    path('me/', get_me, name='get_me'),
    path('editar-perfil/', editar_perfil, name='editar_perfil'),

    
 # Não precisa mais dessa linha
    # path('chamados/', views.ChamadoView.as_view(), name='chamados-list')

    # Endpoints personalizados de chamado
    path('editar-chamado/<int:pk>/', editar_chamado, name='editar_chamado'),
    path('chamado/<int:pk>/encerrar/', encerrar_chamado, name='encerrar_chamado'),

    # Endpoints administrativos - usuários
    path('usuario/<int:pk>/alterar-status/', alterar_status_usuario, name='alterar_status_usuario'),
    path('usuario/<int:pk>/alterar-role/', alterar_role_usuario, name='alterar_role_usuario'),
    path('usuarios/', listar_usuarios, name='listar_usuarios'),

    # Endpoints administrativos - gestão de ativos
    path('ativos/admin/', ativos_admin, name='ativos_admin'),
    path('ativos/admin/<int:pk>/', ativo_admin_detalhe, name='ativo_admin_detalhe'),
    path('ativos/admin/<int:pk>/alterar-status/', alterar_status_ativo, name='alterar_status_ativo'),

    # Dashboard admin
    path('dashboard/totais/', dashboard_totais, name='dashboard_totais'),
    path('dashboard/chamados-ultimo-mes/', dashboard_chamados_ultimo_mes, name='dashboard_chamados_ultimo_mes'),

    # Incluindo todas as rotas do router (ViewSets)
    path('', include(router.urls)),
]
