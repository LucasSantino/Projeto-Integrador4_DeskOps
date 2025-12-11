from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
 
from .models import *

class AdminUsers(UserAdmin):
    model = Users
    list_display = ['id', 'name', 'email', 'cpf', 'role']  # Adicionando 'role' no list_display
    list_display_links = ('id', 'name', 'email',)
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('User Data', {'fields': ('name', 'cpf', 'role', 'dt_nascimento', 'foto_user')}),  # Corrigido: role no lugar de cargo
        ('Adress', {'fields': ('endereco',)}),
    )
    filter_horizontal = ('groups', 'user_permissions',)
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email','name', 'cpf', 'role', 'dt_nascimento', 
                       'endereco', 'password1', 'password2'),
        }),
    )
    ordering = ['email']


admin.site.register(Users, AdminUsers),
admin.site.register(Environment),
admin.site.register(Ativo),
admin.site.register(Chamado),
admin.site.register(Notificate),