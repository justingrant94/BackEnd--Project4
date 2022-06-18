# BasicAuthentication is the base class that we will inherit as our auth class, and we'll overwrite the default behaviour by using the authenticate method
import jwt
from django.conf import settings
from rest_framework.authentication import BasicAuthentication
from rest_framework.exceptions import PermissionDenied
from django.contrib.auth import get_user_model
User = get_user_model()


class JWTAuthentication(BasicAuthentication):
    def authenticate(self, request):
        header = request.headers.get('Authorization')

        if not header:
            return None

        if not header.startswith('Bearer'):
            raise PermissionDenied({'detail': 'Invalid Auth Header'})

        token = header.replace('Bearer ', '')

        try:
            payload = jwt.decode(
                token, settings.SECRET_KEY, algorithms=['HS256'])

            user = User.objects.get(pk=payload.get('sub'))
        except jwt.exceptions.InvalidTokenError:
            print('invalid tok')
            raise PermissionDenied(detail="Invalid token")
        except User.DoesNotExist:
            print('user not found')
            raise PermissionDenied(detail='User not found 😤')

        return (user, token)
