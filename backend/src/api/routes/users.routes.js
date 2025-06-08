const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const authenticate = require('../../middlewares/auth/auth.middleware');
// @route   GET /users/me
// @desc    Get user profile
// @access  Private
router.get('/me', authenticate,usersController.getMe);

router.post('/search', authenticate, usersController.searchByFirstName);


module.exports = router; 