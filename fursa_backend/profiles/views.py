from rest_framework import viewsets, permissions, status
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
from django.contrib.auth.models import User
from .models import Application, Job, Skill, UserProfile
from .serializers import JobSerializer, RegisterSerializer, SkillSerializer, UserProfileSerializer, LoginSerializer, ApplicationSerializer

class SkillViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def list(self, request, *args, **kwargs):
        skills = self.get_queryset()
        serializer = self.get_serializer(skills, many=True)
        return Response(serializer.data)

class UserProfileViewSet(viewsets.ModelViewSet):
    serializer_class = UserProfileSerializer  # Correct serializer for UserProfile
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (JSONParser, MultiPartParser, FormParser)

    def get_queryset(self):
        # Return only the profile of the authenticated user
        return UserProfile.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Associate the profile with the authenticated user
        serializer.save(user=self.request.user)
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"message": "Account created successfully!"}, status=status.HTTP_201_CREATED)

        # Return detailed validation errors
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        # Use LoginSerializer to validate input
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']

            try:
                user = User.objects.get(email=email)
                if user.check_password(password):
                    # Generate JWT tokens
                    refresh = RefreshToken.for_user(user)
                    return Response({
                        "message": "Login successful!",
                        "access_token": str(refresh.access_token),
                        "refresh_token": str(refresh)
                    }, status=status.HTTP_200_OK)
            except User.DoesNotExist:
                pass

        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)


class JobListView(APIView):
    permission_classes = [AllowAny]  # Publicly accessible

    def get(self, request):
        jobs = Job.objects.all()  # Retrieve all jobs from the database
        serializer = JobSerializer(jobs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class ApplicationViewSet(viewsets.ModelViewSet):
    parser_classes = [MultiPartParser, FormParser]
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Restrict to applications of the authenticated user
        return self.queryset.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        user = request.user
        job_id = request.data.get("job")  # Get job ID from the request payload

        if not job_id:
            return Response({"error": "Job ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Fetch the job object
            job = Job.objects.get(id=job_id)

            # Check if the user has already applied for the job
            if Application.objects.filter(user=user, job=job).exists():
                return Response(
                    {"message": "You have already applied for this job."},
                    status=status.HTTP_200_OK,
                )

            # Create the application
            application = Application.objects.create(user=user, job=job)
            serializer = self.get_serializer(application)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Job.DoesNotExist:
            return Response({"error": "Job not found."}, status=status.HTTP_404_NOT_FOUND)