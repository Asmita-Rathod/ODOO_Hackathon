
// Global Variables
let currentUser = null;
let offeredSkills = [];
let wantedSkills = [];

// Authentication Functions
function checkAuthStatus() {
    const userType = localStorage.getItem('userType');
    const userName = localStorage.getItem('userName');
    
    if (userType && userName) {
        currentUser = { type: userType, name: userName };
        updateNavigation(true);
    } else {
        updateNavigation(false);
    }
}

function updateNavigation(isLoggedIn) {
    const loginLink = document.getElementById('login-link');
    const profileLink = document.getElementById('profile-link');
    const dashboardLink = document.getElementById('dashboard-link');
    const logoutBtn = document.getElementById('logout-btn');
    
    if (isLoggedIn) {
        if (loginLink) loginLink.style.display = 'none';
        if (profileLink) profileLink.style.display = 'block';
        if (dashboardLink) dashboardLink.style.display = 'block';
        if (logoutBtn) logoutBtn.style.display = 'block';
    } else {
        if (loginLink) loginLink.style.display = 'block';
        if (profileLink) profileLink.style.display = 'none';
        if (dashboardLink) dashboardLink.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'none';
    }
}

function logout() {
    localStorage.removeItem('userType');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    currentUser = null;
    window.location.href = '/';
}

// Login Functions
function showLoginForm() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('adminForm').style.display = 'none';
    
    // Update tab buttons
    const tabs = document.querySelectorAll('.tab-btn');
    tabs[0].classList.add('active');
    tabs[1].classList.remove('active');
}

function showAdminForm() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('adminForm').style.display = 'block';
    
    // Update tab buttons
    const tabs = document.querySelectorAll('.tab-btn');
    tabs[0].classList.remove('active');
    tabs[1].classList.add('active');
}

function handleUserLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Mock authentication - replace with real API call
    if (email && password) {
        localStorage.setItem('userType', 'user');
        localStorage.setItem('userName', 'John Doe');
        localStorage.setItem('userEmail', email);
        
        showSuccessMessage('Login successful!');
        setTimeout(() => {
            window.location.href = '/';
        }, 1000);
    } else {
        showErrorMessage('Please fill in all fields');
    }
}

function handleAdminLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    
    // Mock authentication - replace with real API call
    if (email && password) {
        localStorage.setItem('userType', 'admin');
        localStorage.setItem('userName', 'Admin User');
        localStorage.setItem('userEmail', email);
        
        showSuccessMessage('Admin login successful!');
        setTimeout(() => {
            window.location.href = '/admin_dashboard/';
        }, 1000);
    } else {
        showErrorMessage('Please fill in all fields');
    }
}

function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const location = document.getElementById('location').value;
    
    if (name && email && password) {
        // Mock registration - replace with real API call
        showSuccessMessage('Account created successfully! Please login.');
        closeRegisterModal();
    } else {
        showErrorMessage('Please fill in all required fields');
    }
}

function showRegisterForm() {
    document.getElementById('registerModal').classList.add('show');
}

function closeRegisterModal() {
    document.getElementById('registerModal').classList.remove('show');
}

function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const type = field.getAttribute('type') === 'password' ? 'text' : 'password';
    field.setAttribute('type', type);
}

// Profile Functions
function loadUserProfile() {
    // Mock profile data - replace with real API call
    const mockProfile = {
        fullName: 'John Doe',
        location: 'New York, NY',
        skillsOffered: ['JavaScript', 'React', 'Node.js'],
        skillsWanted: ['Python', 'Machine Learning'],
        availability: 'evenings',
        profileVisibility: true
    };
    
    // Populate form fields
    const fullNameField = document.getElementById('fullName');
    const locationField = document.getElementById('profileLocation');
    const availabilityField = document.getElementById('availability');
    const visibilityField = document.getElementById('profileVisibility');
    
    if (fullNameField) fullNameField.value = mockProfile.fullName || '';
    if (locationField) locationField.value = mockProfile.location || '';
    if (availabilityField) availabilityField.value = mockProfile.availability || 'flexible';
    if (visibilityField) visibilityField.checked = mockProfile.profileVisibility;
    
    // Load skills
    offeredSkills = [...(mockProfile.skillsOffered || [])];
    wantedSkills = [...(mockProfile.skillsWanted || [])];
    updateSkillsTags();
}

