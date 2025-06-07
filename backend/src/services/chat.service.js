const chatRepository = require('../repositories/chat.repository');
const chatMemberRepository = require('../repositories/chatMember.repository');
const messageRepository = require('../repositories/message.repository');
const messageStatusRepository = require('../repositories/messageStatus.repository');
const DBService = require('./db.service');


// @desc    create a chat
// @param   userId - ID of the user
// @returns chat object
const createChat = async (data) => {

  return await DBService.performTransaction(async (transaction) => {
    const chat = await chatRepository.createChat(data, { transaction });
    //create chat members for all participants
    const allParticipants = [data.userId, ...data.participantIds];

    console.log(allParticipants, 'allParticipants');
    await Promise.all(
      allParticipants.map(userId =>
        chatMemberRepository.createChatMember({ chatId: chat.id, userId }, { transaction })
      )
    );
    const message = await messageRepository.createMessage({ chatId: chat.id, senderUserId: data.userId, content: data.message }, { transaction });
    const messageStatus = await messageStatusRepository.createMessageStatus({ messageId: message.id, userId: data.userId, status: 'sent' }, { transaction });

    return chat || null;
  });

  return chat || null;
};
//@desc    get a chat
//@route   GET /conversations/:id
//@access  Private
const getChat = async (data) => {
  const chat = await chatRepository.findChat({ id: data.id, userId: data.userId }, ['id', 'name', 'updatedAt']);
  return chat || null;
};

//@desc    get all chats
//@route   GET /conversations
//@access  Private
const getChats = async ({ userId, page, pageSize }) => {
  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  return await chatMemberRepository.findAllChatMembersByName({ userId, offset, limit });
};

//@desc    get messages for a chat
//@route   GET /conversation/:id/messages
//@access  Private
const getMessages = async ({ chatId, userId }) => {
  const messages = await messageRepository.findAllMessages({
    where: { chatId },
    limit: 15,
    offset: 0
  });
  return messages || null;
};


module.exports = {
  createChat,
  getChat,
  getChats,
  getMessages
};
