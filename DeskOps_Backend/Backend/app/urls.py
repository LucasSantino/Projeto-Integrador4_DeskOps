from django.contrib import admin
from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()

router.register(r'users', UsersView)
router.register(r'environment', EnvironmentView)
router.register(r'ativo', AtivoView)
router.register(r'chamado', ChamadoView)
router.register(r'comentario', ComentarioView) 
router.register(r'notificate', NotificateView) 

urlpatterns = router.urls
