from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers.populated import PopulatedTeamSerializer
from .models import Team

# Endpoint: /genres/


class TeamListView(APIView):

    def get(self, _request):
        teams = Team.objects.prefetch_related('basketball').all()
        serialized_teams = PopulatedTeamSerializer(teams, many=True)
        return Response(serialized_teams.data, status=status.HTTP_200_OK)
