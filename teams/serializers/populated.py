from .common import TeamSerializer
from basketball.serializers.common import BasketballSerializer


class PopulatedTeamSerializer(TeamSerializer):
    basketball = BasketballSerializer(many=True, read_only=True)
