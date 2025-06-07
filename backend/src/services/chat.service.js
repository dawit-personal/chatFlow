const chatRepository = require('../repositories/chat.repository');

// @desc    create a chat
// @param   userId - ID of the user
// @returns chat object
const createChat = async (data) => {
  const chat = await chatRepository.createChat(data);

  return chat || null;
};

const getChat = async (data) => {
  const chat = await chatRepository.findChat({id:data.id, userId:data.userId}, ['id', 'name',  'updatedAt']);
  return chat || null;
};

module.exports = {
  createChat,
  getChat
};
