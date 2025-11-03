from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import Users, Environment, Ativo, Chamado, Notificate 


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
    

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = '__all__'
        read_only_fields = ['is_active', 'is_staff', 'role']


class EnvironmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Environment
        fields = '__all__'
        

class AtivoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ativo
        fields = '__all__'
        


class ChamadoSerializer(serializers.ModelSerializer):
    environment = serializers.PrimaryKeyRelatedField(
        queryset=Environment.objects.all(),
        write_only=True,
        required=False
    )

    asset = serializers.PrimaryKeyRelatedField(
        queryset=Ativo.objects.all(),
        required=False
    )

    class Meta:
        model = Chamado
        fields = '__all__'
        read_only_fields = ['creator', 'dt_criacao', 'update_date']

    def validate(self, attrs):
        environment = attrs.get('environment', None)
        asset = attrs.get('asset', None)

        if environment and asset:
            if asset.environment_FK != environment:
                raise serializers.ValidationError(
                    {"asset": "O ativo selecionado não pertence ao ambiente escolhido."}
                )
        self.context['environment'] = environment
        return attrs

    def update(self, instance, validated_data):
        request = self.context.get('request')
        user = request.user if request else None

        if user:
            if user.role == 'usuario':
                allowed_fields = ['title', 'descricao', 'environment', 'asset', 'imagem']
                for field in list(validated_data.keys()):
                    if field not in allowed_fields:
                        validated_data.pop(field)

            elif user.role == 'tecnico':
                # Técnico só pode alterar o status
                allowed_fields = ['status']
                for field in list(validated_data.keys()):
                    if field not in allowed_fields:
                        validated_data.pop(field)
            # Admin pode alterar todos os campos

        return super().update(instance, validated_data)

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
