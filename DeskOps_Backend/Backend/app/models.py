from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from .custom_user_manager import UserCustomManager

status_ativos = [
    'Ativo',
    'Em manutenção',
    'Desativado'
]

status_chamado = [
    'Aguardando atendimento',
    'Em andamento',
    'Concluído',
    'Cancelado'
]

class Users(AbstractBaseUser, PermissionsMixin)
    name = models.CharField(max_length=150, null=False)
    email = models.EmailField(max_length=255, unique=True)
    cargo = models.CharField(max_length=50, null=False)
    cpf = models.CharField(max_length=11, null=False, blank=False, unique=True)
    dt_nascimento = models.DateField(null=False, blank=False)
    pais = models.CharField(max_length=150)
    estado = models.CharField(max_length=150)
    cidade = models.CharField(max_length=150)
    rua = models.CharField(max_length=100, null=False, blank=False)
    bairro = models.CharField(max_length=100, null=False, blank=False)
    cep = models.CharField(max_length=100, null=False, blank=False)
    numero = models.CharField(max_length=100, null=False, blank=False)
    foto_user = models.TextField(null=True, blank=True)


    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name', 'cargo', 'ativo']

    objects = UserCustomManager()

    def __str__(self):
        return self.name


class Ativo(models.Model)
    name = models.CharField(max_length=250, null=False)
    description = models.CharField(max_length=400)
    status = models.CharField(
        max_length=60,
        choices=status_ativos,
        default='Ativo'
    )

    def __str__(self):
        return self.name


class Chamado(models.Model)
    title = models.CharField(max_length=250, null=False)
    description = models.CharField(max_length=250, null=False)
    status = models.CharField(
        max_length=60,
        choices=status_chamado,
        default='Aguardando atendimento'
    )
    user_FK = models.ForeingKey(Users, related_name='chamado_usuario_FK', on_delete=models.CASCADE)