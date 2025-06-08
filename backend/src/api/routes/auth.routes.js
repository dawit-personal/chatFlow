const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { validate } = require('../../utils/validators'); 
const { registerSchema, loginSchema } = require('../../middlewares/validation/auth.validation'); 

// @route   POST /auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', validate(registerSchema), authController.register);

// @route   POST /auth/login
// @desc    Login user and return token
// @access  Public
router.post('/login', validate(loginSchema), authController.login);

module.exports = router; 