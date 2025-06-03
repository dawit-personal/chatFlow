const express = require('express');
const helloRoutes = require('./api/routes/hello.routes');

const app = express();

app.use(express.json());

// Mount routes
app.use('/', helloRoutes);

module.exports = app;
