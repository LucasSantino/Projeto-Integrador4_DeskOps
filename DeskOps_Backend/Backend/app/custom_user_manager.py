from django.contrib.auth.models import BaseUserManager
from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password, name, cpf, cargo, dt_nascimento, 
                       endereco, **extra_fields):
        
        if None in (email, password, name, cpf,cargo, dt_nascimento, 
                       endereco):
            raise ValueError('Missing required fields during user creation')
        
        extra_fields.setdefault('is_active',True)
        user = self.model(email=self.normalize_email(email), 
                          name=name, 
                          cpf=cpf, 
                          cargo=cargo, 
                          dt_nascimento=dt_nascimento, 
                          endereco=endereco, 
                          **extra_fields)
        user.set_password(password)
        user.save(using=self.db)
        return user

    def create_superuser(self, email, password, name, cpf, cargo, dt_nascimento, 
                       endereco, **extra_fields):
        
        extra_fields.setdefault('is_staff',True)
        extra_fields.setdefault('is_superuser',True)

        return self.create_user(email, password, name, cpf, cargo, dt_nascimento, 
                       endereco, **extra_fields)