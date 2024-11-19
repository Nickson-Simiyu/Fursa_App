from django.contrib import admin
from .models import UserProfile

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('name', 'bio', 'skills', 'profile_image', 'resume')
    search_fields = ('name', 'skills')
