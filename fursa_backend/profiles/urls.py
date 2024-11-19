from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserProfileViewSet, RegisterView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register(r'profiles', UserProfileViewSet, basename='userprofile')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profiles/upload/', UserProfileViewSet.as_view({'post': 'upload_profile_image'}), name='upload_profile_image'),
    path('', include(router.urls)),
]