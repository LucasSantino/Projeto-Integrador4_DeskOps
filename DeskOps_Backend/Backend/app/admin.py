from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
 
from .models import *

class AdminUsers(UserAdmin):
    model = Users
    list_display = ['id', 'name', 'email', 'cpf']
    list_display_links = ('id', 'name', 'email',)
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions',)}),
        ('User Data', {'fields': ('name', 'cpf', 'cargo', 'dt_nascimento', 'foto_user',)}),
        ('Adress', {'fields': ('pais', 'estado', 'cidade', 'rua', 'bairro', 'cep',)}),
    )
    filter_horizontal = ('groups', 'user_permissions',)
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email','name', 'cpf', 'cargo', 'dt_nascimento', 
                       'pais', 'estado', 'cidade',
                       'bairro', 'rua', 'cep',
                       'numero', 'password1', 'password2'),
        }),
    )
    ordering = ['email']

admin.site.register(Users, AdminUsers),
admin.site.register(Environment),
admin.site.register(Ativo),
admin.site.register(Chamado),
admin.site.register(Comentario),
admin.site.register(Notificate),