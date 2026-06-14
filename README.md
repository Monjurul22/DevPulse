# DevPulse — Issue Tracker API

A RESTful backend API for tracking software issues and feature requests. Supports role-based access control with two user types: **Contributors** and **Maintainers**.

**Live URL:** https://dev-pulse-one-phi.vercel.app
Interview Video: ** https://drive.google.com/file/d/1BxhYOGpWQZMifBK_PjalLq8E2kE_7v6J/view?usp=sharing

---

## Features

- **User Authentication** — Secure signup and login with JWT
- **Role-Based Access Control** — Separate permissions for Contributors and Maintainers
- **Issue Management** — Create, read, update, and delete issues
- **Flexible Filtering** — Filter issues by type, status, and sort order
- **Batch Reporter Fetching** — Reporter details joined efficiently on list queries
- **Secure Password Hashing** — Passwords stored with bcrypt
- **Auto DB Initialization** — Tables created on server start if not present

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Language | TypeScript |
| Framework | Express.js v5 |
| Database | PostgreSQL |
| Auth | JSON Web Token (JWT) |
| Password Hashing | bcryptjs |
| Build Tool | tsup |
| Dev Server | tsx |
| Deployment | Vercel |

---

## Local Setup

### Prerequisites

- Node.js v18+
- PostgreSQL database (local or cloud, e.g. Neon, Supabase)

### Steps

**1. Clone the repository**

```bash
git clone <your-repo-url>
cd devpulse
```

**2. Install dependencies**

```bash
npm install
```

**3. Create environment file**

Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
JWT_SECRET=your_strong_secret_key_here
JWT_EXPIRES_IN=30d
PORT=3000
```

**4. Run in development mode**

```bash
npm run dev
```

The server starts on `http://localhost:3000`. The database tables are created automatically on first run.

**5. Build for production**

```bash
npm run build
npm start
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `JWT_SECRET` | ✅ | Secret key for signing JWT tokens |
| `JWT_EXPIRES_IN` | ❌ | Token expiry duration (default: `30d`) |
| `PORT` | ❌ | Server port (default: `3000`) |

---

## API Endpoints

**Base URL:** `https://dev-pulse-one-phi.vercel.app`

Authenticated routes require the JWT token in the `authorization` header:

```
authorization: <token>
```

---

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/signup` | ❌ | Register a new user |
| `POST` | `/api/auth/login` | ❌ | Login and receive JWT token |

#### POST `/api/auth/signup`

```json
// Request Body
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123",
  "role": "contributor"        // optional — "contributor" (default) or "maintainer"
}

// 201 Response
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "contributor",
    "created_at": "2025-01-01T00:00:00.000Z",
    "updated_at": "2025-01-01T00:00:00.000Z"
  }
}
```

#### POST `/api/auth/login`

```json
// Request Body
{
  "email": "john@example.com",
  "password": "secret123"
}

// 200 Response
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "contributor"
    }
  }
}
```

---

### Issues

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/issues` | ❌ | Get all issues (with filters) |
| `GET` | `/api/issues/:id` | ❌ | Get a single issue by ID |
| `POST` | `/api/issues` | ✅ | Create a new issue |
| `PATCH` | `/api/issues/:id` | ✅ | Update an issue |
| `DELETE` | `/api/issues/:id` | ✅ Maintainer | Delete an issue |

#### GET `/api/issues`

Supports optional query parameters:

| Parameter | Values | Description |
|---|---|---|
| `sort` | `newest`, `oldest` | Sort by creation date (default: `newest`) |
| `type` | `bug`, `feature_request` | Filter by issue type |
| `status` | `open`, `in_progress`, `resolved` | Filter by issue status |

```
GET /api/issues?type=bug&status=open&sort=newest
```

```json
// 200 Response
{
  "success": true,
  "message": "Issues retrived successfully",
  "data": [
    {
      "id": 1,
      "title": "Login button not working",
      "description": "The login button does nothing on Firefox.",
      "type": "bug",
      "status": "open",
      "created_at": "2025-01-01T00:00:00.000Z",
      "updated_at": "2025-01-01T00:00:00.000Z",
      "reporter": {
        "id": 1,
        "name": "John Doe",
        "role": "contributor"
      }
    }
  ]
}
```

