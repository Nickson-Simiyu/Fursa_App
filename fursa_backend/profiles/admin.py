from django.contrib import admin
from .models import Application, Job, Skill, UserProfile

class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'name', 'display_skills', 'bio')  # Replace `skills` with a custom method

    # Custom method to display skills as a comma-separated list
    def display_skills(self, obj):
        return ", ".join(skill.name for skill in obj.skills.all())
    
    display_skills.short_description = 'Skills'  # Set column header in admin table

admin.site.register(UserProfile, UserProfileAdmin)
admin.site.register(Skill)
admin.site.register(Job)
admin.site.register(Application)