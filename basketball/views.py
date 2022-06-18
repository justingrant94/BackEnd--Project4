# rest_framework imports
from rest_framework.views import APIView
from rest_framework.response import Response
# status has a list of status codes we can use in our Response
from rest_framework import status
from rest_framework.exceptions import NotFound

# custom imports
from .serializers.populated import PopulatedBasketballSerializer
from .models import Basketball  #  model will be used to query the db
from .serializers.common import BasketballSerializer

# permission comes from this import.
from rest_framework.permissions import IsAuthenticatedOrReadOnly


class BasketballListView(APIView):
    permission_classes = (IsAuthenticatedOrReadOnly, )

    def get(self, _request):
        basketball = Basketball.objects.all()
        serialized_basketball = BasketballSerializer(basketball, many=True)

        print('serialized data------>', serialized_basketball.data)
        print('serialized basketball----->', serialized_basketball)
        return Response(serialized_basketball.data, status=status.HTTP_200_OK)

    def post(self, request):
        deserialized_basketball = BasketballSerializer(data=request.data)
        print('deserialized -------> ', deserialized_basketball)
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
        basketball = self.get_basketball(pk)
        print('basketball player ---->', basketball)
        serialized_basketball = PopulatedBasketballSerializer(basketball)
        return Response(serialized_basketball.data, status.HTTP_202_ACCEPTED)

    def delete(self, _request, pk):
        print('pk ----->', pk)
        print('self 0-----> ', self)

        basketball_to_delete = self.get_basketball(pk)
        basketball_to_delete.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def put(self, request, pk):
        basketball_to_update = self.get_basketball(pk=pk)
        print(type(basketball_to_update))
        deserialized_basketball = BasketballSerializer(
            basketball_to_update, request.data)
        try:
            deserialized_basketball.is_valid()
            deserialized_basketball.save()
            print("deserialized data -------> ", deserialized_basketball.data)
            return Response(deserialized_basketball.data, status.HTTP_202_ACCEPTED)
        except Exception as e:
            print(e)
            return Response({'detail': str(e)}, status.HTTP_422_UNPROCESSABLE_ENTITY)
