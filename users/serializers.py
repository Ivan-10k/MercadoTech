from rest_framework import serializers
from django.contrib.auth import get_user_model

# Usuario personalizado
User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'password', 'first_name', 'telefono')
        extra_kwargs = {
            'password': {'write_only': True}  # Para que la contraseña no se devuelva al leer
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            telefono=validated_data.get('telefono', '')
        )
        return user
        