function initializeSkillsInput() {
    const offeredInput = document.getElementById('skillsOfferedInput');
    const wantedInput = document.getElementById('skillsWantedInput');
    
    if (offeredInput) {
        offeredInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                addSkill(this.value.trim(), 'offered');
                this.value = '';
            }
        });
    }
    
    if (wantedInput) {
        wantedInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                addSkill(this.value.trim(), 'wanted');
                this.value = '';
            }
        });
    }
}

function addSkill(skill, type) {
    if (!skill) return;
    
    const skillsArray = type === 'offered' ? offeredSkills : wantedSkills;
    
    if (!skillsArray.includes(skill)) {
        skillsArray.push(skill);
        updateSkillsTags();
    }
}

function removeSkill(skill, type) {
    const skillsArray = type === 'offered' ? offeredSkills : wantedSkills;
    const index = skillsArray.indexOf(skill);
    
    if (index > -1) {
        skillsArray.splice(index, 1);
        updateSkillsTags();
    }
}

function updateSkillsTags() {
    updateSkillsContainer('offeredTags', offeredSkills, 'offered');
    updateSkillsContainer('wantedTags', wantedSkills, 'wanted');
}

function updateSkillsContainer(containerId, skills, type) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = skills.map(skill => `
        <span class="skill-tag ${type}">
            ${skill}
            <button type="button" class="remove-skill" onclick="removeSkill('${skill}', '${type}')">
                <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 6L18 18M6 18L18 6"/>
                </svg>
            </button>
        </span>
    `).join('');
}

