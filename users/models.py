from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    # Hacemos que el email sea único y obligatorio
    email = models.EmailField(unique=True)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    
    # Configuraciones para usar Email como login
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username'] # Django pide esto por defecto

    def __str__(self):
        return self.email