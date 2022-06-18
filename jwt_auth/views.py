from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import PermissionDenied
# create timestamps in different formats
from datetime import datetime, timedelta
from django.conf import settings
import jwt
from rest_framework.exceptions import ValidationError

from rest_framework.permissions import IsAuthenticated

# from basketball.serializers.common import BasketballSerializer

# User profile ?
from jwt_auth.models import User

# Serializer
from .serializers.common import UserSerializer

# Model
from django.contrib.auth import get_user_model
User = get_user_model()


class RegisterView(APIView):

    def post(self, request):
        user_to_add = UserSerializer(data=request.data)
        try:
            user_to_add.is_valid(True)
            print(user_to_add.errors)
            user_to_add.save()
            return Response({'message': 'Registration Successful'}, status.HTTP_202_ACCEPTED)
        except ValidationError:
            return Response(user_to_add.errors, status.HTTP_422_UNPROCESSABLE_ENTITY)
        except Exception as e:
            print(e)
            return Response({'detail': str(e)}, status.HTTP_422_UNPROCESSABLE_ENTITY)


class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        try:
            user_to_validate = User.objects.get(email=email)
        except User.DoesNotExist:
            raise PermissionDenied('Invalid credentials')

        if not user_to_validate.check_password(password):
            raise PermissionDenied("Invalid Credentials")

        dt = datetime.now() + timedelta(hours=9)

        token = jwt.encode(
            {
                'sub': user_to_validate.id,
                'exp': int(dt.strftime('%s'))
            },
            settings.SECRET_KEY,
            algorithm='HS256'
        )

        return Response({'Message': f"Welcome Back, {user_to_validate.username}", 'token': token}, status.HTTP_202_ACCEPTED)


# Profile view
class ProfileView(APIView):
    permission_classes = (IsAuthenticated, )

    def get(self, request):
        serialized_user = UserSerializer(data=request.data)
        try:
            serialized_user.is_valid(True)
            print(serialized_user.errors)
            serialized_user.save()
            return Response({'message': 'Here is your profile!'}, status.HTTP_202_ACCEPTED)
        except ValidationError:
            return Response(serialized_user.errors, status.HTTP_422_UNPROCESSABLE_ENTITY)
