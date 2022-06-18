from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import NotFound, ValidationError, PermissionDenied
from rest_framework.permissions import IsAuthenticated

from .serializers.common import CommentSerializer
from .models import Comment


class CommentListView(APIView):
    permission_classes = (IsAuthenticated, )

    def post(self, request):

        request.data['owner'] = request.user.id
        print('request------>', request.data)
        # print('request id------>', request.data.id)
        comment_to_add = CommentSerializer(data=request.data)
        try:
            comment_to_add.is_valid(True)
            comment_to_add.save()
            return Response(comment_to_add.data, status.HTTP_201_CREATED)
        except ValidationError:
            return Response(comment_to_add.errors, status.HTTP_422_UNPROCESSABLE_ENTITY)
        except Exception as e:
            print(e)
            return Response({str(e)}, status.HTTP_422_UNPROCESSABLE_ENTITY)


# Endpoint: /reviews/:id
class CommentDetailView(APIView):
    permission_classes = (IsAuthenticated, )

    def get_comment(self, pk):
        try:
            return Comment.objects.get(pk=pk)
        except Comment.DoesNotExist:
            raise NotFound("Unable to find comment")

    def delete(self, request, pk):
        comment_to_delete = self.get_comment(pk)
        print('--------->', comment_to_delete)
        if comment_to_delete.owner != request.user:
            print('this can not be deleted', comment_to_delete.owner)
            raise PermissionDenied()
        comment_to_delete.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
