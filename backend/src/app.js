// Express app setup — middleware, routes, error handler. NO listen(), NO DB logic.
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth.routes');
const taskRoutes = require('./routes/task.routes');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

// ─── Global Middleware ───────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// ─── Routes ──────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// ─── Error Handler (must be last) ────────────────────────────────────
app.use(errorMiddleware);

module.exports = app;
