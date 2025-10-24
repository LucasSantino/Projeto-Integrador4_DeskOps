from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from .serializers import *
from .models import *
from rest_framework.response import Response

class UsersView(ModelViewSet):
    queryset = Users.objects.all()
    serializer_class = UserSerializer

class EnvironmentView(ModelViewSet):
    queryset = Environment.objects.all()
    serializer_class = EnvironmentSerializer

class AtivoView(ModelViewSet):
    queryset = Ativo.objects.all()
    serializer_class = AtivoSerializer

class ChamadoView(ReadWriteSerializer, ModelViewSet):
    queryset = Chamado.objects.all()
    read_serializer_class = 
    serializer_class = ChamadoSerializer


class NotificateView(ModelViewSet):
    queryset = Notificate.objects.all()
    serializer_class = NotificateSerializer