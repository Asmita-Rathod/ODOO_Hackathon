# SkillSwap API Documentation

## Base URL
`http://127.0.0.1:8000/api/`

## Authentication
All endpoints require authentication. Use Django's built-in authentication or session-based auth.

## Endpoints

### Skills API

#### Get All Skills
- **GET** `/api/skills/`
- **Description:** Retrieve all skills
- **Response:** List of skills with user details

#### Get My Skills
- **GET** `/api/skills/my_skills/`
- **Description:** Get skills of the current authenticated user
- **Response:** List of user's skills

#### Get Skills by Category
- **GET** `/api/skills/by_category/?category=programming`
- **Description:** Filter skills by category
- **Parameters:** `category` (optional)
- **Response:** Filtered list of skills

#### Create Skill
- **POST** `/api/skills/`
- **Description:** Create a new skill (automatically assigned to current user)
- **Body:**
```json
{
    "name": "Python Programming",
    "description": "Advanced Python development skills",
    "category": "Programming",
    "level": "advanced"
}
```

#### Get Single Skill
- **GET** `/api/skills/{id}/`
- **Description:** Get details of a specific skill

#### Update Skill
- **PUT** `/api/skills/{id}/`
- **Description:** Update a skill (only if you own it)

#### Delete Skill
- **DELETE** `/api/skills/{id}/`
- **Description:** Delete a skill (only if you own it)

### Swaps API

#### Get All Swaps
- **GET** `/api/swaps/`
- **Description:** Retrieve all swaps
- **Response:** List of swaps with full details

#### Get My Requests
- **GET** `/api/swaps/my_requests/`
- **Description:** Get swaps requested by current user
- **Response:** List of user's swap requests

#### Get My Provided Swaps
- **GET** `/api/swaps/my_provided/`
- **Description:** Get swaps where current user is provider
- **Response:** List of swaps where user is provider

#### Create Swap Request
- **POST** `/api/swaps/`
- **Description:** Create a new swap request
- **Body:**
```json
{
    "requested_skill": 1,
    "offered_skill": 2,
    "provider": 3,
    "scheduled_date": "2025-07-15T14:00:00Z",
    "notes": "I can teach you Python in exchange for JavaScript"
}
```

#### Accept Swap
- **POST** `/api/swaps/{id}/accept/`
- **Description:** Accept a pending swap request (provider only)

#### Reject Swap
- **POST** `/api/swaps/{id}/reject/`
- **Description:** Reject a pending swap request (provider only)

#### Complete Swap
- **POST** `/api/swaps/{id}/complete/`
- **Description:** Mark an accepted swap as completed

### User Profiles API

#### Get All Profiles
- **GET** `/api/profiles/`
- **Description:** Retrieve all user profiles
- **Response:** List of user profiles

#### Get My Profile
- **GET** `/api/profiles/my_profile/`
- **Description:** Get current user's profile
- **Response:** User's profile details

#### Create Profile
- **POST** `/api/profiles/`
- **Description:** Create a new profile (automatically assigned to current user)
- **Body:**
```json
{
    "bio": "I'm a passionate developer",
    "location": "New York",
    "phone": "+1234567890"
}
```

#### Update Profile
- **PUT** `/api/profiles/{id}/`
- **Description:** Update a profile (only if you own it)

### Users API

#### Get All Users
- **GET** `/api/users/`
- **Description:** Retrieve all users
- **Response:** List of users (basic info only)

#### Get Current User
- **GET** `/api/users/me/`
- **Description:** Get current authenticated user's information
- **Response:** Current user's details

## Example Usage

### Using curl

```bash
# Get all skills
curl -X GET http://127.0.0.1:8000/api/skills/

# Create a new skill (requires authentication)
curl -X POST http://127.0.0.1:8000/api/skills/ \
  -H "Content-Type: application/json" \
  -d '{"name": "JavaScript", "description": "Frontend development", "category": "Programming", "level": "intermediate"}'

# Get my skills
curl -X GET http://127.0.0.1:8000/api/skills/my_skills/

# Create a swap request
curl -X POST http://127.0.0.1:8000/api/swaps/ \
  -H "Content-Type: application/json" \
  -d '{"requested_skill": 1, "offered_skill": 2, "provider": 3, "notes": "Let\'s swap skills!"}'
```

### Using Python requests

```python
import requests

# Base URL
base_url = "http://127.0.0.1:8000/api"

# Get all skills
response = requests.get(f"{base_url}/skills/")
skills = response.json()

# Create a skill
skill_data = {
    "name": "Python Programming",
    "description": "Advanced Python skills",
    "category": "Programming",
    "level": "advanced"
}
response = requests.post(f"{base_url}/skills/", json=skill_data)
```

## Status Codes

- **200 OK:** Request successful
- **201 Created:** Resource created successfully
- **400 Bad Request:** Invalid request data
- **401 Unauthorized:** Authentication required
- **403 Forbidden:** Permission denied
- **404 Not Found:** Resource not found
- **500 Internal Server Error:** Server error

## Admin Panel

Access the Django admin panel at: `http://127.0.0.1:8000/admin/`

**Login Credentials:**
- Username: `user`
- Password: `user123` 