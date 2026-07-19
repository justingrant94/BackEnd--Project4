from rest_framework import serializers

from ..models import GameSession


class GameSessionSerializer(serializers.ModelSerializer):
    owner_username = serializers.CharField(source='owner.username', read_only=True)

    class Meta:
        model = GameSession
        fields = '__all__'
        read_only_fields = ('owner', 'owner_username', 'created_at')

    def validate_summary(self, summary):
        if not isinstance(summary, list):
            raise serializers.ValidationError('Game summary must be a list of round results.')

        for index, round_result in enumerate(summary):
            if not isinstance(round_result, dict):
                raise serializers.ValidationError(f'Round {index + 1} must be an object.')

        return summary