import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './authContext';

const ChatContext = createContext();

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const { accessToken, user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [activeChats, setActiveChats] = useState(new Map());

  console.log('onlineUsers', onlineUsers);

  // Initialize socket connection
  useEffect(() => {
    console.log('ChatContext useEffect triggered:', { 
      accessToken: !!accessToken, 
      userId: user?.userId 
    });
    
    if (accessToken && user?.userId) {
      const SERVER_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
      
      console.log('Attempting socket connection to:', SERVER_URL);
      
      const newSocket = io(SERVER_URL, {
        auth: {
          token: accessToken,
          userId: user.userId,
        },
        transports: ['websocket', 'polling'],
      });

      // Connection event handlers
      newSocket.on('connect', () => {
        console.log('✅ Connected to chat server');
        setIsConnected(true);
        console.log('🔄 Emitting addNewChat with userId:', user.userId);
        newSocket.emit('addNewChat', user.userId);
      });

      newSocket.on('disconnect', () => {
        console.log('❌ Disconnected from chat server');
        setIsConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error('🚫 Socket connection error:', error);
        setIsConnected(false);
      });

      newSocket.on('getOnlineUsers', (users) => {
        console.log('📡 Received getOnlineUsers:', users);
        setOnlineUsers(new Set(users.map(u => u.userId)));
      });

      // User presence events
      newSocket.on('user_online', (userId) => {
        setOnlineUsers(prev => new Set(prev).add(userId));
      });

      newSocket.on('user_offline', (userId) => {
        setOnlineUsers(prev => {
          const updated = new Set(prev);
          updated.delete(userId);
          return updated;
        });
      });

      newSocket.on('online_users', (users) => {
        setOnlineUsers(new Set(users));
      });

      // Message handlers
      newSocket.on('new_message', (message) => {
        console.log('New message received:', message);
        // Update active chats with new message
        setActiveChats(prev => {
          const updated = new Map(prev);
          const chatId = message.chatId;
          const chatMessages = updated.get(chatId) || [];
          updated.set(chatId, [...chatMessages, message]);
          return updated;
        });
      });

      newSocket.on('message_read', ({ messageId, chatId, userId }) => {
        console.log('Message marked as read:', { messageId, chatId, userId });
        // Update message read status in active chats
        setActiveChats(prev => {
          const updated = new Map(prev);
          const chatMessages = updated.get(chatId) || [];
          const updatedMessages = chatMessages.map(msg => 
            msg.id === messageId ? { ...msg, isRead: true } : msg
          );
          updated.set(chatId, updatedMessages);
          return updated;
        });
      });

      newSocket.on('typing_start', ({ chatId, userName }) => {
        console.log(`${userName} is typing in chat ${chatId}`);
        // Handle typing indicators
      });

      newSocket.on('typing_stop', ({ chatId, userId }) => {
        console.log(`User ${userId} stopped typing in chat ${chatId}`);
        // Handle typing indicators
      });

      setSocket(newSocket);

      // Cleanup on unmount
      return () => {
        console.log('🧹 Cleaning up socket connection');
        newSocket.close();
        setSocket(null);
        setIsConnected(false);
      };
    } else {
      console.log('⚠️ Missing accessToken or userId, not connecting socket');
    }
  }, [accessToken, user?.userId]);

  // Socket utility functions
  const joinChat = (chatId) => {
    if (socket && isConnected) {
      socket.emit('join_chat', chatId);
      console.log(`Joined chat: ${chatId}`);
    }
  };

  const leaveChat = (chatId) => {
    if (socket && isConnected) {
      socket.emit('leave_chat', chatId);
      console.log(`Left chat: ${chatId}`);
    }
  };

  const sendMessage = (chatId, content) => {
    if (socket && isConnected) {
      const messageData = {
        chatId,
        content,
        timestamp: new Date().toISOString(),
      };
      socket.emit('send_message', messageData);
      console.log('Message sent via socket:', messageData);
    }
  };

  const markMessageAsRead = (messageId, chatId) => {
    if (socket && isConnected) {
      socket.emit('mark_read', { messageId, chatId });
      console.log(`Marked message ${messageId} as read in chat ${chatId}`);
    }
  };

  const startTyping = (chatId) => {
    if (socket && isConnected) {
      socket.emit('typing_start', chatId);
    }
  };

  const stopTyping = (chatId) => {
    if (socket && isConnected) {
      socket.emit('typing_stop', chatId);
    }
  };

  const getChatMessages = (chatId) => {
    return activeChats.get(chatId) || [];
  };

  const isUserOnline = (userId) => {
    return onlineUsers.has(userId);
  };

  const value = {
    socket,
    isConnected,
    onlineUsers,
    activeChats,
    // Socket functions
    joinChat,
    leaveChat,
    sendMessage,
    markMessageAsRead,
    startTyping,
    stopTyping,
    // Utility functions
    getChatMessages,
    isUserOnline,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext; 