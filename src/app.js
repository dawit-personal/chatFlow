const express = require('express');
const helloRoutes = require('./api/routes/hello.routes');
const authRoutes = require('./api/routes/auth.routes.js');
const usersRoutes = require('./api/routes/users.routes.js');
const app = express();

app.use(express.json());

// Mount routes
app.use('/', helloRoutes);
app.use('/auth', authRoutes);
app.use('/users', usersRoutes);

module.exports = app;
