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

// @desc    create a group chat
// @param   userId - ID of the user
// @returns chat object


  const createGroupChat = async (data) => {
    console.log('🔄 createGroupChat called', data);
  
    const { userId, isGroup, name, message, participantIds: initialParticipantIds } = data;
    let participantIds = initialParticipantIds;  

    console.log('🔄 participantIds', participantIds);
  
    if (!isGroup) {
      return { success: false, message: 'Invalid route: use createChat for 1:1 chats.' };
    }
  
     // Ensure participantIds is always an array
    if (!Array.isArray(participantIds)) {
      return { success: false, message: 'participantIds must be an array.' };
    }

    // Remove creator if present
    participantIds = participantIds.filter((id) => id !== userId);

    if (participantIds.length < 1) {
      return { success: false, message: 'Group chat must include at least one participant (other than yourself).' };
    }

    

    try {
      const chat = await DBService.performTransaction(async (transaction) => {
        // Create a new group chat
        const chat = await chatRepository.createChat(
          {
            userId,
            isGroup: true,
            name,
          },
          { transaction }
        );
  
        // Add the creator
        await chatMemberRepository.createChatMember({ chatId: chat.id, userId }, { transaction });
  
        // Add participants
        for (const participantId of participantIds) {
          await chatMemberRepository.createChatMember({ chatId: chat.id, userId: participantId }, { transaction });
        }
  
        // Add first message
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
  
      return {
        success: true,
        message: 'Group chat created successfully.',
        chat,
      };
  
    } catch (err) {
      console.error('Group chat creation failed:', err);
      return {
        success: false,
        message: 'Failed to create group chat.',
      };
    }
  };
  
const createChat = async (data) => {
  console.log('🔄 createChat called', data);
  const { userId, participantId, message } = data;

  if (!participantId) {
    return { success: false, message: 'Participant ID is required for 1:1 chat.' };
  }

  try {
    const chat = await DBService.performTransaction(async (transaction) => {
      // Step 1: Check if a 1:1 chat already exists between these two users
      const existingChat = await chatRepository.findOneToOneChat(userId, participantId);

      if (existingChat) {
        // Create a message in the existing chat
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
        { userId, isGroup: false },
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

    return {
      success: true,
      message: '1:1 chat created successfully.',
      chat,
    };

  } catch (err) {
    console.error('1:1 chat creation failed:', err);
    return {
      success: false,
      message: 'Failed to create 1:1 chat.',
    };
  }
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
  const options = { offset, limit, order: [['joinedAt', 'DESC']] };
  const chatsMembers= await chatMemberRepository.findAllChatMembers({userId}, null, options);
  if (!chatsMembers || chatsMembers?.length === 0) {
    return [];
  }

    console.log('🔄 chatsMembers', chatsMembers);

  const chatIds = chatsMembers.map(chat =>  chat.chatId);

  // Step 1: Get chat metadata (isGroup, name)
  const chats = await chatRepository.findChatsByIds(chatIds); 

  const results = await Promise.all(
    chats.map(async (chat) => {
      if (chat.isGroup) {
        return {
          id: chat.id,
          name: chat.name,
          isGroup: true,
        };
      } else {
        // 1:1 chat — get member info
        const members = await chatMemberRepository.findAllChatMembersByName({
          userId,
          chatIds: [chat.id], // just this chat
          offset: 0,
          limit: 1, // you only need one record per chat
        });

        return members[0]; // or structure it however your frontend expects
      }
    })
  );

  return results;
};

//@desc    get messages for a chat
//@route   GET /conversation/:id/messages
//@access  Private
const getMessages = async ({ chatId, userId }) => {
  // Step 1: Get chat members
  const chatMembers = await chatMemberRepository.findAllChatMembers(
    { chatId },
    ['userId'],
    { offset: 0, limit: 10 }
  );

  const userIds = chatMembers.map(member => member.userId);

  if (!userIds.includes(userId)) {
    throw new Error('User does not belong to this chat');
  }

  // Step 2: Get user profiles
  const users = await userProfileRepository.findAllUsersAndProfiles(userIds);

  const userMap = {};
  users.forEach(u => {
    userMap[u.userId] = {
      userId: u.userId,
      firstName: u.firstName,
      lastName: u.lastName,
    };
  });

  // Step 3: Get messages
  const messages = await messageRepository.findAllMessages({
    where: { chatId },
    limit: 15,
    offset: 0,
    order: [['timestamp', 'ASC']],
  });

  const otherUserId = userIds.find(id => id !== userId);

  // Step 4: Format messages
  const formattedMessages = messages.map(msg => {
    console.log('🔄 msg', msg);
    const isSent = msg.userId === userId;
    const senderId = msg.senderUserId;
    const recipientId = isSent ? otherUserId : userId;
    const senderInfo = userMap[senderId] || {
      userId: senderId,
      firstName: 'Unknown',
      lastName: '',
    };

    return {
      id: msg.id,
      content: msg.content,
      createdAt: msg.createdAt,
      senderId,
      recipientId,
      sender: senderInfo,
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
  createGroupChat,
  createChat,
  getChat,
  getChats,
  getMessages,
  sendMessage
};
