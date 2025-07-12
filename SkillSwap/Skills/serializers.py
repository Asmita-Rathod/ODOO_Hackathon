from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Skill, Swap, UserProfile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class SkillSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Skill
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at', 'rating', 'total_swaps']

class SwapSerializer(serializers.ModelSerializer):
    requester = UserSerializer(read_only=True)
    provider = UserSerializer(read_only=True)
    
    class Meta:
        model = Swap
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

class SwapCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Swap
        fields = ['skill_requested', 'skill_offered', 'description', 'preferred_time'] 