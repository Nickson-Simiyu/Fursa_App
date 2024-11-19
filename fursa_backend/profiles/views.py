from rest_framework import viewsets, permissions, status, generics
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import UserProfile
from .serializers import UserSerializer, UserProfileSerializer
from rest_framework.parsers import MultiPartParser, FormParser

class UserProfileViewSet(viewsets.ModelViewSet):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def get_queryset(self):
        # Only return the profile for the authenticated user
        return UserProfile.objects.filter(user=self.request.user)

    def partial_update(self, request, *args, **kwargs):
        # Allow users to update specific fields of their profile
        profile = self.get_object()
        serializer = self.get_serializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def upload_profile_image(self, request):
        # Endpoint for uploading a profile image
        profile = self.get_queryset().first()
        if not profile:
            return Response({"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)

        profile.profile_image = request.data.get('profileImage')
        profile.save()
        return Response({"message": "Profile image updated successfully"}, status=status.HTTP_200_OK)

class RegisterView(generics.CreateAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
