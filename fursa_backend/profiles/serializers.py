from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Job, UserProfile

# Serializer for UserProfile
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['id', 'name', 'bio', 'skills', 'profile_image', 'resume']

# Serializer for User with Profile integration
class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)  # Embed profile in UserSerializer

    class Meta:
        model = User
        fields = ['username', 'password', 'email', 'profile']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # Create user and associated profile
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        UserProfile.objects.create(user=user)  # Create a blank profile for the user
        return user

# Serializer for Registering a New User
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        UserProfile.objects.create(user=user)  # Create a blank profile for the new user
        return user

    def validate_email(self, value):
        # Ensure email uniqueness
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists.")
        return value

# Serializer for Login
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = ['id', 'title', 'company', 'description', 'requirements', 'location']