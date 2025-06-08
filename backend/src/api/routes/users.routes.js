const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const authenticate = require('../../middlewares/auth/auth.middleware');
const { validate } = require('../../utils/validators'); 
const { searchUserSchema } = require('../../middlewares/validation/user.validation');

// @route   GET /users/me
// @desc    Get user profile
// @access  Private
router.get('/me', authenticate,usersController.getMe);

router.post('/search', authenticate, validate(searchUserSchema), usersController.searchByFirstName);


module.exports = router; 