from django.urls import path
from . import views
from .views import index, login_view


urlpatterns = [
    path('', index, name='index'),
    path('login/', login_view, name='login'), 
    path('profile/', views.profile_view, name='profile'),
    path('dashboard/', views.dashboard_view, name='dashboard'),
    path('request/', views.request_swap, name='request_swap'),
    path('admin_dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('admin_users/', views.admin_users, name='admin_users'),
    path('admin_skills/', views.admin_skills, name='admin_skills'),
    path('admin_swaps/', views.admin_swaps, name='admin_swaps'),
    path('admin_messages/', views.admin_messages, name='admin_messages'),
    path('admin_reports/', views.admin_reports, name='admin_reports'),# example view
]
