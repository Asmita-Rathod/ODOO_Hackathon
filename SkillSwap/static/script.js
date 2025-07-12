// Global variables
let currentUser = null;
let profiles = [];
let filteredProfiles = [];

// Authentication functions
function checkAuthStatus() {
    // Check if user is logged in via Django session
    fetch('/api/users/me/', {
        credentials: 'same-origin'
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Not authenticated');
    })
    .then(user => {
        currentUser = user;
        updateNavbar();
    })
    .catch(error => {
        currentUser = null;
        updateNavbar();
    });
}

function updateNavbar() {
    const loginLink = document.getElementById('login-link');
    const logoutBtn = document.getElementById('logout-btn');
    const profileLink = document.getElementById('profile-link');
    const swapLink = document.getElementById('swap-link');
    
    if (currentUser) {
        loginLink.style.display = 'none';
        logoutBtn.style.display = 'block';
        profileLink.style.display = 'block';
        swapLink.style.display = 'block';
        profileLink.textContent = currentUser.username;
    } else {
        loginLink.style.display = 'block';
        logoutBtn.style.display = 'none';
        profileLink.style.display = 'none';
        swapLink.style.display = 'none';
    }
}

function logout() {
    fetch('/logout/', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
        }
    })
    .then(() => {
        currentUser = null;
        updateNavbar();
        window.location.href = '/';
    })
    .catch(error => {
        console.error('Logout error:', error);
    });
}

// Profile loading and display
function loadProfiles() {
    const profilesGrid = document.getElementById('profilesGrid');
    const resultsCount = document.getElementById('resultsCount');
    
    profilesGrid.innerHTML = '<div class="loading">Loading profiles...</div>';
    
    fetch('/api/profiles/')
    .then(response => response.json())
    .then(data => {
        profiles = data;
        filteredProfiles = [...profiles];
        displayProfiles();
        updateResultsCount();
    })
    .catch(error => {
        console.error('Error loading profiles:', error);
        profilesGrid.innerHTML = '<div class="error">Error loading profiles. Please try again.</div>';
    });
}

function displayProfiles() {
    const profilesGrid = document.getElementById('profilesGrid');
    
    if (filteredProfiles.length === 0) {
        profilesGrid.innerHTML = '<div class="no-results">No profiles found matching your criteria.</div>';
        return;
    }
    
    profilesGrid.innerHTML = filteredProfiles.map(profile => `
        <div class="profile-card" onclick="viewProfile(${profile.id})">
            <div class="profile-header">
                <div class="profile-avatar">
                    <img src="${profile.photo_url || '/static/images/default-avatar.svg'}" alt="${profile.user.username}">
                </div>
                <div class="profile-info">
                    <h3>${profile.user.username}</h3>
                    <p class="location">${profile.location || 'Location not specified'}</p>
                </div>
            </div>
            
            <div class="skills-section">
                <h4>Skills Offered</h4>
                <div class="skills-list">
                    ${profile.skills_offered ? profile.skills_offered.split(',').map(skill => 
                        `<span class="skill-tag offered">${skill.trim()}</span>`
                    ).join('') : '<span class="no-skills">No skills listed</span>'}
                </div>
            </div>
            
            <div class="skills-section">
                <h4>Skills Wanted</h4>
                <div class="skills-list">
                    ${profile.skills_wanted ? profile.skills_wanted.split(',').map(skill => 
                        `<span class="skill-tag wanted">${skill.trim()}</span>`
                    ).join('') : '<span class="no-skills">No skills listed</span>'}
                </div>
            </div>
            
            <div class="availability">
                <strong>Available:</strong> ${profile.availability || 'Not specified'}
            </div>
            
            <div class="rating">
                <div class="stars">
                    ${generateStars(profile.rating || 0)}
                </div>
                <span class="rating-count">(${profile.rating_count || 0} reviews)</span>
            </div>
        </div>
    `).join('');
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let stars = '';
    for (let i = 0; i < fullStars; i++) {
        stars += '<span class="star">★</span>';
    }
    if (hasHalfStar) {
        stars += '<span class="star">☆</span>';
    }
    for (let i = 0; i < emptyStars; i++) {
        stars += '<span class="star empty">☆</span>';
    }
    return stars;
}

function updateResultsCount() {
    const resultsCount = document.getElementById('resultsCount');
    resultsCount.textContent = `${filteredProfiles.length} member${filteredProfiles.length !== 1 ? 's' : ''} found`;
}

// Search and filter functions
function searchProfiles() {
    const searchTerm = document.getElementById('skillSearch').value.toLowerCase();
    const availabilityFilter = document.getElementById('availabilityFilter').value;
    
    filteredProfiles = profiles.filter(profile => {
        const matchesSearch = !searchTerm || 
            (profile.skills_offered && profile.skills_offered.toLowerCase().includes(searchTerm)) ||
            (profile.skills_wanted && profile.skills_wanted.toLowerCase().includes(searchTerm)) ||
            profile.user.username.toLowerCase().includes(searchTerm);
        
        const matchesAvailability = !availabilityFilter || 
            (profile.availability && profile.availability.toLowerCase().includes(availabilityFilter));
        
        return matchesSearch && matchesAvailability;
    });
    
    displayProfiles();
    updateResultsCount();
}

function filterProfiles() {
    searchProfiles(); // Reuse search function for filtering
}

// Profile viewing
function viewProfile(profileId) {
    if (!currentUser) {
        alert('Please log in to view profiles');
        return;
    }
    
    window.location.href = `/profile/${profileId}/`;
}

// Form handling
function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    const toggleBtn = input.nextElementSibling;
    
    if (input.type === 'password') {
        input.type = 'text';
        toggleBtn.textContent = 'Hide';
    } else {
        input.type = 'password';
        toggleBtn.textContent = 'Show';
    }
}

function addSkillTag(inputId, tagsContainerId) {
    const input = document.getElementById(inputId);
    const tagsContainer = document.getElementById(tagsContainerId);
    const skill = input.value.trim();
    
    if (skill && !document.querySelector(`[data-skill="${skill}"]`)) {
        const tag = document.createElement('span');
        tag.className = 'skill-tag';
        tag.textContent = skill;
        tag.setAttribute('data-skill', skill);
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-skill';
        removeBtn.innerHTML = '×';
        removeBtn.onclick = () => tag.remove();
        
        tag.appendChild(removeBtn);
        tagsContainer.appendChild(tag);
        input.value = '';
    }
}

function getSkillsFromTags(containerId) {
    const tags = document.querySelectorAll(`#${containerId} .skill-tag`);
    return Array.from(tags).map(tag => tag.textContent.replace('×', '')).join(',');
}

// Photo upload handling
function handlePhotoUpload(input) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('photoPreview');
            preview.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

// Mobile navigation
function initializeHamburger() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
}

// Utility functions
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Modal functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
    }
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('show');
    }
});

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
    loadProfiles();
    initializeHamburger();
    
    // Add event listeners for search
    const searchInput = document.getElementById('skillSearch');
    if (searchInput) {
        searchInput.addEventListener('input', searchProfiles);
    }
    
    // Add event listeners for filter
    const filterSelect = document.getElementById('availabilityFilter');
    if (filterSelect) {
        filterSelect.addEventListener('change', filterProfiles);
    }
}); 