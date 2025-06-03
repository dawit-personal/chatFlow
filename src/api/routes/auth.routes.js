const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { validate } = require('../../utils/validators'); // Import generic validate middleware
const { registerSchema } = require('../../middlewares/validation/registerValidation'); // Import specific schema

// @route   POST /auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', validate(registerSchema), authController.register); // Apply validation middleware

module.exports = router; 