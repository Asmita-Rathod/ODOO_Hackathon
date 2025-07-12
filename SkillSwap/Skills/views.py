from django.shortcuts import render,redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt

# Create your views here.
from django.http import HttpResponse
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import Skill, Swap, UserProfile
from .serializers import (
    SkillSerializer, SwapSerializer, UserProfileSerializer, 
    UserSerializer, SwapCreateSerializer
)

def index(request):
    return render(request, 'index.html')

def login_view(request):
    if request.method == "POST":
        email = request.POST.get("email")
        password = request.POST.get("password")
        user = authenticate(request, username=email, password=password)
        if user is not None:
            login(request, user)
            if user.is_superuser or user.is_staff:
                return redirect('/admin/')
            else:
                return redirect('/')
        else:
            # User does not exist, show signup option
            return render(request, 'login.html', {'error': 'Invalid credentials. If you are new, please sign up.'})
    return render(request, 'login.html')

@csrf_exempt
def signup_view(request):
    if request.method == "POST":
        email = request.POST.get("email")
        password = request.POST.get("password")
        confirm_password = request.POST.get("confirm_password")
        username = email
        
        # Validate passwords match
        if password != confirm_password:
            return render(request, 'login.html', {'error': 'Passwords do not match.', 'signup': True})
        
        # Check if user already exists
        if User.objects.filter(username=username).exists():
            return render(request, 'login.html', {'error': 'User already exists. Please login.', 'signup': True})
        
        # Create user
        user = User.objects.create_user(username=username, email=email, password=password)
        
        # Create user profile
        UserProfile.objects.create(user=user)
        
        # Log in the user
        login(request, user)
        return redirect('/')
    return render(request, 'login.html', {'signup': True})

def logout_view(request):
    logout(request)
    return redirect('/')

def profile_view(request):
    if not request.user.is_authenticated:
        return redirect('/login/')
    try:
        user_profile = UserProfile.objects.get(user=request.user)
    except UserProfile.DoesNotExist:
        user_profile = UserProfile.objects.create(user=request.user)
    skills_offered_list = user_profile.skills_offered.split(',') if user_profile.skills_offered else []
    skills_wanted_list = user_profile.skills_wanted.split(',') if user_profile.skills_wanted else []
    return render(request, 'profile.html', {
        'user_profile': user_profile,
        'skills_offered_list': skills_offered_list,
        'skills_wanted_list': skills_wanted_list,
    })

def request_swap(request):
    return render(request, 'swap_form.html')

def admin_users(request):
    return render(request, 'admin_users.html')

def admin_skills(request):
    return render(request, 'admin_skills.html')

def admin_swaps(request):
    return render(request, 'admin_swaps.html')

def admin_messages(request):
    return render(request, 'admin_messages.html')

def admin_reports(request):
    return render(request, 'admin_reports.html')

class SkillViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def my_skills(self, request):
        """Get skills of the current user"""
        skills = Skill.objects.filter(user=request.user)
        serializer = self.get_serializer(skills, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_category(self, request):
        """Get skills filtered by category"""
        category = request.query_params.get('category', '')
        if category:
            skills = Skill.objects.filter(category__icontains=category)
        else:
            skills = Skill.objects.all()
        serializer = self.get_serializer(skills, many=True)
        return Response(serializer.data)

class SwapViewSet(viewsets.ModelViewSet):
    queryset = Swap.objects.all()
    serializer_class = SwapSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'create':
            return SwapCreateSerializer
        return SwapSerializer

    def perform_create(self, serializer):
        serializer.save(requester=self.request.user)

    @action(detail=False, methods=['get'])
    def my_requests(self, request):
        """Get swaps requested by current user"""
        swaps = Swap.objects.filter(requester=request.user)
        serializer = self.get_serializer(swaps, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def my_provided(self, request):
        """Get swaps where current user is provider"""
        swaps = Swap.objects.filter(provider=request.user)
        serializer = self.get_serializer(swaps, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        """Accept a swap request"""
        swap = self.get_object()
        if swap.provider == request.user and swap.status == 'pending':
            swap.status = 'accepted'
            swap.save()
            return Response({'message': 'Swap accepted successfully'})
        return Response({'error': 'Cannot accept this swap'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Reject a swap request"""
        swap = self.get_object()
        if swap.provider == request.user and swap.status == 'pending':
            swap.status = 'rejected'
            swap.save()
            return Response({'message': 'Swap rejected successfully'})
        return Response({'error': 'Cannot reject this swap'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Mark a swap as completed"""
        swap = self.get_object()
        if (swap.requester == request.user or swap.provider == request.user) and swap.status == 'accepted':
            swap.status = 'completed'
            swap.save()
            return Response({'message': 'Swap completed successfully'})
        return Response({'error': 'Cannot complete this swap'}, status=status.HTTP_400_BAD_REQUEST)

class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get', 'put', 'patch'])
    def my_profile(self, request):
        """Get or update current user's profile"""
        try:
            profile = UserProfile.objects.get(user=request.user)
        except UserProfile.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)

        if request.method in ['PUT', 'PATCH']:
            serializer = self.get_serializer(profile, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(profile)
        return Response(serializer.data)

class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user information"""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
