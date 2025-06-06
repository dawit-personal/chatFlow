const chatRepository = require('../repositories/chats.repository');

// @desc    create a chat
// @param   userId - ID of the user
// @returns chat object
const createChat = async (data) => {
  const chat = await chatRepository.createChats(data);
  return chat;
};

module.exports = {
  createChat,
};
