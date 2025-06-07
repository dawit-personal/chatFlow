const express = require('express');
const cors = require('cors');

const helloRoutes = require('./api/routes/hello.routes.js');
const authRoutes = require('./api/routes/auth.routes.js');
const usersRoutes = require('./api/routes/users.routes.js');
const chatRoutes = require('./api/routes/chat.routes.js');
const app = express();


// Enable CORS before any routes
app.use(cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', // Adjust to your frontend URL
    credentials: true, // if you're sending cookies
  }));

app.use(express.json());

// Mount routes
app.use('/', helloRoutes);
app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/', chatRoutes);
module.exports = app;
