# rest_framework imports
from rest_framework.views import APIView
from rest_framework.response import Response
# status has a list of status codes we can use in our Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from rest_framework.exceptions import NotFound
from django.db.models import Q
from decimal import Decimal, InvalidOperation

# custom imports
from .serializers.populated import PopulatedBasketballSerializer
from .models import Basketball  #  model will be used to query the db
from .serializers.common import BasketballSerializer

# permission comes from this import.
from rest_framework.permissions import IsAuthenticatedOrReadOnly


class BasketballPagination(PageNumberPagination):
    page_size = 24
    page_size_query_param = 'page_size'
    max_page_size = 100


class BasketballListView(APIView):
    permission_classes = (IsAuthenticatedOrReadOnly, )
    pagination_class = BasketballPagination

    def get(self, request):
        basketball = Basketball.objects.prefetch_related('teams').all()

        search = request.query_params.get('search')
        retired = request.query_params.get('retired')
        team = request.query_params.get('team')
        position = request.query_params.get('position')
        nationality = request.query_params.get('nationality')
        min_ppg = request.query_params.get('min_ppg')
        max_ppg = request.query_params.get('max_ppg')
        sort = request.query_params.get('sort')

        if search:
            basketball = basketball.filter(names__icontains=search)

        if retired in ('true', 'false'):
            basketball = basketball.filter(retired=retired == 'true')

        if team:
            team_filter = Q(teams__name__icontains=team) | Q(teams__abbreviation__iexact=team)
            if team.isdigit():
                team_filter = team_filter | Q(teams__id=int(team))
            basketball = basketball.filter(team_filter)

        if position:
            basketball = basketball.filter(position__icontains=position)

        if nationality:
            basketball = basketball.filter(nationality__icontains=nationality)

        try:
            if min_ppg:
                basketball = basketball.filter(points_per_game__gte=Decimal(min_ppg))
            if max_ppg:
                basketball = basketball.filter(points_per_game__lte=Decimal(max_ppg))
        except InvalidOperation:
            return Response({'detail': 'PPG filters must be numbers.'}, status.HTTP_400_BAD_REQUEST)

        sort_options = {
            'name': 'names',
            '-name': '-names',
            'ppg': 'points_per_game',
            '-ppg': '-points_per_game',
            'championships': 'championships',
            '-championships': '-championships',
            'mvps': 'mvps',
            '-mvps': '-mvps',
            'all_stars': 'all_star_appearances',
            '-all_stars': '-all_star_appearances',
        }

        if sort in sort_options:
            basketball = basketball.order_by(sort_options[sort])

        basketball = basketball.distinct()

        paginator = self.pagination_class()
        page = paginator.paginate_queryset(basketball, request)
        if page is not None:
            serialized_basketball = BasketballSerializer(page, many=True)
            return paginator.get_paginated_response(serialized_basketball.data)

        serialized_basketball = BasketballSerializer(basketball, many=True)
        return Response(serialized_basketball.data, status=status.HTTP_200_OK)

    def post(self, request):
        deserialized_basketball = BasketballSerializer(data=request.data)
        try:
            deserialized_basketball.is_valid()
            deserialized_basketball.save()
            return Response(deserialized_basketball.data, status.HTTP_201_CREATED)
        except Exception as e:
            print(type(e))
            print(e)
            return Response({'detail': str(e)}, status.HTTP_422_UNPROCESSABLE_ENTITY)


class BasketballDetailView(APIView):

    def get_basketball(self, pk):
        try:
            return Basketball.objects.get(pk=pk)
        except Basketball.DoesNotExist as e:
            print(e)
            raise NotFound({'detail': str(e)})

    def get(self, _request, pk):
        try:
            basketball = Basketball.objects.prefetch_related('teams', 'comments').get(pk=pk)
        except Basketball.DoesNotExist as e:
            raise NotFound({'detail': str(e)})
        serialized_basketball = PopulatedBasketballSerializer(basketball)
        return Response(serialized_basketball.data, status.HTTP_202_ACCEPTED)

    def delete(self, _request, pk):
        basketball_to_delete = self.get_basketball(pk)
        basketball_to_delete.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def put(self, request, pk):
        basketball_to_update = self.get_basketball(pk=pk)
        deserialized_basketball = BasketballSerializer(
            basketball_to_update, request.data)
        try:
            deserialized_basketball.is_valid()
            deserialized_basketball.save()
            return Response(deserialized_basketball.data, status.HTTP_202_ACCEPTED)
        except Exception as e:
            print(e)
            return Response({'detail': str(e)}, status.HTTP_422_UNPROCESSABLE_ENTITY)
