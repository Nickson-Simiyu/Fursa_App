from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Application, Job, Skill, UserProfile

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
        fields = ['id', 'name', 'bio', 'skills', 'skill_ids', 'profile_image']

    def validate_skills(self, value):
        # Optional: Validate skill entries
        predefined_skills = ["Python", "React", "JavaScript", "Django", "Flutter"]
        for skill in value:
            if skill not in predefined_skills:
                raise serializers.ValidationError(f"{skill} is not a valid skill.")
        return value

    def update(self, instance, validated_data):
        # Handle updating skills
        if "skills" in validated_data:
            skills = validated_data.pop('skills')
            instance.skills.set(skills)
        return super().update(instance, validated_data)


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

class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ['id', 'job', 'user', 'cover_letter', 'resume', 'applied_at']
        read_only_fields = ['user', 'applied_at']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Include nested job details
        representation['job'] = {
            'id': instance.job.id,
            'title': instance.job.title,
            'company': instance.job.company,
            'location': instance.job.location,
        }
        return representation

    def create(self, validated_data):
        # Automatically assign the authenticated user
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)