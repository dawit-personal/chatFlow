const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// @route   POST /auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', authController.register);

module.exports = router; 