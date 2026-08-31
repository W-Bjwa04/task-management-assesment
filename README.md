# TaskFlow — Task Manager (MERN Stack)

A full-stack task management application built with the MERN stack (MongoDB, Express, React, Node.js) featuring JWT authentication with access/refresh token rotation and comprehensive input validation.

## ✨ Features

- **User Authentication**: JWT-based auth with access/refresh token rotation and reuse detection
- **Task Management**: Create, read, update, delete tasks with status tracking (pending, in-progress, completed)
- **Input Validation**: Comprehensive client-side and server-side validation with instant feedback
  - Name field: letters, spaces, hyphens, apostrophes only (2-50 chars)
  - Email validation with format checking
  - Password strength requirements: 8+ chars, uppercase, lowercase, digit with strength indicator
  - Task title/description length limits with character counters
- **Secure Deletion**: Confirmation modal prevents accidental task deletion
- **Responsive UI**: Modern, professional design with dark theme
- **Protected Routes**: Dashboard and task operations require authentication
- **Error Handling**: Standardized error messages and recovery flows

## 📁 Project Structure

```
task-manager/
├── .gitignore                          # Git ignore rules (env, graphify, node_modules)
├── README.md                           # This file
├── CLAUDE.md                           # Graphify documentation
├── VALIDATION_IMPLEMENTATION.md        # Detailed validation implementation report
│
├── backend/                            # Express.js REST API
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                   # Mongoose connection logic
│   │   ├── models/
│   │   │   ├── User.js                 # User schema (name, email, password, refreshTokens)
│   │   │   └── Task.js                 # Task schema (title, description, status, owner)
│   │   ├── controllers/
│   │   │   ├── auth.controller.js      # register, login, refresh, logout logic
│   │   │   └── task.controller.js      # CRUD operations for tasks
│   │   ├── routes/
│   │   │   ├── auth.routes.js          # Auth endpoint wiring
│   │   │   └── task.routes.js          # Task endpoint wiring
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js      # JWT verification middleware
│   │   │   └── error.middleware.js     # Global error handler
│   │   ├── utils/
│   │   │   ├── ApiError.js             # Custom error class
│   │   │   ├── generateTokens.js       # Access + refresh token generation
│   │   │   └── validators.js           # Input validation rules (centralized)
│   │   ├── app.js                      # Express app configuration
│   │   └── server.js                   # Database connection + server startup
│   ├── .env.example                    # Environment variables template
│   ├── .env                            # (gitignored) Actual env values
│   ├── package.json
│   └── package-lock.json
│
├── frontend/                           # React (Vite) SPA
│   ├── src/
│   │   ├── api/
│   │   │   └── axiosInstance.js        # Axios config with token refresh interceptor
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Button.jsx          # Reusable button component
│   │   │   │   ├── Button.css
│   │   │   │   ├── Input.jsx           # Form input component
│   │   │   │   ├── Input.css
│   │   │   │   ├── Modal.jsx           # Generic modal dialog
│   │   │   │   ├── Modal.css
│   │   │   │   ├── ConfirmModal.jsx    # Confirmation dialog for destructive actions
│   │   │   │   ├── ConfirmModal.css
│   │   │   │   ├── Loader.jsx          # Spinner component
│   │   │   │   └── Loader.css
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx          # Top navigation bar
│   │   │   │   ├── Navbar.css
│   │   │   │   ├── ProtectedLayout.jsx # Layout for authenticated pages
│   │   │   │   └── ProtectedLayout.css
│   │   │   └── tasks/
│   │   │       ├── TaskCard.jsx        # Individual task display
│   │   │       ├── TaskCard.css
│   │   │       ├── TaskForm.jsx        # Create/edit task form with validation
│   │   │       ├── TaskForm.css
│   │   │       ├── TaskList.jsx        # Grid of tasks
│   │   │       └── TaskList.css
│   │   ├── pages/
│   │   │   ├── Login.jsx               # Login page with email validation
│   │   │   ├── Register.jsx            # Registration with password strength indicator
│   │   │   ├── AuthPages.css           # Shared auth styling
│   │   │   ├── Dashboard.jsx           # Main task dashboard with delete confirmation
│   │   │   ├── Dashboard.css
│   │   │   ├── NotFound.jsx            # 404 page
│   │   │   └── NotFound.css
│   │   ├── routes/
│   │   │   ├── AppRoutes.jsx           # Route definitions
│   │   │   └── ProtectedRoute.jsx      # Route guard for authenticated pages
│   │   ├── context/
│   │   │   └── AuthContext.jsx         # User state + auth methods
│   │   ├── hooks/
│   │   │   ├── useAuth.js              # Custom hook for auth context
│   │   │   └── useTasks.js             # Custom hook for task operations
│   │   ├── services/
│   │   │   ├── authService.js          # Auth API calls
│   │   │   └── taskService.js          # Task API calls
│   │   ├── utils/
│   │   │   └── validators.js           # Input validation rules (mirrors backend)
│   │   ├── App.jsx                     # Root component
│   │   ├── index.css                   # Global styles + CSS variables
│   │   └── main.jsx                    # React DOM entry point
│   ├── public/                         # Static assets
│   ├── .env.example                    # Environment variables template
│   ├── .env                            # (gitignored) Actual env values
│   ├── vite.config.js                  # Vite configuration
│   ├── package.json
│   └── package-lock.json
│
└── graphify-out/                       # (gitignored) Knowledge graph outputs
    ├── GRAPH_REPORT.md                 # Graphify analysis report
    ├── graph.json                      # Knowledge graph data
    └── cache/                          # Graphify cache files
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
cp .env.example .env        # then edit .env with your MongoDB URI and JWT secrets
npm install
npm run dev                  # starts on http://localhost:5000
```

