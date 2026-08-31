# TaskFlow — Task Manager (MERN Stack)

A full-stack task management application built with the MERN stack (MongoDB, Express, React, Node.js) featuring JWT authentication with access/refresh token rotation.

## 📁 Project Structure

```
task-manager/
├── backend/                    # Express.js REST API
│   ├── src/
│   │   ├── config/db.js        # Mongoose connection logic
│   │   ├── models/             # Mongoose schemas (User, Task)
│   │   ├── controllers/        # Business logic (auth, tasks)
│   │   ├── routes/             # HTTP verb + path → controller wiring
│   │   ├── middlewares/        # Auth verification, error handling
│   │   ├── utils/              # ApiError class, token generation
│   │   ├── app.js              # Express app config (no listen)
│   │   └── server.js           # DB connect → start server
│   ├── .env / .env.example
│   └── package.json
│
├── frontend/                   # React (Vite) SPA
│   ├── src/
│   │   ├── api/                # Axios instance + interceptors
│   │   ├── components/
│   │   │   ├── common/         # Button, Input, Loader, Modal
│   │   │   ├── layout/         # Navbar, ProtectedLayout
│   │   │   └── tasks/          # TaskCard, TaskForm, TaskList
│   │   ├── pages/              # Login, Register, Dashboard, NotFound
│   │   ├── routes/             # AppRoutes, ProtectedRoute
│   │   ├── context/            # AuthContext (user state + token)
│   │   ├── hooks/              # useAuth, useTasks
│   │   ├── services/           # authService, taskService (API calls)
│   │   ├── App.jsx             # Root: BrowserRouter + AuthProvider
│   │   └── main.jsx            # ReactDOM render
│   ├── .env / .env.example
│   └── package.json
│
└── README.md                   # ← You are here
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18+ and **npm**
- **MongoDB** running locally or a MongoDB Atlas connection string

### 1. Clone and configure

```bash
git clone <repo-url>
cd task-manager
```

### 2. Backend setup

```bash
cd backend
cp .env.example .env        # then edit .env with your values
npm install
npm run dev                  # starts on http://localhost:5000
```

### 3. Frontend setup (separate terminal)

```bash
cd frontend
cp .env.example .env        # default points to localhost:5000
npm install
npm run dev                  # starts on http://localhost:5173
```

## 🔐 Environment Variables

### Backend (`backend/.env`)

| Variable             | Description                          | Example                                      |
| -------------------- | ------------------------------------ | -------------------------------------------- |
| `PORT`               | Server port                          | `5000`                                       |
| `MONGO_URI`          | MongoDB connection string            | `mongodb://localhost:27017/task-manager`      |
| `JWT_ACCESS_SECRET`  | Secret key for signing access JWTs   | (any strong random string)                   |
| `JWT_REFRESH_SECRET` | Secret key for signing refresh JWTs  | (different strong random string)             |
| `JWT_ACCESS_EXPIRY`  | Access token lifetime                | `15m`                                        |
| `JWT_REFRESH_EXPIRY` | Refresh token lifetime               | `7d`                                         |
| `CLIENT_URL`         | Frontend origin (for CORS)           | `http://localhost:5173`                       |

### Frontend (`frontend/.env`)

| Variable             | Description          | Example                          |
| -------------------- | -------------------- | -------------------------------- |
| `VITE_API_BASE_URL`  | Backend API base URL | `http://localhost:5000/api`      |

## 🔑 JWT Access/Refresh Token Flow

```
┌─────────┐                      ┌─────────┐                    ┌──────────┐
│  Client  │                      │  Server  │                    │ MongoDB  │
└────┬─────┘                      └────┬─────┘                    └────┬─────┘
     │  POST /api/auth/login           │                               │
     │  { email, password }            │                               │
     │ ───────────────────────────────>│                               │
     │                                 │  Verify credentials           │
     │                                 │ ─────────────────────────────>│
     │                                 │  Store hashed refresh token   │
     │                                 │ ─────────────────────────────>│
     │                                 │                               │
     │  200 OK                         │                               │
     │  Body: { accessToken }          │                               │
     │  Cookie: refreshToken (httpOnly)│                               │
     │ <───────────────────────────────│                               │
     │                                 │                               │
     │  GET /api/tasks                 │                               │
     │  Header: Bearer <accessToken>   │                               │
     │ ───────────────────────────────>│                               │
     │  200 OK: { tasks: [...] }       │                               │
     │ <───────────────────────────────│                               │
     │                                 │                               │
     │  GET /api/tasks  (token expired)│                               │
     │ ───────────────────────────────>│                               │
     │  401 Unauthorized               │                               │
     │ <───────────────────────────────│                               │
     │                                 │                               │
     │  POST /api/auth/refresh         │                               │
     │  Cookie: refreshToken           │                               │
     │ ───────────────────────────────>│                               │
     │                                 │  Validate + rotate token      │
     │                                 │ ─────────────────────────────>│
     │  200 OK                         │                               │
     │  Body: { new accessToken }      │                               │
     │  Cookie: new refreshToken       │                               │
     │ <───────────────────────────────│                               │
     │                                 │                               │
     │  Retry original request         │                               │
     │  Header: Bearer <newAccessToken>│                               │
     │ ───────────────────────────────>│                               │
```

### Key security details:
- **Access token** (15 min): stored in React state (memory only), sent via `Authorization: Bearer` header
- **Refresh token** (7 days): stored as an `httpOnly`, `secure`, `sameSite=strict` cookie — not accessible to JavaScript
- **Refresh tokens are hashed** (bcrypt) before being stored in MongoDB
- **Token rotation**: every refresh invalidates the old token and issues a new one
- **Reuse detection**: if a previously-used refresh token is submitted, all sessions for that user are revoked

## 📋 API Endpoints

### Auth (`/api/auth`)

| Method | Path       | Auth | Description                  |
| ------ | ---------- | ---- | ---------------------------- |
| POST   | `/register`| No   | Create account               |
| POST   | `/login`   | No   | Authenticate + get tokens    |
| POST   | `/refresh` | Cookie | Rotate refresh, get new access |
| POST   | `/logout`  | Cookie | Invalidate refresh token     |

### Tasks (`/api/tasks`) — all require `Bearer` token

| Method | Path      | Description              |
| ------ | --------- | ------------------------ |
| GET    | `/`       | List all user's tasks    |
| GET    | `/:id`    | Get single task          |
| POST   | `/`       | Create task              |
| PUT    | `/:id`    | Update task              |
| DELETE | `/:id`    | Delete task              |

## 🛠 Tech Stack

- **Frontend**: React 19 (Vite), React Router DOM v7, Axios, Context API
- **Backend**: Node.js, Express.js 4
- **Database**: MongoDB with Mongoose ODM
- **Auth**: JWT (access + refresh with rotation)
- **Styling**: Vanilla CSS with CSS custom properties (dark theme)
