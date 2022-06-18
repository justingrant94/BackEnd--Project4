from .common import TeamSerializer
from basketball.serializers.common import BasketballSerializer


class PopulatedTeamSerializer(TeamSerializer):
    basketball = TeamSerializer(many=True)
