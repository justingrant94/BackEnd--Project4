# from basketball.serializers.common import CommentSerializer
from django.core.validators import URLValidator
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers
from ..models import Basketball

from django.contrib.auth import get_user_model


User = get_user_model()

CAREER_VIDEO_CATEGORIES = {'career', 'interview', 'career_story'}
PLAY_VIDEO_LIMIT = 5
VALID_MEDIA_TYPES = {'image', 'video'}


class BasketballSerializer(serializers.ModelSerializer):

    def validate_media(self, media):
        if not isinstance(media, list):
            raise serializers.ValidationError('Media must be a list of image and video items.')

        validate_url = URLValidator()
        play_video_count = 0
        career_video_count = 0

        for index, item in enumerate(media):
            if not isinstance(item, dict):
                raise serializers.ValidationError(f'Media item {index + 1} must be an object.')

            media_type = item.get('type', 'video')
            if media_type not in VALID_MEDIA_TYPES:
                raise serializers.ValidationError(f'Media item {index + 1} type must be image or video.')

            source = item.get('url') or item.get('src') or item.get('embedUrl')
            if not source:
                raise serializers.ValidationError(f'Media item {index + 1} needs a url, src, or embedUrl.')

            try:
                validate_url(source)
            except DjangoValidationError as exc:
                raise serializers.ValidationError(f'Media item {index + 1} must use a valid URL.') from exc

            if media_type == 'video':
                category = item.get('category', 'play')
                if category in CAREER_VIDEO_CATEGORIES:
                    career_video_count += 1
                else:
                    play_video_count += 1

        if play_video_count > PLAY_VIDEO_LIMIT:
            raise serializers.ValidationError(f'Add up to {PLAY_VIDEO_LIMIT} play videos per player.')

        if career_video_count > 1:
            raise serializers.ValidationError('Add only one career or interview video per player.')

        return media

    class Meta:
        model = Basketball
        fields = '__all__'


# commented out
# class UserProfileSerializer(serializers.ModelSerializer):
#     liked_players = PlayerSerializer(many=True)
#     made_comments = CommentSerializer(many=True)

#     class Meta:
#         model = User
#         fields = ('id', 'username', 'email', 'profile_image',
#                   'liked_players', 'made_comments',)
