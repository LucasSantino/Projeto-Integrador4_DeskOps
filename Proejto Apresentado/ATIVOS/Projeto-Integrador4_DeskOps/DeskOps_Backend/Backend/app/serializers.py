from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import Users, Environment, Ativo, Chamado, Notificate 
from rest_framework import generics


class ReadWriteSerializer(object):
    read_serializer_class = None
    write_serializer_class = None

    def get_serializer_class(self):
        if self.action in ['create','update','partial_update','destroy']:
            return self.get_write_serializer_class()
        return self.get_read_serializer_class()
    
    def get_read_serializer_class(self):
        return self.read_serializer_class
    
    def get_write_serializer_class(self):
        return self.write_serializer_class
    

from rest_framework import serializers
from .models import Users

class UserSerializer(serializers.ModelSerializer):
    # campo de senha apenas para escrita
    password = serializers.CharField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = Users
        fields = [
            'id', 'name', 'email', 'cargo', 'cpf', 'dt_nascimento',
            'endereco', 'foto_user', 'is_active', 'is_staff',
            'created_at', 'role', 'password'
        ]
        read_only_fields = ['created_at']  # role NÃO precisa ser read-only se quer alterar via API

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = super().create(validated_data)
        if password:
            user.set_password(password)
            user.save()
        else:
            # se não veio senha, garante que a conta não tenha senha insegura
            user.set_unusable_password()
            user.save()
        return user

    def update(self, instance, validated_data):
        # se veio senha, aplica hash corretamente
        password = validated_data.pop('password', None)
        instance = super().update(instance, validated_data)
        if password:
            instance.set_password(password)
            instance.save()
        return instance



class EnvironmentSerializer(serializers.ModelSerializer):
    # Mostra informações do responsável (funcionário)
    employee = serializers.CharField(source='employee.name', read_only=True)
    
    class Meta:
        model = Environment
        fields = '__all__'
        

class AtivoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ativo
        fields = '__all__'
        


class ChamadoSerializer(serializers.ModelSerializer):
    environment = EnvironmentSerializer(read_only=True)  
    environment_id = serializers.PrimaryKeyRelatedField(  
        source='environment',
        queryset=Environment.objects.all(),
        write_only=True,
        required=False
    )
    asset = serializers.PrimaryKeyRelatedField(
        queryset=Ativo.objects.all(),
        required=False
    )
    photo = serializers.ImageField(required=False, allow_null=True)
    creator = UserSerializer(read_only=True)
    employee = UserSerializer(read_only=True)
    employee_id = serializers.PrimaryKeyRelatedField(
        source='employee', queryset=Users.objects.all(), write_only=True, required=False
    )
    ultima_acao = serializers.CharField(read_only=True)
    data_ultima_acao = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Chamado
        fields = '__all__'
        read_only_fields = ['creator', 'dt_criacao', 'update_date']

    def validate_status(self, value):
        mapa = {
            'aguardando': 'AGUARDANDO_ATENDIMENTO',
            'aguardando atendimento': 'AGUARDANDO_ATENDIMENTO',
            'em andamento': 'EM_ANDAMENTO',
            'concluído': 'CONCLUIDO',
            'concluido': 'CONCLUIDO',
            'cancelado': 'CANCELADO',
            'aberto': 'ABERTO',
        }
        if isinstance(value, str):
            value = mapa.get(value.lower().strip(), value)
        return value

    def update(self, instance, validated_data):
        request = self.context.get('request')
        user = request.user if request else None

        # Atualiza campos passados no request
        if 'employee' in self.initial_data:
            instance.employee_id = self.initial_data.get('employee')
        if 'status' in self.initial_data:
            instance.status = self.initial_data.get('status')

        # Atualiza demais campos automaticamente
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance  # ✅ sempre retorne a instância

    def create(self, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['creator'] = request.user
        return super().create(validated_data)


class NotificateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notificate
        fields = '__all__'
        

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = Users.USERNAME_FIELD

    def validate(self, attrs):
        data = super().validate(attrs)

        if not self.user.is_active:
            raise serializers.ValidationError("Aguardando aprovação do administrador.")

        data["user"] = {
            "id": self.user.id,
            "name": self.user.name,
            "cargo": self.user.cargo,
            "email": self.user.email,
            "foto_user": self.user.foto_user.url if self.user.foto_user else None,
        }
        return data
