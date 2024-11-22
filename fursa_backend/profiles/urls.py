from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from .views import ApplicationViewSet, JobListView, LoginView, SkillViewSet, UserProfileViewSet, RegisterView
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r'profiles', UserProfileViewSet, basename='userprofile')
router.register(r'skills', SkillViewSet, basename='skills')
router.register(r'applications', ApplicationViewSet, basename='application')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='token_obtain_pair'),
    path('jobs/', JobListView.as_view(), name='job-list'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profiles/upload/', UserProfileViewSet.as_view({'post': 'upload_profile_image'}), name='upload_profile_image'),
    path('', include(router.urls)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
