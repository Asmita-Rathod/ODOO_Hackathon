from django.shortcuts import render,redirect

# Create your views here.
from django.http import HttpResponse

def index(request):
    return render(request, 'index.html')

def login_view(request):
    if request.method == "POST":
        email = request.POST.get("email")
        password = request.POST.get("password")

        user = authenticate(request, username=email, password=password)
        if user is not None:
            login(request, user)
            return redirect('/')  # ✅ redirect to home page
        else:
            return render(request, 'login.html', {'error': 'Invalid credentials'})
    return render(request, 'login.html')

def profile_view(request):
    return render(request, 'profile.html')

def dashboard_view(request):
    return render(request, 'swap_dashboard.html')

def request_swap(request):
    return render(request, 'swap_form.html')

def admin_dashboard(request):
    return render(request, 'admin_dashboard.html')

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
