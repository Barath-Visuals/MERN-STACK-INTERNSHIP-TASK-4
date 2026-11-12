# Notely — MERN Notes Management Application

A full-stack notes management application built using the MERN stack. Notely allows users to securely create, view, edit, delete, search, and organize their notes with tags.

## Features

### Authentication
- User registration and login
- Password hashing using bcrypt
- JWT-based authentication
- Protected API routes
- Persistent login using localStorage
- Logout functionality

### Notes Management
- Create, view, edit, and delete notes
- Notes are associated with their respective owners
- Admin access to view and delete notes across users
- Confirmation popup before deleting notes

### Search and Organization
- Search notes by title and content
- Filter notes using tags
- Pagination for notes
- Support for multiple tags per note

### Security and Validation
- Server-side input validation
- Title length validation (3–120 characters)
- Tag validation and limits
- Ownership-based authorization
- Centralized error handling middleware
- Rate limiting on authentication routes
- Environment variables for sensitive configuration
- Configurable CORS

### User Interface
- Responsive dashboard
- New Note and Edit Note modals
- Floating user profile card
- Success and error toast notifications
- Loading states

## Technology Stack

**Frontend**
- React
- Vite
- Tailwind CSS
- Axios

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcryptjs
- express-rate-limit

## Project Structure

```text
MERN Stack Internship Task - 4/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env.example
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── service/
│   └── .env.example
│
└── README.md
```

## Installation and Setup

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd "MERN Stack Internship Task - 4"
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file using `.env.example` and configure:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

Backend runs at:

`http://localhost:5000`

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Frontend runs at:

`http://localhost:5173`

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Login a user |

### Notes

All notes endpoints require a valid JWT token.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/notes` | Retrieve notes |
| POST | `/api/notes` | Create a note |
| POST | `/api/notes/:id` | Update a note |
| DELETE | `/api/notes/:id` | Delete a note |

### Notes Query Parameters

| Parameter | Description |
|---|---|
| `search` | Search by title or content |
| `tag` | Filter by tag |
| `page` | Select page number |
| `limit` | Set notes per page |

## Database

MongoDB is used to store user and note information.

Each note contains:
- Title
- Content
- Tags
- Owner reference
- Created and updated timestamps

## Security

- Passwords are stored as hashed values.
- JWT protects authenticated routes.
- Users can only edit their own notes.
- Admins can view and delete notes across users.
- Server-side validation prevents invalid input.
- Authentication endpoints are rate-limited.

## Author

Developed as part of the MERN Stack Internship — Task 5.
