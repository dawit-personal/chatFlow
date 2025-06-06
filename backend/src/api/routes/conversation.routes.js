const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');
const authenticate = require('../../middlewares/auth/auth.middleware');
// @route   GET /users/me
// @desc    Get user profile
// @access  Private
router.post('/conversations', authenticate,chatController.createChat);


module.exports = router; 