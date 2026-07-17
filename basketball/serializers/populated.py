from teams.serializers.common import TeamSerializer
from comments.serializers.populated import PopulatedCommentSerializer
from .common import BasketballSerializer
from rest_framework import serializers


#  not sure why not working move on till tomorrow

# defining our populated serializer


class PopulatedBasketballSerializer(BasketballSerializer):
    comments = PopulatedCommentSerializer(many=True)
    teams = TeamSerializer(many=True)
