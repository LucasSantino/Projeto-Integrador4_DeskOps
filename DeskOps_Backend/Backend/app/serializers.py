from rest_framework import serializers
from .models import *


class ReadWriteSerializer(object):
    read_serializer_class = None
    write_serializer_class = None

    def get_serializer_class(self):
        if self.action in ['create','update',
                           'partial_update','destroy']:
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
        many = True

class EnvironmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Environment
        fields = '__all__'
        many = True

class AtivoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ativo
        fields = '__all__'
        many = True


class ChamadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chamado
        fields = '__all__'
        many = True



class ChamadoReadSerializar(serializers.ModelSerializer):
    from .models import Users

    chamado_funcionario_FK = UserSerializer()
    chamado_usuario_FK = UserSerializer()
    
    class Meta:
        model = Chamado
        fields = '__all__'
        many = True



class NotificateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notificate
        fields = '__all__'
        many = True
        