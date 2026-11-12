# Notely API Documentation

Base URL: `http://localhost:5000`

All request and response bodies use JSON unless otherwise specified.

## 1. Authentication

Authentication endpoints are rate-limited.

### Register User

**POST** `/api/auth/register`

Request body:

```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "Test@12345"
}
```

Description: Creates a new user account. Passwords are hashed before being stored.

### Login User

**POST** `/api/auth/login`

Request body:

```json
{
  "email": "test@example.com",
  "password": "Test@12345"
}
```

Description: Authenticates a user and provides a JWT token for accessing protected routes.

## 2. Authentication Header

All notes endpoints require a valid JWT token.

Include the following header:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

Requests without a valid token are rejected.

## 3. Notes Management

### Get All Notes

**GET** `/api/notes`

Returns notes belonging to the authenticated user. Admin users can retrieve notes across users.

Optional query parameters:

| Parameter | Description |
|---|---|
| `search` | Search notes by title or content |
| `tag` | Filter notes by tag |
| `page` | Page number |
| `limit` | Number of notes per page (maximum 50) |

Example:

```http
GET /api/notes?search=project&tag=work&page=1&limit=10
```

Successful response:

```json
{
  "data": [],
  "page": 1,
  "total": 0,
  "pages": 0
}
```

### Create Note

**POST** `/api/notes`

Request body:

```json
{
  "title": "My First Note",
  "content": "This is my first note.",
  "tags": ["personal", "work"]
}
```

Description: Creates a note associated with the authenticated user.

### Update Note

**POST** `/api/notes/:id`

Replace `:id` with the note ID.

Request body:

```json
{
  "title": "Updated Note",
  "content": "Updated note content.",
  "tags": ["updated", "work"]
}
```

Description: Updates an existing note. Only the note owner can update it.

### Delete Note

**DELETE** `/api/notes/:id`

Replace `:id` with the note ID.

Description:
- Users can delete their own notes.
- Admin users can delete notes belonging to any user.

## 4. Note Data Structure

Each note contains:

| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Unique note identifier |
| `title` | String | Note title (3–120 characters) |
| `content` | String | Note content |
| `tags` | Array | Note tags |
| `owner` | ObjectId | Reference to the note owner |
| `createdAt` | Date | Creation timestamp |
| `updatedAt` | Date | Last update timestamp |

## 5. Validation Rules

- Title is required and must contain at least 3 characters.
- Title cannot exceed 120 characters.
- Content is required and cannot be empty.
- Tags must be provided as an array.
- A maximum of 10 tags is allowed.
- Each tag must contain up to 30 characters.

## 6. HTTP Status Codes

| Status | Meaning |
|---|---|
| 200 | Request successful |
| 201 | Resource created |
| 400 | Invalid request or validation error |
| 401 | Unauthorized or invalid authentication |
| 403 | Forbidden — insufficient permissions |
| 404 | Resource or route not found |
| 500 | Internal server error |

## 7. Security

- JWT-based authentication.
- Password hashing with bcrypt.
- Protected notes routes.
- Ownership-based authorization.
- Admin permissions for cross-user note access.
- Authentication rate limiting.
- Server-side input validation.
- Centralized error handling.

---

**Project:** Notely — MERN Notes Management Application  
**Development API:** `http://localhost:5000`
