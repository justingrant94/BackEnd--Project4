from rest_framework.views import APIView
from rest_framework.response import Response

from .serializers.populated import PopulatedTeamSerializer
from .models import Team

# Endpoint: /genres/


class TeamListView(APIView):

    def get(self, _request):
        Teams = Team.objects.all()
        serialized_teams = PopulatedTeamSerializer(teams, many=True)
        return Response(serialized_teams.data)
