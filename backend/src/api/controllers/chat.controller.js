const chatService = require('../../services/chat.service');
// @desc    Get user profile
// @route   POST /conversations/create
// @access  Private
async function createChat(req, res, next) {
    try {
        const userId = req.user.userId;
        const data = req.body;
        const chat = await chatService.createChat({...data, userId});
        return res.status(201).json({
            chat,
            message: 'Success',
       
        });
    } catch (error) {
        // Log the error for server-side debugging
        console.error('Chat creation error:', error) || error;

        // Generic error response
        return res.status(500).json({ message: 'Server error during chat creation.' });
    }
}

module.exports = {
   createChat
}; 