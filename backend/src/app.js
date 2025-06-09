const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helloRoutes = require('./api/routes/hello.routes.js');
const authRoutes = require('./api/routes/auth.routes.js');
const usersRoutes = require('./api/routes/users.routes.js');
const chatRoutes = require('./api/routes/chat.routes.js');
const app = express();

// General rate limiter (applied globally)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requests per IP
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false, // Disable older X-RateLimit headers
  message: {
    status: 429,
    error: 'Too many requests, please try again later.',
  },
});

// Stricter rate limiter for sensitive endpoints (e.g., auth, message sending)
const strictLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 20, // Max 20 requests per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    error: 'Too many requests to this endpoint, please try again later.',
  },
});


// Enable CORS before any routes
app.use(cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', 
    credentials: true, // if you're sending cookies
  }));

app.use(express.json());


// Mount routes
app.use('/', generalLimiter, helloRoutes);
app.use('/auth',strictLimiter, authRoutes);
app.use('/users',strictLimiter, usersRoutes);
app.use('/', generalLimiter, chatRoutes);
module.exports = app;