#### POST `/api/issues`

```json
// Request Body
{
  "title": "Login button not working on Firefox",
  "description": "The login button does nothing when clicked on Firefox v120. Works on Chrome.",
  "type": "bug"
}

// 201 Response
{
  "success": true,
  "message": "Issue created successfully",
  "data": { ...issue }
}
```

#### PATCH `/api/issues/:id`

All fields are optional. At least one must be provided.

```json
// Request Body
{
  "title": "Updated title",
  "description": "Updated description with more detail about the problem.",
  "type": "bug",
  "status": "in_progress"
}
```

**Permission rules:**

| Role | Can Update | Allowed Status Change | Own Issues Only |
|---|---|---|---|
| Contributor | `title`, `description`, `type` | ❌ | ✅ (and only when `open`) |
| Maintainer | All fields including `status` | ✅ | ❌ |

#### DELETE `/api/issues/:id`

Only users with the `maintainer` role can delete issues.

```json
// 200 Response
{
  "success": true,
  "message": "Issue deleted successfully"
}
```

---

## Database Schema

### `users` table

| Column | Type | Constraints |
|---|---|---|
| `id` | SERIAL | PRIMARY KEY |
| `name` | VARCHAR(100) | NOT NULL |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL |
| `password` | VARCHAR(255) | NOT NULL (bcrypt hashed) |
| `role` | VARCHAR(20) | `contributor` \| `maintainer`, default `contributor` |
| `created_at` | TIMESTAMP | DEFAULT NOW() |
| `updated_at` | TIMESTAMP | DEFAULT NOW() |

### `issues` table

| Column | Type | Constraints |
|---|---|---|
| `id` | SERIAL | PRIMARY KEY |
| `title` | VARCHAR(150) | NOT NULL |
| `description` | TEXT | NOT NULL |
| `type` | VARCHAR(20) | `bug` \| `feature_request` |
| `status` | VARCHAR(20) | `open` \| `in_progress` \| `resolved`, default `open` |
| `reporter_id` | INTEGER | NOT NULL, FK → `users.id` |
| `created_at` | TIMESTAMP | DEFAULT NOW() |
| `updated_at` | TIMESTAMP | DEFAULT NOW() |

> Tables are created automatically when the server starts via `initDB()`.

---

## Role Permissions Summary

| Action | Contributor | Maintainer |
|---|---|---|
| Signup / Login | ✅ | ✅ |
| View all issues | ✅ | ✅ |
| Create issue | ✅ | ✅ |
| Update own issue (when `open`) | ✅ | ✅ |
| Update any issue | ❌ | ✅ |
| Change issue status | ❌ | ✅ |
| Delete issue | ❌ | ✅ |

---

## Project Structure

```
src/
├── db/
│   └── index.ts              # PostgreSQL pool + DB initialization
├── middleware/
│   └── authenticate.ts       # JWT authentication middleware
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.interface.ts
│   │   ├── auth.router.ts
│   │   └── auth.service.ts
│   └── issues/
│       ├── issues.interface.ts
│       ├── issues.router.ts
│       ├── issues.service.ts
│       └── issuse.contiroller.ts
├── types/
│   └── express.d.ts          # Extended Express Request type
├── app.ts                    # Express app setup
└── server.ts                 # Entry point
```

---

## Error Response Format

All error responses follow this structure:

```json
{
  "success": false,
  "message": "Human-readable error message",
  "errors": "Detailed error info"
}
```

| Status Code | Meaning |
|---|---|
| `400` | Bad Request — validation failed or missing fields |
| `401` | Unauthorized — missing or invalid token |
| `403` | Forbidden — insufficient role permissions |
| `404` | Not Found — resource does not exist |
| `409` | Conflict — action not allowed on current state |
| `500` | Internal Server Error |

---

## Author

**Monjuru Ahamed**
