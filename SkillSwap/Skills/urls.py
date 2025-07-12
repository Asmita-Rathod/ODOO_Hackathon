from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'skills', views.SkillViewSet)
router.register(r'swaps', views.SwapViewSet)
router.register(r'profiles', views.UserProfileViewSet)
router.register(r'users', views.UserViewSet)

urlpatterns = [
    path('', views.index, name='index'),
    path('login/', views.login_view, name='login'),
    path('signup/', views.signup_view, name='signup'),
    path('logout/', views.logout_view, name='logout'),
    path('profile/', views.profile_view, name='profile'),
    path('swap-form/', views.request_swap, name='swap_form'),
    path('api/', include(router.urls)),
    path('api-auth/', include('rest_framework.urls')),
]
