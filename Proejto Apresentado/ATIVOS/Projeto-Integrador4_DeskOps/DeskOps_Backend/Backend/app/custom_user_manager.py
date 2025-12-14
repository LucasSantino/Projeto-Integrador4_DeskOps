from django.contrib.auth.models import BaseUserManager
from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, name=None, cpf=None, cargo=None,
                    dt_nascimento=None, endereco=None, **extra_fields):
        if not email:
            raise ValueError('O campo de e-mail é obrigatório.')

        email = self.normalize_email(email)
        user = self.model(
            email=email,
            name=name,
            cpf=cpf,
            cargo=cargo,
            dt_nascimento=dt_nascimento,
            endereco=endereco,
            **extra_fields
        )

        user.set_password(password)
        user.save(using=self._db)  
        return user


    def create_superuser(self, email, password, name, cpf, cargo, dt_nascimento, 
                       endereco, **extra_fields):
        
        extra_fields.setdefault('is_staff',True)
        extra_fields.setdefault('is_superuser',True)

        return self.create_user(email, password, name, cpf, cargo, dt_nascimento, 
                       endereco, **extra_fields)