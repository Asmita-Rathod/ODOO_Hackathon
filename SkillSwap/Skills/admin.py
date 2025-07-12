from django.contrib import admin
from .models import Skill, Swap, UserProfile

# Register your models here.

@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'level', 'user', 'created_at')
    list_filter = ('category', 'level', 'created_at')
    search_fields = ('name', 'description', 'user__username')
    date_hierarchy = 'created_at'

@admin.register(Swap)
class SwapAdmin(admin.ModelAdmin):
    list_display = ('requester', 'provider', 'skill_requested', 'skill_offered', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('requester__username', 'provider__username', 'skill_requested', 'skill_offered')
    date_hierarchy = 'created_at'

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'location', 'availability', 'rating', 'total_swaps', 'created_at')
    list_filter = ('availability', 'rating', 'total_swaps', 'created_at')
    search_fields = ('user__username', 'user__email', 'location', 'skills_offered', 'skills_wanted')
    date_hierarchy = 'created_at'
