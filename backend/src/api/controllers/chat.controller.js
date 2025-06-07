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

//@desc    get a chat
//@route   GET /conversations/:id
//@access  Private
async function getChat(req, res, next) {
    try {
        const chatId = req.params.id;
        const userId = req.user.userId;
        const chat = await chatService.getChat({id:chatId, userId});

        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
          }
    
        return res.status(200).json({ chat });
    } catch (error) {
        // Log the error for server-side debugging
        console.error('Chat retrieval error:', error) || error;

        // Generic error response
        return res.status(500).json({ message: 'Server error during chat retrieval.' });
    }
}
//@desc    get all chats
//@route   GET /conversations
//@access  Private
async function getChats(req, res, next) {
    try {
      const userId = req.user.userId;
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
  
      const chats = await chatService.getChats({ userId, page, pageSize });
  
      return res.status(200).json({ 
        page,
        pageSize,
        data: chats 
      });
    } catch (error) {
      console.error('Error fetching chats:', error);
      return res.status(500).json({ message: 'Server error during chat list retrieval.' });
    }
  }
  

module.exports = {
   createChat,
   getChat,
   getChats
}; 