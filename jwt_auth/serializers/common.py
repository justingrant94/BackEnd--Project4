from asyncore import write
from rest_framework import serializers
from django.contrib.auth import get_user_model, password_validation
from django.contrib.auth.hashers import make_password
# this error will be thrown if our password doesn't match our password_confirmation
from django.core.exceptions import ValidationError


# from basketball.serializers.common import PlayerSerializer, CommentSerializer

# from basketball.serializers.common import PlayerSerializer, CommentSerializer


User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password_confirmation = serializers.CharField(write_only=True)

    def validate(self, data):

        password = data.pop('password')
        password_confirmation = data.pop('password_confirmation')

        if password != password_confirmation:
            raise ValidationError({
                'password_confirmation': 'doesnt match'
            })

        data['password'] = make_password(password)

        return data

    class Meta:
        model = User
        fields = ('id', 'email', 'username',
                  'password', 'password_confirmation')


# class UserProfileSerializer(serializers.ModelSerializer):
#     liked_players = PlayerSerializer(many=True)
#     made_comments = CommentSerializer(many=True)

#     class Meta:
#         model = User
#         fields = ('id', 'username', 'email', 'profile_image',
#                   'liked_players', 'made_comments',)
