const chatRepository = require('../repositories/chat.repository');

// @desc    create a chat
// @param   userId - ID of the user
// @returns chat object
const createChat = async (data) => {
  const chat = await chatRepository.createChat(data);

  return chat || null;
};
//@desc    get a chat
//@route   GET /conversations/:id
//@access  Private
const getChat = async (data) => {
  const chat = await chatRepository.findChat({id:data.id, userId:data.userId}, ['id', 'name',  'updatedAt']);
  return chat || null;
};

//@desc    get all chats
//@route   GET /conversations
//@access  Private
const getChats = async ({ userId, page, pageSize }) => {
  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  return await chatRepository.findAllChats({ userId, offset, limit });
};

module.exports = {
  createChat,
  getChat,
  getChats
};
