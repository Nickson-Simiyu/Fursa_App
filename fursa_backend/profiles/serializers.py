from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Job, Skill, UserProfile

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name']

# Serializer for UserProfile
class UserProfileSerializer(serializers.ModelSerializer):
    skills = SkillSerializer(many=True, read_only=True)  # Fetch associated skills
    skill_ids = serializers.PrimaryKeyRelatedField(  # Allow adding skills by ID
        queryset=Skill.objects.all(),
        many=True,
        write_only=True,
        source='skills'
    )
    class Meta:
        model = UserProfile
        fields = ['id', 'name', 'bio', 'skills', 'profile_image', 'resume']

    def validate_skills(self, value):
        # Optional: Validate skill entries
        predefined_skills = ["Python", "React", "JavaScript", "Django", "Flutter"]
        for skill in value:
            if skill not in predefined_skills:
                raise serializers.ValidationError(f"{skill} is not a valid skill.")
        return value

    def update(self, instance, validated_data):
        # Save skills as a comma-separated string
        if "skills" in validated_data:
            validated_data["skills"] = ",".join(validated_data["skills"])
        return super().update(instance, validated_data)

    def to_representation(self, instance):
        # Convert the comma-separated string back to a list for the API response
        representation = super().to_representation(instance)
        representation["skills"] = instance.skills.split(",") if instance.skills else []
        return representation

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