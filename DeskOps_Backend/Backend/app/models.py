from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from .custom_user_manager import CustomUserManager

class status_ativos(models.TextChoices):
    ATIVO='ATIVO',
    EM_MANUTENCAO='EM_MANUTENCAO',
    DESATIVADO='DESATIVADO'


class status_chamado(models.TextChoices):
    AGUARDANDO_ATENDIMENTO='AGUARDANDO_ATENDIMENTO',
    EM_ANDAMENTO='EM_ANDAMENTO',
    CONCLUIDO='CONCLUIDO'
    CANCELADO='CANCELADO'


class Users(AbstractBaseUser, PermissionsMixin):
    name = models.CharField(max_length=150, null=False)
    email = models.EmailField(max_length=255, unique=True)
    cargo = models.CharField(max_length=50, null=False)
    cpf = models.CharField(max_length=11, null=False, blank=False, unique=True)
    dt_nascimento = models.DateField(null=False, blank=False)
    pais = models.CharField(max_length=150)
    estado = models.CharField(max_length=150)
    cidade = models.CharField(max_length=150)
    bairro = models.CharField(max_length=100, null=False, blank=False)
    cep = models.CharField(max_length=100, null=False, blank=False)
    rua = models.CharField(max_length=100, null=False, blank=False)
    numero = models.CharField(max_length=100, null=False, blank=False)
    foto_user = models.TextField(null=True, blank=True)


    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name', 'cargo', 'cpf', 'dt_nascimento', 'pais', 'estado', 'cidade', 'rua', 'bairro', 'cep', 'numero', 'foto_user']

    objects = CustomUserManager()

    def __str__(self):
        return self.name

class Environment(models.Model):
    name = models.CharField(max_length=250, null=False)
    description = models.CharField(max_length=400)
    employee = models.ForeignKey(Users, related_name='environment_funcionario_FK', on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.name

class Ativo(models.Model):
    name = models.CharField(max_length=250, null=False)
    description = models.CharField(max_length=400)
    status = models.CharField(
        max_length=60,
        choices=status_ativos.choices,
        default=status_ativos.ATIVO,
    )
    environment_FK = models.ForeignKey(Environment, related_name='ativo_ambiente_FK', on_delete=models.CASCADE)
    qr_code = models.CharField(max_length=250, null=True, blank=True)

    def __str__(self):
        return self.name


class Chamado(models.Model):
    title = models.CharField(max_length=250, null=False)
    description = models.CharField(max_length=250, null=False)
    dt_criacao = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=60,
        choices=status_chamado.choices,
        default=status_chamado.AGUARDANDO_ATENDIMENTO,
    )
    creator = models.ForeignKey(Users, related_name='chamado_usuario_FK', on_delete=models.CASCADE)
    employee = models.ManyToManyField(Users, related_name='chamado_funcionario_FK')
    asset = models.ForeignKey(Ativo, related_name='chamado_ativo_FK', on_delete=models.CASCADE)
    photo = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.title
    
class Comentario(models.Model):
    title = models.CharField(max_length=50, null=False)
    description = models.CharField(max_length=500, null=False)
    dt_criacao = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(Users, related_name='comentario_usuario_FK', on_delete=models.CASCADE)
    chamado_FK = models.ForeignKey(Chamado, related_name='comentario_chamado_FK', on_delete=models.CASCADE)
    horario = models.TimeField(auto_now_add=True)
    data = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.title
    

class Notificate(models.Model):
    title = models.CharField(max_length=50, null=False)
    description = models.CharField(max_length=500, null=False)
    dt_criacao = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(Users, related_name='notificate_usuario_FK', on_delete=models.CASCADE)
    chamado_FK = models.ForeignKey(Chamado, related_name='notificate_chamado_FK', on_delete=models.CASCADE)
    

    def __str__(self):
        return self.title