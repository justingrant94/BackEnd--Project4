# from basketball.serializers.common import CommentSerializer
from rest_framework import serializers
from ..models import Basketball

from django.contrib.auth import get_user_model


User = get_user_model()


class BasketballSerializer(serializers.ModelSerializer):

    class Meta:
        model = Basketball
        fields = '__all__'


# commented out
# class UserProfileSerializer(serializers.ModelSerializer):
#     liked_players = PlayerSerializer(many=True)
#     made_comments = CommentSerializer(many=True)

#     class Meta:
#         model = User
#         fields = ('id', 'username', 'email', 'profile_image',
#                   'liked_players', 'made_comments',)
