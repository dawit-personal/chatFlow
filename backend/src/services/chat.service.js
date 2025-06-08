const chatRepository = require('../repositories/chat.repository');
const chatMemberRepository = require('../repositories/chatMember.repository');
const messageRepository = require('../repositories/message.repository');
const messageStatusRepository = require('../repositories/messageStatus.repository');
const DBService = require('./db.service');
const userProfileRepository = require('../repositories/userProfile.repository');


// @desc    create a chat
// @param   userId - ID of the user
// @returns chat object
// const createChat = async (data) => {

//   return await DBService.performTransaction(async (transaction) => {
//     const chat = await chatRepository.createChat(data, { transaction });
//     //create chat members for all participants
//     const allParticipants = [data.userId, ...data.participantIds];

//     await Promise.all(
//       allParticipants.map(userId =>
//         chatMemberRepository.createChatMember({ chatId: chat.id, userId }, { transaction })
//       )
//     );
//     const message = await messageRepository.createMessage({ chatId: chat.id, senderUserId: data.userId, content: data.message }, { transaction });
//     const messageStatus = await messageStatusRepository.createMessageStatus({ messageId: message.id, userId: data.userId, status: 'sent' }, { transaction });

//     return chat || null;
//   });

//   return chat || null;
// };

const createChat = async (data) => {
  console.log('🔄 createChat called', data);
  const { userId, participantId, message } = data;

  return await DBService.performTransaction(async (transaction) => {
    // Step 1: Check if a 1:1 chat already exists between these two users
    const existingChat = await chatRepository.findOneToOneChat(userId, participantId);

    if (existingChat) {
      // 1:1 chat already exists, create a message in the existing chat
      const newMessage = await messageRepository.createMessage(
        { chatId: existingChat.id, senderUserId: userId, content: message },
        { transaction }
      );

      await messageStatusRepository.createMessageStatus(
        { messageId: newMessage.id, userId, status: 'sent' },
        { transaction }
      );

      return existingChat;
    }

    // Step 2: Create a new 1:1 chat
    const chat = await chatRepository.createChat(
      { userId, isGroup: false }, // only userId needed here
      { transaction }
    );

    // Step 3: Add both users to ChatMembers
    await chatMemberRepository.createChatMember({ chatId: chat.id, userId }, { transaction });
    await chatMemberRepository.createChatMember({ chatId: chat.id, userId: participantId }, { transaction });

    // Step 4: Create the first message
    const newMessage = await messageRepository.createMessage(
      { chatId: chat.id, senderUserId: userId, content: message },
      { transaction }
    );

    await messageStatusRepository.createMessageStatus(
      { messageId: newMessage.id, userId, status: 'sent' },
      { transaction }
    );

    return chat;
  });
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
  const chats = await chatRepository.getAllChats({ userId }, ['id']);
  if (!chats || chats?.length === 0) {
    return [];
  }

  const chatIds = chats.map(chat => chat.id);


  return await chatMemberRepository.findAllChatMembersByName({ userId, chatIds, offset, limit });
};

//@desc    get messages for a chat
//@route   GET /conversation/:id/messages
//@access  Private
const getMessages = async ({ chatId, userId }) => {

  // Step 1: Find all members in the chat
  const chatMembers = await chatMemberRepository.findAllChatMembers(
    { chatId },
    ['userId'],
    { offset: 0, limit: 10 }
  );
  console.log('🔄 chatMembers', chatMembers);

  const userIds = chatMembers.map(member => member.userId);

  if (!userIds.includes(userId)) {
    throw new Error('User does not belong to this chat');
  }

  // Step 2: Fetch user profiles for all members
  const users = await userProfileRepository.findAllUsersAndProfiles(userIds);

  console.log('🔄 users', users);

  const userMap = {};
  users.forEach(u => {
    userMap[u.userId] = {
      firstName: u.firstName,
      lastName: u.lastName,
    };
  });

  // Step 3: Fetch messages
  const messages = await messageRepository.findAllMessages({
    where: { chatId },
    limit: 15,
    offset: 0,
    order: [['timestamp', 'ASC']],
  });

  console.log('🔄 messages', messages);
  
  // Step 4: Format and label messages
  const formattedMessages = messages.map(msg => {
    const isSent = msg.userId === userId;
    console.log(`Message ID: ${msg.id}, msg.userId: ${msg.userId}, loggedInUserId: ${userId}, direction: ${isSent ? 'sent' : 'received'}`);
  
    return {
      id: msg.id,
      content: msg.content,
      createdAt: msg.createdAt,
      senderId: msg.senderUserId,
      sender: {
        userId: msg.userId,
        firstName: userMap[msg.userId]?.firstName || 'Unknown',
        lastName: userMap[msg.userId]?.lastName || '',
      },
      direction: isSent ? 'sent' : 'received',
    };
  });
  
  return formattedMessages;
};


//@desc    send message to a chat
//@route   POST /conversations/:id/messages
//@access  Private
const sendMessage = async ({ chatId, userId, ...data }) => {
  return await DBService.performTransaction(async (transaction) => {
    const message = await messageRepository.createMessage({ chatId, senderUserId: userId, ...data }, { transaction });
    const messageStatus = await messageStatusRepository.createMessageStatus({ messageId: message.id, userId, status: 'sent' }, { transaction });
    return message || null;
  });
  return message || null;
};


module.exports = {
  createChat,
  getChat,
  getChats,
  getMessages,
  sendMessage
};
