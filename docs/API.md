# Resume System API Documentation

## Base URL
```
http://localhost:3001/api
```

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "created_at": "2025-10-17T10:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### POST /auth/login
Login to existing account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### GET /auth/profile
Get authenticated user profile. **Requires authentication.**

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "created_at": "2025-10-17T10:00:00.000Z"
}
```

## Resumes

### GET /resumes
Get all resumes for authenticated user. **Requires authentication.**

**Response:**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "title": "Software Engineer Resume",
    "content": {},
    "template": "default",
    "created_at": "2025-10-17T10:00:00.000Z",
    "updated_at": "2025-10-17T11:00:00.000Z"
  }
]
```

### GET /resumes/:id
Get specific resume by ID. **Requires authentication.**

**Response:**
```json
{
  "id": 1,
  "user_id": 1,
  "title": "Software Engineer Resume",
  "content": {
    "summary": "Experienced software engineer...",
    "experience": [],
    "education": []
  },
  "template": "default",
  "created_at": "2025-10-17T10:00:00.000Z",
  "updated_at": "2025-10-17T11:00:00.000Z"
}
```

### POST /resumes
Create new resume. **Requires authentication.**

**Request Body:**
```json
{
  "title": "Software Engineer Resume",
  "content": {
    "summary": "Experienced developer...",
    "experience": [],
    "skills": []
  },
  "template": "default"
}
```

**Response:**
```json
{
  "id": 1,
  "user_id": 1,
  "title": "Software Engineer Resume",
  "content": {},
  "template": "default",
  "created_at": "2025-10-17T10:00:00.000Z"
}
```

### PUT /resumes/:id
Update existing resume. **Requires authentication.**

**Request Body:**
```json
{
  "title": "Updated Title",
  "content": {},
  "template": "modern"
}
```

### DELETE /resumes/:id
Delete resume. **Requires authentication.**

**Response:**
```json
{
  "message": "Resume deleted successfully"
}
```

## Achievements

### GET /achievements
Get all achievements for authenticated user. **Requires authentication.**

**Response:**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "type": "internship",
    "title": "Software Engineering Intern at Google",
    "description": "Worked on search algorithms",
    "start_date": "2024-06-01",
    "end_date": "2024-08-31",
    "verified": false,
    "created_at": "2025-10-17T10:00:00.000Z"
  }
]
```

### POST /achievements
Create new achievement. **Requires authentication.**

**Request Body:**
```json
{
  "type": "internship",
  "title": "Software Engineering Intern",
  "description": "Developed features for...",
  "start_date": "2024-06-01",
  "end_date": "2024-08-31"
}
```

### PUT /achievements/:id
Update achievement. **Requires authentication.**

### DELETE /achievements/:id
Delete achievement. **Requires authentication.**

## AI Services

### POST /ai/generate-summary
Generate professional summary from achievements.

**Request Body:**
```json
{
  "achievements": [
    {
      "title": "Software Engineer at Company",
      "type": "internship",
      "description": "Built scalable systems"
    }
  ]
}
```

**Response:**
```json
{
  "summary": "Accomplished professional with experience in Software Engineer at Company, Project Lead at Startup. Proven track record..."
}
```

### POST /ai/optimize-content
Optimize resume content (placeholder).

**Request Body:**
```json
{
  "content": "Resume content to optimize"
}
```

**Response:**
```json
{
  "optimizedContent": "...",
  "suggestions": []
}
```

## Error Responses

All endpoints may return error responses in this format:

```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (valid token but insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error
