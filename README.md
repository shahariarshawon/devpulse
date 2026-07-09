# DevPulse 🚀

Internal Tech Issue & Feature Tracker

DevPulse is a collaborative backend platform designed for software teams to report bugs, suggest new features, and coordinate issue resolutions efficiently. The system provides secure authentication, role-based authorization, and complete issue management functionality.

---

## 🌐 Project Information

**Project Name:** DevPulse

**GitHub Repository:**
https://github.com/yourusername/devpulse

**Live API URL:**
https://devpulse-api.vercel.app

---

# ✨ Features

## Authentication & Authorization

- User registration with role selection
- Secure password hashing using bcrypt
- JWT-based authentication system
- Protected API endpoints
- Role-based permission management

## User Roles

### Contributor

Contributors can:

- Register an account
- Login
- Create new issues
- View all issues
- Update their own open issues

### Maintainer

Maintainers have all contributor permissions plus:

- Update any issue
- Delete any issue
- Manage issue workflow independently

---

# 🛠️ Technology Stack

## Backend

- Node.js
- TypeScript
- Express.js

## Database

- PostgreSQL
- Native PostgreSQL driver (`pg`)
- Raw SQL queries

## Security

- bcrypt password hashing
- JSON Web Token (JWT) authentication

## Deployment

- Backend: Render / Vercel / Railway
- Database: NeonDB / Supabase PostgreSQL

---

# 📁 Project Structure

```
src/
│
├── config/
│   ├── db.ts
│   └── env.ts
│
├── middleware/
│   ├── auth.middleware.ts
│   ├── error.middleware.ts
│   └── notFound.middleware.ts
│
├── modules/
│   ├── auth/
│   │   ├── auth.route.ts
│   │   ├── auth.controller.ts
│   │   └── auth.service.ts
│   │
│   └── issues/
│       ├── issue.route.ts
│       ├── issue.controller.ts
│       └── issue.service.ts
│
├── utils/
│   ├── sendResponse.ts
│   ├── AppError.ts
│   └── asyncHandler.ts
│
├── app.ts
└── server.ts
```

---

# ⚙️ Installation & Setup

## 1. Clone Repository

```bash
git clone https://github.com/yourusername/devpulse.git

cd devpulse
```

---

## 2. Install Dependencies

Using pnpm:

```bash
pnpm install
```

or npm:

```bash
npm install
```

---

## 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000

DATABASE_URL=your_postgresql_connection_url

JWT_SECRET=your_secret_key

JWT_EXPIRES_IN=7d

BCRYPT_SALT_ROUNDS=10
```

---

## 4. Setup Database

Create PostgreSQL database and execute the SQL schema.

Required tables:

- users
- issues

---

## 5. Run Development Server

```bash
pnpm dev
```

Server will start:

```
http://localhost:5000
```

---

# 🗄️ Database Schema Summary

## Users Table

| Field      | Description               |
| ---------- | ------------------------- |
| id         | Unique user identifier    |
| name       | User full name            |
| email      | Unique login email        |
| password   | Encrypted password        |
| role       | contributor or maintainer |
| created_at | Account creation time     |
| updated_at | Last update time          |

## Issues Table

| Field       | Description                 |
| ----------- | --------------------------- |
| id          | Unique issue identifier     |
| title       | Issue title                 |
| description | Detailed issue description  |
| type        | bug or feature_request      |
| status      | open, in_progress, resolved |
| reporter_id | User who created the issue  |
| created_at  | Issue creation time         |
| updated_at  | Last update time            |

---

# 🔐 Authentication Flow

1. User registers using signup API.
2. Password is encrypted using bcrypt.
3. User logs in with email and password.
4. Server validates credentials.
5. Server generates JWT token.
6. Client sends token through:

```
Authorization: <JWT_TOKEN>
```

7. Server verifies token before accessing protected resources.

---

# 📌 API Documentation

## Authentication APIs

---

## 1. Register User

### POST

```
/api/auth/signup
```

### Request Body

```json
{
  "name": "John Doe",
  "email": "john.doe@devpulse.com",
  "password": "securePassword123",
  "role": "contributor"
}
```

---

## 2. Login User

### POST

```
/api/auth/login
```

### Request Body

```json
{
  "email": "john.doe@devpulse.com",
  "password": "securePassword123"
}
```

---

# Issue APIs

---

## 3. Create Issue

### POST

```
/api/issues
```

Authentication required.

Header:

```
Authorization: <JWT_TOKEN>
```

---

## 4. Get All Issues

### GET

```
/api/issues
```

Optional Query Parameters:

```
sort=newest
sort=oldest

type=bug
type=feature_request

status=open
status=in_progress
status=resolved
```

Example:

```
/api/issues?sort=newest&type=bug
```

---

## 5. Get Single Issue

### GET

```
/api/issues/:id
```

---

## 6. Update Issue

### PATCH

```
/api/issues/:id
```

Authentication required.

Allowed fields:

- title
- description
- type

---

## 7. Delete Issue

### DELETE

```
/api/issues/:id
```

Only maintainer users can delete issues.

---

# 📦 Response Format

## Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

---

## Error Response

```json
{
  "success": false,
  "message": "Error description",
  "errors": {}
}
```

---

# 🚀 Deployment

## Environment Variables Required

```
PORT
DATABASE_URL
JWT_SECRET
JWT_EXPIRES_IN
BCRYPT_SALT_ROUNDS
```

Before submission:

- Verify all API endpoints on live server
- Check GitHub repository visibility
- Test deployment in incognito browser
- Ensure environment variables are configured correctly

---

# 👨‍💻 Development Practices

- Modular architecture
- TypeScript strict mode
- Reusable utilities
- Secure password handling
- JWT authentication
- Role-based authorization
- Raw SQL queries using PostgreSQL native driver
- No ORM or query builder used

---

# 📄 License

This project is developed as an academic assignment project.
