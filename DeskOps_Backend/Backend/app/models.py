from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from .custom_user_manager import CustomUserManager


class StatusAtivos(models.TextChoices):
    ATIVO = 'ATIVO'
    EM_MANUTENCAO = 'EM_MANUTENCAO'
    DESATIVADO = 'DESATIVADO'


class StatusChamado(models.TextChoices):
    AGUARDANDO_ATENDIMENTO = 'AGUARDANDO_ATENDIMENTO'
    EM_ANDAMENTO = 'EM_ANDAMENTO'
    CONCLUIDO = 'CONCLUIDO'
    CANCELADO = 'CANCELADO'


class PrioridadeChamado(models.TextChoices):
    BAIXA = 'BAIXA'
    MEDIA = 'MEDIA'
    ALTA = 'ALTA'


class Users(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ('pendente', 'Pendente'),
        ('usuario', 'Usuário'),
        ('tecnico', 'Técnico'),
    )

    name = models.CharField(max_length=150, null=False)
    email = models.EmailField(max_length=255, unique=True)    
    cpf = models.CharField(max_length=11, null=False, blank=False, unique=True)
    dt_nascimento = models.DateField(null=False, blank=False)
    endereco = models.CharField(max_length=255, null=False, blank=False)
    foto_user = models.ImageField(upload_to='perfil/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    # Campos de permissão
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='pendente')

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name', 'cargo', 'cpf', 'dt_nascimento', 'endereco']

    objects = CustomUserManager()

    def __str__(self):
        return f"{self.name} ({self.role})"


class Environment(models.Model):
    name = models.CharField(max_length=250, null=False)
    description = models.CharField(max_length=400)
    employee = models.ForeignKey(
        Users,
        related_name='environment_funcionario_FK',
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    def __str__(self):
        return self.name


class Ativo(models.Model):
    name = models.CharField(max_length=250, null=False)
    description = models.CharField(max_length=400)
    status = models.CharField(
        max_length=60,
        choices=StatusAtivos.choices,
        default=StatusAtivos.ATIVO
    )
    environment_FK = models.ForeignKey(
        Environment,
        related_name='ativo_ambiente_FK',
        on_delete=models.CASCADE
    )

    def __str__(self):
        return self.name


class Chamado(models.Model):
    title = models.CharField(max_length=250, null=False)
    description = models.CharField(max_length=250, null=False)
    categoria = models.CharField(max_length=100, blank=True, null=True)
    dt_criacao = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=60,
        choices=StatusChamado.choices,
        default=StatusChamado.AGUARDANDO_ATENDIMENTO
    )
    prioridade = models.CharField(
        max_length=60,
        choices=PrioridadeChamado.choices
    )
    creator = models.ForeignKey(
        Users,
        related_name='chamado_usuario_FK',
        on_delete=models.CASCADE
    )
    employee = models.ForeignKey(  
        Users, 
        on_delete=models.SET_NULL,
        null=True, blank=True, 
        related_name='chamados')

    asset = models.ForeignKey(
        Ativo,
        related_name='chamado_ativo_FK',
        on_delete=models.CASCADE
    )
    environment = models.ForeignKey(
        Environment,
        related_name='chamado_environment_FK',
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    update_date = models.DateTimeField(auto_now=True)
    photo = models.ImageField(upload_to='chamados/', null=True, blank=True)

    def __str__(self):
        return self.title


class Notificate(models.Model):
    title = models.CharField(max_length=50, null=False)
    description = models.CharField(max_length=500, null=False)
    dt_criacao = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(
        Users,
        related_name='notificate_usuario_FK',
        on_delete=models.CASCADE
    )
    chamado_FK = models.ForeignKey(
        Chamado,
        related_name='notificate_chamado_FK',
        on_delete=models.CASCADE
    )

    def __str__(self):
        return self.title
