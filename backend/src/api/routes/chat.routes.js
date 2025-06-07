const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');
const authenticate = require('../../middlewares/auth/auth.middleware');


// @route   POST /conversations
// @desc    create a chat
// @access  Private
router.post('/conversations', authenticate,chatController.createChat);

// @route   GET /conversation
// @desc    get a chat
// @access  Private
router.get('/conversation/:id', authenticate,chatController.getChat);

// @route   GET /conversations
// @desc    get all chats
// @access  Private
router.get('/conversations', authenticate,chatController.getChats);




module.exports = router; 