function initializePhotoUpload() {
    const fileInput = document.getElementById('profilePhoto');
    const preview = document.getElementById('photoPreview');
    
    if (fileInput && preview) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    preview.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

function saveProfile(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const profileData = {
        fullName: formData.get('fullName'),
        location: formData.get('location'),
        availability: formData.get('availability'),
        profileVisibility: document.getElementById('profileVisibility').checked,
        skillsOffered: offeredSkills,
        skillsWanted: wantedSkills
    };
    
    console.log('Saving profile:', profileData);
    
    // Mock API call - replace with real API
    showSuccessMessage('Profile saved successfully!');
}

function discardChanges() {
    if (confirm('Are you sure you want to discard all changes?')) {
        loadUserProfile();
        showSuccessMessage('Changes discarded');
    }
}

// Profile Browsing Functions
function loadProfiles() {
    // Mock profile data - replace with real API call
    const mockProfiles = [
        {
            id: 1,
            name: 'Alice Johnson',
            location: 'San Francisco, CA',
            avatar: 'https://via.placeholder.com/60',
            skillsOffered: ['Python', 'Data Science', 'Machine Learning'],
            skillsWanted: ['JavaScript', 'React'],
            availability: 'evenings',
            rating: 4.8,
            reviewCount: 12
        },
        {
            id: 2,
            name: 'Bob Smith',
            location: 'New York, NY',
            avatar: 'https://via.placeholder.com/60',
            skillsOffered: ['JavaScript', 'React', 'Node.js'],
            skillsWanted: ['Python', 'Django'],
            availability: 'weekends',
            rating: 4.6,
            reviewCount: 8
        },
        {
            id: 3,
            name: 'Carol Davis',
            location: 'Austin, TX',
            avatar: 'https://via.placeholder.com/60',
            skillsOffered: ['Photoshop', 'Illustrator', 'UI Design'],
            skillsWanted: ['Web Development', 'CSS'],
            availability: 'flexible',
            rating: 4.9,
            reviewCount: 15
        }
    ];
    
    displayProfiles(mockProfiles);
    
    const resultsCount = document.getElementById('resultsCount');
    if (resultsCount) {
        resultsCount.textContent = `${mockProfiles.length} members found`;
    }
}

function displayProfiles(profiles) {
    const grid = document.getElementById('profilesGrid');
    if (!grid) return;
    
    grid.innerHTML = profiles.map(profile => `
        <div class="profile-card">
            <div class="profile-header">
                <div class="profile-avatar">
                    <img src="${profile.avatar}" alt="${profile.name}">
                </div>
                <div class="profile-info">
                    <h3>${profile.name}</h3>
                    <p class="location">${profile.location}</p>
                </div>
            </div>
            
            <div class="skills-section">
                <h4>Skills Offered</h4>
                <div class="skills-list">
                    ${profile.skillsOffered.map(skill => `<span class="skill-tag offered">${skill}</span>`).join('')}
                </div>
                
                <h4>Skills Wanted</h4>
                <div class="skills-list">
                    ${profile.skillsWanted.map(skill => `<span class="skill-tag wanted">${skill}</span>`).join('')}
                </div>
            </div>
            
            <div class="availability">
                <strong>Available:</strong> ${profile.availability}
            </div>
            
            <div class="rating">
                <div class="stars">
                    ${generateStars(profile.rating)}
                </div>
                <span class="rating-count">(${profile.reviewCount} reviews)</span>
            </div>
            
            <div class="profile-actions">
                <button class="btn btn-primary" onclick="viewProfile(${profile.id})">View Profile</button>
            </div>
        </div>
    `).join('');
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let starsHtml = '';
    
    for (let i = 0; i < fullStars; i++) {
        starsHtml += '<span class="star">★</span>';
    }
    
    if (hasHalfStar) {
        starsHtml += '<span class="star">★</span>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        starsHtml += '<span class="star empty">☆</span>';
    }
    
    return starsHtml;
}

function searchProfiles() {
    const searchTerm = document.getElementById('skillSearch').value.toLowerCase();
    console.log('Searching for:', searchTerm);
    
    // Mock search - replace with real API call
    showSuccessMessage('Search results updated');
}

function filterProfiles() {
    const filter = document.getElementById('availabilityFilter').value;
    console.log('Filtering by availability:', filter);
    
    // Mock filter - replace with real API call
    showSuccessMessage('Profiles filtered');
}

function viewProfile(profileId) {
    const userType = localStorage.getItem('userType');
    if (!userType) {
        showErrorMessage('Please login to view profiles');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return;
    }
    
    // Store profile ID and redirect
    localStorage.setItem('viewingProfileId', profileId);
    window.location.href = 'profile_detail.html';
}

// Profile Detail Functions
function loadUserDetails() {
    const profileId = localStorage.getItem('viewingProfileId') || 1;
    
    // Mock user details - replace with real API call
    const mockUser = {
        id: profileId,
        name: 'Alice Johnson',
        location: 'San Francisco, CA',
        avatar: 'https://via.placeholder.com/120',
        skillsOffered: ['Python', 'Data Science', 'Machine Learning'],
        skillsWanted: ['JavaScript', 'React'],
        availability: 'Evenings (6-10 PM)',
        rating: 4.8,
        reviewCount: 12
    };
    
    // Update page elements
    const elements = {
        userName: document.getElementById('userName'),
        userLocation: document.getElementById('userLocation'),
        userAvatar: document.getElementById('userAvatar'),
        userAvailability: document.getElementById('userAvailability'),
        ratingCount: document.getElementById('ratingCount'),
        offeredSkills: document.getElementById('offeredSkills'),
        wantedSkills: document.getElementById('wantedSkills')
    };
    
    if (elements.userName) elements.userName.textContent = mockUser.name;
    if (elements.userLocation) elements.userLocation.textContent = mockUser.location;
    if (elements.userAvatar) elements.userAvatar.src = mockUser.avatar;
    if (elements.userAvailability) elements.userAvailability.textContent = mockUser.availability;
    if (elements.ratingCount) elements.ratingCount.textContent = `(${mockUser.reviewCount} reviews)`;
    
    if (elements.offeredSkills) {
        elements.offeredSkills.innerHTML = mockUser.skillsOffered.map(skill => 
            `<span class="skill-tag offered">${skill}</span>`
        ).join('');
    }
    
    if (elements.wantedSkills) {
        elements.wantedSkills.innerHTML = mockUser.skillsWanted.map(skill => 
            `<span class="skill-tag wanted">${skill}</span>`
        ).join('');
    }
}

function requestSwap() {
    const userType = localStorage.getItem('userType');
    if (!userType) {
        showErrorMessage('Please login to request swaps');
        return;
    }
    
    const profileId = localStorage.getItem('viewingProfileId');
    localStorage.setItem('swapRequestTargetId', profileId);
    window.location.href = 'swap_form.html';
}

// Swap Form Functions
function loadSwapFormData() {
    const targetId = localStorage.getItem('swapRequestTargetId');
    
    // Mock target user data
    const mockTarget = {
        name: 'Alice Johnson',
        location: 'San Francisco, CA',
        avatar: 'https://via.placeholder.com/60',
        skillsOffered: ['Python', 'Data Science', 'Machine Learning']
    };
    
    // Mock current user skills
    const mockUserSkills = ['JavaScript', 'React', 'Node.js'];
    
    // Update recipient info
    const elements = {
        recipientName: document.getElementById('recipientName'),
        recipientLocation: document.getElementById('recipientLocation'),
        recipientAvatar: document.getElementById('recipientAvatar'),
        offeredSkill: document.getElementById('offeredSkill'),
        requestedSkill: document.getElementById('requestedSkill')
    };
    
    if (elements.recipientName) elements.recipientName.textContent = mockTarget.name;
    if (elements.recipientLocation) elements.recipientLocation.textContent = mockTarget.location;
    if (elements.recipientAvatar) elements.recipientAvatar.src = mockTarget.avatar;
    
    // Populate skill dropdowns
    if (elements.offeredSkill) {
        elements.offeredSkill.innerHTML = '<option value="">Select a skill you offer</option>' +
            mockUserSkills.map(skill => `<option value="${skill}">${skill}</option>`).join('');
    }
    
    if (elements.requestedSkill) {
        elements.requestedSkill.innerHTML = '<option value="">Select a skill they offer</option>' +
            mockTarget.skillsOffered.map(skill => `<option value="${skill}">${skill}</option>`).join('');
    }
}

function submitSwapRequest(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const requestData = {
        offeredSkill: formData.get('offeredSkill'),
        requestedSkill: formData.get('requestedSkill'),
        message: formData.get('message'),
        targetId: localStorage.getItem('swapRequestTargetId')
    };
    
    console.log('Submitting swap request:', requestData);
    
    if (!requestData.offeredSkill || !requestData.requestedSkill) {
        showErrorMessage('Please select both skills');
        return;
    }
    
    // Mock API call - replace with real API
    showSuccessMessage('Swap request sent successfully!');
    setTimeout(() => {
        window.location.href = 'swap_dashboard.html';
    }, 1500);
}

function goBack() {
    window.history.back();
}

// Swap Dashboard Functions
function loadSwapDashboard() {
    // Mock swap data - replace with real API call
    const mockSwaps = {
        received: [
            {
                id: 1,
                fromUser: 'Bob Smith',
                avatar: 'https://via.placeholder.com/60',
                offeredSkill: 'JavaScript',
                requestedSkill: 'Python',
                status: 'pending',
                date: '2024-01-15',
                message: 'Hi! I would love to learn Python from you.'
            }
        ],
        sent: [
            {
                id: 2,
                toUser: 'Alice Johnson',
                avatar: 'https://via.placeholder.com/60',
                offeredSkill: 'React',
                requestedSkill: 'Machine Learning',
                status: 'accepted',
                date: '2024-01-14',
                message: 'Looking forward to our skill exchange!'
            }
        ]
    };
    
    displaySwaps('receivedSwaps', mockSwaps.received, 'received');
    displaySwaps('sentSwaps', mockSwaps.sent, 'sent');
    
    // Update counts
    const receivedCount = document.getElementById('receivedCount');
    const sentCount = document.getElementById('sentCount');
    
    if (receivedCount) receivedCount.textContent = mockSwaps.received.length;
    if (sentCount) sentCount.textContent = mockSwaps.sent.length;
}

function displaySwaps(containerId, swaps, type) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (swaps.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #94a3b8; padding: 2rem;">No swap requests found</p>';
        return;
    }
    
    container.innerHTML = swaps.map(swap => `
        <div class="swap-card">
            <div class="swap-header">
                <div class="profile-avatar">
                    <img src="${swap.avatar}" alt="User">
                </div>
                <div class="swap-info">
                    <h4>${type === 'received' ? swap.fromUser : swap.toUser}</h4>
                    <p>${swap.offeredSkill} ↔ ${swap.requestedSkill}</p>
                    <span class="swap-status ${swap.status}">${swap.status.toUpperCase()}</span>
                </div>
            </div>
            
            ${swap.message ? `<p class="swap-message">${swap.message}</p>` : ''}
            
            <div class="swap-actions">
                ${type === 'received' && swap.status === 'pending' ? `
                    <button class="btn btn-success" onclick="acceptSwap(${swap.id})">Accept</button>
                    <button class="btn btn-danger" onclick="rejectSwap(${swap.id})">Reject</button>
                ` : ''}
                ${swap.status === 'pending' ? `
                    <button class="btn btn-outline" onclick="deleteSwap(${swap.id})">Delete</button>
                ` : ''}
                ${swap.status === 'accepted' ? `
                    <button class="btn btn-secondary" onclick="rateSwap(${swap.id})">Rate Experience</button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function filterSwaps(status) {
    // Update active tab
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    console.log('Filtering swaps by status:', status);
    // Mock filter - replace with real API call
}

function acceptSwap(swapId) {
    console.log('Accepting swap:', swapId);
    showSuccessMessage('Swap request accepted!');
    setTimeout(() => loadSwapDashboard(), 1000);
}

function rejectSwap(swapId) {
    console.log('Rejecting swap:', swapId);
    showSuccessMessage('Swap request rejected');
    setTimeout(() => loadSwapDashboard(), 1000);
}

function deleteSwap(swapId) {
    if (confirm('Are you sure you want to delete this swap request?')) {
        console.log('Deleting swap:', swapId);
        showSuccessMessage('Swap request deleted');
        setTimeout(() => loadSwapDashboard(), 1000);
    }
}

function rateSwap(swapId) {
    document.getElementById('ratingModal').classList.add('show');
    // Store swap ID for rating
    document.getElementById('ratingModal').dataset.swapId = swapId;
}

function closeRatingModal() {
    document.getElementById('ratingModal').classList.remove('show');
}

function submitRating() {
    const rating = document.querySelector('.star-btn.active')?.dataset.rating || 0;
    const comment = document.getElementById('ratingComment').value;
    const swapId = document.getElementById('ratingModal').dataset.swapId;
    
    console.log('Submitting rating:', { swapId, rating, comment });
    
    showSuccessMessage('Rating submitted successfully!');
    closeRatingModal();
}

// Admin Functions
function checkAdminAuth() {
    const userType = localStorage.getItem('userType');
    if (userType !== 'admin') {
        window.location.href = 'login.html';
        return;
    }
}

function loadAdminStats() {
    // Mock admin statistics - replace with real API call
    const stats = {
        totalUsers: 1247,
        totalSwaps: 856,
        pendingSkills: 23,
        bannedUsers: 12
    };
    
    // Update stat displays with animation
    animateValue('totalUsers', 0, stats.totalUsers, 1000);
    animateValue('totalSwaps', 0, stats.totalSwaps, 1200);
    animateValue('pendingSkills', 0, stats.pendingSkills, 800);
    animateValue('bannedUsers', 0, stats.bannedUsers, 600);
}

function animateValue(id, start, end, duration) {
    const element = document.getElementById(id);
    if (!element) return;
    
    const startTime = performance.now();
    const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(start + (end - start) * progress);
        element.textContent = current.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    };
    
    requestAnimationFrame(animate);
}

function loadRecentActivity() {
    // Recent activity is already loaded in HTML
    console.log('Recent activity loaded');
}

function loadUsers() {
    // Mock user data for admin
    const mockUsers = [
        {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            location: 'New York, NY',
            swaps: 5,
            joinDate: '2024-01-15',
            status: 'active'
        },
        {
            id: 2,
            name: 'Jane Smith',
            email: 'jane@example.com',
            location: 'Los Angeles, CA',
            swaps: 3,
            joinDate: '2024-01-10',
            status: 'active'
        }
    ];
    
    displayUsers(mockUsers);
}

function displayUsers(users) {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = users.map(user => `
        <tr>
            <td>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <img src="https://via.placeholder.com/40" alt="${user.name}" style="width: 40px; height: 40px; border-radius: 50%;">
                    ${user.name}
                </div>
            </td>
            <td>${user.email}</td>
            <td>${user.location}</td>
            <td>${user.swaps}</td>
            <td>${user.joinDate}</td>
            <td>
                <span class="badge ${user.status === 'active' ? 'success' : 'danger'}">
                    ${user.status.toUpperCase()}
                </span>
            </td>
            <td>
                <button class="btn btn-outline" onclick="viewUser(${user.id})">View</button>
                <button class="btn ${user.status === 'active' ? 'btn-danger' : 'btn-success'}" onclick="toggleUserStatus(${user.id})">
                    ${user.status === 'active' ? 'Ban' : 'Unban'}
                </button>
            </td>
        </tr>
    `).join('');
}

function searchUsers() {
    const searchTerm = document.getElementById('userSearch').value;
    console.log('Searching users:', searchTerm);
    showSuccessMessage('User search completed');
}

function filterUsers() {
    const filter = document.getElementById('statusFilter').value;
    console.log('Filtering users by status:', filter);
    showSuccessMessage('Users filtered');
}

function viewUser(userId) {
    console.log('Viewing user:', userId);
    document.getElementById('userModal').classList.add('show');
}

function closeUserModal() {
    document.getElementById('userModal').classList.remove('show');
}

function toggleUserStatus(userId) {
    console.log('Toggling user status:', userId);
    showSuccessMessage('User status updated');
    setTimeout(() => loadUsers(), 1000);
}

// Skills Management
function loadSkills() {
    // Mock skills data
    const mockSkills = [
        {
            id: 1,
            skill: 'Advanced Python Programming',
            user: 'John Doe',
            type: 'offered',
            status: 'pending',
            submittedDate: '2024-01-15'
        },
        {
            id: 2,
            skill: 'Machine Learning Basics',
            user: 'Jane Smith',
            type: 'wanted',
            status: 'approved',
            submittedDate: '2024-01-14'
        }
    ];
    
    displaySkills(mockSkills);
}

function displaySkills(skills) {
    const container = document.getElementById('skillsGrid');
    if (!container) return;
    
    container.innerHTML = skills.map(skill => `
        <div class="skill-card">
            <h4>${skill.skill}</h4>
            <p>Submitted by: <strong>${skill.user}</strong></p>
            <p>Type: <span class="skill-tag ${skill.type}">${skill.type}</span></p>
            <p>Status: <span class="swap-status ${skill.status}">${skill.status.toUpperCase()}</span></p>
            <p>Date: ${skill.submittedDate}</p>
            
            ${skill.status === 'pending' ? `
                <div class="skill-actions" style="margin-top: 1rem;">
                    <button class="btn btn-success" onclick="approveSkill(${skill.id})">Approve</button>
                    <button class="btn btn-danger" onclick="rejectSkill(${skill.id})">Reject</button>
                </div>
            ` : ''}
        </div>
    `).join('');
}

function filterSkills(status) {
    // Update active tab
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    console.log('Filtering skills by status:', status);
    showSuccessMessage('Skills filtered');
}

function approveSkill(skillId) {
    console.log('Approving skill:', skillId);
    showSuccessMessage('Skill approved successfully');
    setTimeout(() => loadSkills(), 1000);
}

function rejectSkill(skillId) {
    document.getElementById('rejectionModal').classList.add('show');
    document.getElementById('rejectionModal').dataset.skillId = skillId;
}

function closeRejectionModal() {
    document.getElementById('rejectionModal').classList.remove('show');
}

function confirmSkillRejection() {
    const reason = document.getElementById('rejectionReason').value;
    const skillId = document.getElementById('rejectionModal').dataset.skillId;
    
    if (!reason.trim()) {
        showErrorMessage('Please provide a reason for rejection');
        return;
    }
    
    console.log('Rejecting skill:', skillId, 'Reason:', reason);
    showSuccessMessage('Skill rejected with reason provided');
    closeRejectionModal();
    setTimeout(() => loadSkills(), 1000);
}

// Swaps Management
function loadAdminSwaps() {
    // Mock swaps data for admin
    const mockSwaps = [
        {
            id: 'SW001',
            from: 'John Doe',
            to: 'Jane Smith',
            skillsExchange: 'Python ↔ JavaScript',
            date: '2024-01-15',
            status: 'pending'
        },
        {
            id: 'SW002',
            from: 'Alice Johnson',
            to: 'Bob Wilson',
            skillsExchange: 'Design ↔ Development',
            date: '2024-01-14',
            status: 'accepted'
        }
    ];
    
    displayAdminSwaps(mockSwaps);
}

function displayAdminSwaps(swaps) {
    const tbody = document.getElementById('swapsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = swaps.map(swap => `
        <tr>
            <td>${swap.id}</td>
            <td>${swap.from}</td>
            <td>${swap.to}</td>
            <td>${swap.skillsExchange}</td>
            <td>${swap.date}</td>
            <td>
                <span class="swap-status ${swap.status}">
                    ${swap.status.toUpperCase()}
                </span>
            </td>
            <td>
                <button class="btn btn-outline" onclick="viewSwap('${swap.id}')">View</button>
                <button class="btn btn-danger" onclick="cancelAdminSwap('${swap.id}')">Cancel</button>
            </td>
        </tr>
    `).join('');
}

function searchSwaps() {
    const searchTerm = document.getElementById('swapSearch').value;
    console.log('Searching swaps:', searchTerm);
    showSuccessMessage('Swap search completed');
}

function viewSwap(swapId) {
    console.log('Viewing swap:', swapId);
    document.getElementById('swapModal').classList.add('show');
}

function closeSwapModal() {
    document.getElementById('swapModal').classList.remove('show');
}

function cancelAdminSwap(swapId) {
    if (confirm('Are you sure you want to cancel this swap?')) {
        console.log('Cancelling swap:', swapId);
        showSuccessMessage('Swap cancelled by admin');
        setTimeout(() => loadAdminSwaps(), 1000);
    }
}

// Messages Management
function loadSentMessages() {
    // Mock sent messages
    const mockMessages = [
        {
            id: 1,
            subject: 'Platform Update - New Features',
            type: 'update',
            date: '2024-01-15',
            recipients: 1247
        },
        {
            id: 2,
            subject: 'Scheduled Maintenance Notice',
            type: 'maintenance',
            date: '2024-01-10',
            recipients: 1247
        }
    ];
    
    displaySentMessages(mockMessages);
}

function displaySentMessages(messages) {
    const container = document.getElementById('sentMessagesList');
    if (!container) return;
    
    container.innerHTML = messages.map(message => `
        <div class="message-item">
            <div class="message-header">
                <span class="message-subject">${message.subject}</span>
                <span class="message-date">${message.date}</span>
            </div>
            <div class="message-preview">
                Type: ${message.type} | Recipients: ${message.recipients}
            </div>
        </div>
    `).join('');
}

function sendPlatformMessage(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const messageData = {
        subject: formData.get('subject'),
        body: formData.get('body'),
        type: formData.get('messageType')
    };
    
    if (!messageData.subject.trim() || !messageData.body.trim()) {
        showErrorMessage('Please fill in all required fields');
        return;
    }
    
    console.log('Sending platform message:', messageData);
    showSuccessMessage('Message sent to all users successfully!');
    
    // Clear form
    event.target.reset();
    setTimeout(() => loadSentMessages(), 1000);
}

function previewMessage() {
    const subject = document.getElementById('messageSubject').value;
    const body = document.getElementById('messageBody').value;
    const type = document.getElementById('messageType').value;
    
    if (!subject.trim() || !body.trim()) {
        showErrorMessage('Please fill in subject and message before previewing');
        return;
    }
    
    const preview = document.getElementById('messagePreview');
    preview.innerHTML = `
        <div class="message-item">
            <div class="message-header">
                <span class="message-subject">${subject}</span>
                <span class="message-date">Today</span>
            </div>
            <div style="margin-top: 1rem; color: #f1f5f9;">
                <p><strong>Type:</strong> ${type}</p>
                <p><strong>Message:</strong></p>
                <div style="background: #0f172a; padding: 1rem; border-radius: 8px; margin-top: 0.5rem;">
                    ${body}
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('previewModal').classList.add('show');
}

function closePreviewModal() {
    document.getElementById('previewModal').classList.remove('show');
}

function sendMessageFromPreview() {
    closePreviewModal();
    document.getElementById('messageForm').dispatchEvent(new Event('submit'));
}

// Reports Management
function setDefaultDates() {
    const today = new Date();
    const oneMonthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    
    const dateFromField = document.getElementById('dateFrom');
    const dateToField = document.getElementById('dateTo');
    
    if (dateFromField) dateFromField.value = oneMonthAgo.toISOString().split('T')[0];
    if (dateToField) dateToField.value = today.toISOString().split('T')[0];
}

function downloadReport(reportType, format) {
    console.log('Downloading report:', reportType, 'Format:', format);
    showSuccessMessage(`${reportType} report (${format.toUpperCase()}) download started`);
    
    // Mock download - in real implementation, this would trigger a file download
    setTimeout(() => {
        showSuccessMessage('Report downloaded successfully');
    }, 2000);
}

function generateCustomReport(format) {
    const reportType = document.getElementById('reportType').value;
    const dateFrom = document.getElementById('dateFrom').value;
    const dateTo = document.getElementById('dateTo').value;
    const filters = document.getElementById('reportFilters').value;
    
    if (!dateFrom || !dateTo) {
        showErrorMessage('Please select both from and to dates');
        return;
    }
    
    const reportData = {
        type: reportType,
        dateFrom,
        dateTo,
        filters,
        format
    };
    
    console.log('Generating custom report:', reportData);
    showSuccessMessage(`Custom ${reportType} report (${format.toUpperCase()}) generation started`);
    
    // Mock generation - replace with real API call
    setTimeout(() => {
        showSuccessMessage('Custom report generated and downloaded successfully');
    }, 3000);
}

// Utility Functions
function showSuccessMessage(message) {
    // Create and show success message
    const messageDiv = document.createElement('div');
    messageDiv.className = 'success-message';
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #22c55e;
        color: #0f172a;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    messageDiv.textContent = message;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

function showErrorMessage(message) {
    // Create and show error message
    const messageDiv = document.createElement('div');
    messageDiv.className = 'error-message';
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #ef4444;
        color: #f1f5f9;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    messageDiv.textContent = message;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

function initializeHamburger() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
}

// Star rating functionality
document.addEventListener('DOMContentLoaded', function() {
    const starRating = document.getElementById('starRating');
    if (starRating) {
        const stars = starRating.querySelectorAll('.star-btn');
        
        stars.forEach((star, index) => {
            star.addEventListener('click', () => {
                stars.forEach(s => s.classList.remove('active'));
                for (let i = 0; i <= index; i++) {
                    stars[i].classList.add('active');
                }
            });
            
            star.addEventListener('mouseover', () => {
                stars.forEach(s => s.style.color = '#374151');
                for (let i = 0; i <= index; i++) {
                    stars[i].style.color = '#fbbf24';
                }
            });
        });
        
        starRating.addEventListener('mouseleave', () => {
            stars.forEach(star => {
                if (!star.classList.contains('active')) {
                    star.style.color = '#374151';
                }
            });
        });
    }
});

// Add CSS animation for messages
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