### 3. Frontend setup (separate terminal)

```bash
cd frontend
cp .env.example .env        # default already points to localhost:5000
npm install
npm run dev                  # starts on http://localhost:5173
```

Visit `http://localhost:5173` in your browser.

## 🔐 Environment Variables

### Backend (`backend/.env`)

| Variable             | Description                          | Example                                      |
| -------------------- | ------------------------------------ | -------------------------------------------- |
| `PORT`               | Server port                          | `5000`                                       |
| `NODE_ENV`           | Environment (development/production) | `development`                                |
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
- **Automatic refresh**: axios response interceptor catches 401 errors and refreshes token before retrying request (except login/register)

## ✅ Input Validation

### Comprehensive validation on both client and server:

**Registration Form:**
- **Name**: 2-50 characters, letters/spaces/hyphens/apostrophes only (rejects digits and special chars)
- **Email**: Valid email format with normalization (lowercased)
- **Password**: 8+ characters, at least one uppercase, one lowercase, one digit
  - Live password strength indicator (weak/medium/strong) with color coding

**Login Form:**
- **Email**: Valid email format validation
- **Password**: Required field check

**Task Management:**
- **Title**: Required, 1-100 characters with character counter
- **Description**: Optional, 0-1000 characters with character counter
- **Status**: Must be one of `pending`, `in-progress`, or `completed` (enum validation)

**Deletion:**
- Confirmation modal required before any task deletion
- Prevents accidental data loss

### Implementation Details:
- Client-side validation provides instant user feedback
- Server-side validation is the source of truth (rejects bypassed requests)
- Centralized validators in `backend/src/utils/validators.js` and `frontend/src/utils/validators.js` ensure consistency
- All error messages are specific and helpful
- Form submit buttons disabled until all validations pass

For detailed validation implementation, see [VALIDATION_IMPLEMENTATION.md](VALIDATION_IMPLEMENTATION.md).

## 📋 API Endpoints

### Auth (`/api/auth`)

| Method | Path       | Auth | Request Body | Response |
| ------ | ---------- | ---- | ------------ | -------- |
| POST   | `/register`| No   | `{ name, email, password }` | `{ accessToken, user: { id, name, email } }` |
| POST   | `/login`   | No   | `{ email, password }` | `{ accessToken, user: { id, name, email } }` |
| POST   | `/refresh` | Cookie | - | `{ accessToken, user: { id, name, email } }` |
| POST   | `/logout`  | Cookie | - | `{ success: true }` |

**Validation Errors (400):**
- Invalid name format, email format, or weak password
- Detailed error messages for each validation failure

**Auth Errors (401):**
- Invalid credentials, expired/invalid tokens, user not found

**Conflict Errors (409):**
- Email already registered

### Tasks (`/api/tasks`) — all require `Bearer` access token

| Method | Path      | Request Body | Description |
| ------ | --------- | ------------ | ----------- |
| GET    | `/`       | - | List all user's tasks (sorted by creation date, newest first) |
| GET    | `/:id`    | - | Get single task by ID (owner-scoped) |
| POST   | `/`       | `{ title, description?, status }` | Create new task |
| PUT    | `/:id`    | `{ title?, description?, status? }` | Update task (partial updates supported) |
| DELETE | `/:id`    | - | Delete task (confirmation required in UI) |

**Validation Errors (400):**
- Invalid title, description, or status values
- Title must be 1-100 chars, description 0-1000 chars

**Auth Errors (401):**
- Missing or invalid access token

**Not Found Errors (404):**
- Task not found or not owned by authenticated user

## 🛠 Tech Stack

- **Frontend**: React 19 (Vite), React Router DOM v7, Axios, Context API, Vanilla CSS
- **Backend**: Node.js, Express.js 4, Mongoose ODM
- **Database**: MongoDB
- **Auth**: JWT (access + refresh with rotation)
- **Password Security**: bcryptjs for hashing
- **Validation**: Custom validators (client & server)

## 📚 Development

### Scripts

**Backend:**
```bash
npm run dev      # Start dev server with auto-reload
npm run build    # (if applicable)
npm test         # Run tests (if configured)
```

**Frontend:**
```bash
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run preview  # Preview production build locally
```

### Code Organization

- **Controllers**: Business logic and validation
- **Models**: Mongoose schemas with hooks (e.g., password hashing)
- **Middleware**: Request/response processing and error handling
- **Services**: API wrapper methods used by React components
- **Hooks**: Custom React hooks for state management and side effects
- **Context**: Global state (authentication)

## 🔒 Security Measures

✅ JWT token rotation on refresh  
✅ Refresh token reuse detection (revokes all sessions)  
✅ httpOnly, secure, sameSite cookies for refresh tokens  
✅ Comprehensive input validation (client + server)  
✅ Password hashing with bcrypt  
✅ Protected routes requiring authentication  
✅ Axios interceptor for automatic token refresh  
✅ CORS configured per environment  
✅ Error messages don't leak sensitive information  
✅ Confirmation modal for destructive operations  

## 📝 Git Configuration

The `.gitignore` file excludes:
- `node_modules/` and dependencies
- Environment variables (`.env` files)
- Graphify output and cache files (`graphify-out/`)
- Build and dist folders
- IDE and OS files
- Logs and temporary files

## 🤝 Contributing

1. Create a feature branch
2. Commit changes with clear messages
3. Push to origin and create a pull request

## 📄 License

(Add your license here)

## 🙋 Support

For issues or questions, please open an issue on GitHub.
