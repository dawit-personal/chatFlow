import React, { createContext, useState, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './authContext';

// Create a context to share socket and chat-related state across the app
export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user, accessToken } = useAuth();

  // State to store the socket instance
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [activeChats, setActiveChats] = useState(new Map());

  useEffect(() => {
    // Skip if no auth
    if (!accessToken || !user?.userId) {
      console.warn('No access token or user ID — skipping socket setup');
      return;
    }

    const SERVER_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    console.log('Connecting to socket server at:', SERVER_URL);

    // Create socket connection
    const newSocket = io(SERVER_URL, {
      auth: {
        token: accessToken,
        userId: user.userId,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,//increases the delay gradually after each failed attempt upto 5 sec
    });

    // --- Event Handlers ---

    // Fires when successfully connected
    const handleConnect = () => {
      console.log('Connected to socket');
      setIsConnected(true);
      newSocket.emit('create_new_chat', user.userId); // Notify server who joined
      newSocket.emit('get_online_users'); // Request initial online users
    };

    // Fires when disconnected
    const handleDisconnect = () => {
      console.log('Disconnected from socket');
      setIsConnected(false);
    };

    // Fires on connection failure
    const handleConnectError = (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    };

    // Online user list received from server
    const handleOnlineUsers = (users) => {
      console.log('Received online users:', users);
      const online = new Set(users.map(u => u.userId));
      setOnlineUsers(online);
    };

    const handleUserOnline = (userId) => {
      console.log('User online:', userId);
      setOnlineUsers(prev => new Set(prev).add(userId));
    };

    const handleUserOffline = (userId) => {
      console.log('User offline:', userId);
      setOnlineUsers(prev => {
        const updated = new Set(prev);
        updated.delete(userId);
        console.log('Updated online users after offline:', Array.from(updated));
        return updated;
      });
    };

    // Handle new incoming message
    const handleNewMessage = (message) => {
      const { chatId } = message;
      setActiveChats(prev => {
        const updated = new Map(prev);
        const messages = updated.get(chatId) || [];
        updated.set(chatId, [...messages, message]);
        return updated;
      });
    };

    // Update message read status
    const handleMessageRead = ({ messageId, chatId }) => {
      setActiveChats(prev => {
        const updated = new Map(prev);
        const messages = updated.get(chatId) || [];
        const updatedMessages = messages.map(msg =>
          msg.id === messageId ? { ...msg, isRead: true } : msg
        );
        updated.set(chatId, updatedMessages);
        return updated;
      });
    };

    // Typing indicators (you can extend this to show UI changes)
    const handleTypingStart = ({ chatId, userName }) => {
      console.log(`${userName} is typing in chat ${chatId}`);
    };

    const handleTypingStop = ({ chatId, userId }) => {
      console.log(`User ${userId} stopped typing in chat ${chatId}`);
    };

    // --- Register socket event listeners ---
    newSocket.on('connect', handleConnect);
    newSocket.on('disconnect', handleDisconnect);
    newSocket.on('connect_error', handleConnectError);
    newSocket.on('get_online_users', handleOnlineUsers);
    newSocket.on('user_online', handleUserOnline);
    newSocket.on('user_offline', handleUserOffline);
    newSocket.on('new_message', handleNewMessage);
    newSocket.on('message_read', handleMessageRead);
    newSocket.on('typing_start', handleTypingStart);
    newSocket.on('typing_stop', handleTypingStop);

    // Poll online users every 30 seconds
    //acts as a safety net to sync the client with the server's onlineUsers state.
    // it also ahndel edge case where issues like missed events during Socket.IO reconnections, server restarts,
    //  or temporary network drops, which are common in real-world scenarios with TCP-based WebSocket connections.
    //tradeoffs:increasing network traffic, especially with many concurrent users and delay updates, battery udage
    // const pollOnlineUsers = setInterval(() => {
    //   newSocket.emit('get_online_users');
    // }, 30000);

    setSocket(newSocket);

    // --- Cleanup function ---
    return () => {
      //clearInterval(pollOnlineUsers);
      // Use socket.off() to clean up listeners so they don't stack on re-render or re-mount
      newSocket.off('connect', handleConnect);
      newSocket.off('disconnect', handleDisconnect);
      newSocket.off('connect_error', handleConnectError);
      newSocket.off('get_online_users', handleOnlineUsers);
      newSocket.off('user_online', handleUserOnline);
      newSocket.off('user_offline', handleUserOffline);
      newSocket.off('new_message', handleNewMessage);
      newSocket.off('message_read', handleMessageRead);
      newSocket.off('typing_start', handleTypingStart);
      newSocket.off('typing_stop', handleTypingStop);

      // 👋 Close connection and reset state
      newSocket.close();
      setSocket(null);
      setIsConnected(false);
    };
  }, [accessToken, user?.userId]);

  //Send message to another user ===
  const sendMessage = (chatId, recipientId, text) => {
    // 1. Ensure the socket is connected and user is authenticated
    if (!socket || !user?.userId) {
      console.warn('Cannot send message: Socket not connected or user missing');
      return { success: false, reason: 'Not connected or no user' };
    }
  
    // 2. Check if the recipient is online
    if (!onlineUsers.has(recipientId)) {
      console.warn('Recipient is offline');
      return { success: false, reason: 'User offline' };
    }
  
    // 3. Construct the message payload
    const message = {
      chatId,
      senderId: user.userId,
      recipientId,
      text,
      timestamp: new Date().toISOString(),
    };
  
    // 4. Emit the message to the server with an acknowledgement callback
    socket.emit('send_message', message, (response) => {
      if (!response.success) {
        console.error('Server failed to deliver message:', response.reason);
        // Optionally: Rollback optimistic UI update or show retry UI
      }
    });
  
    // 5. Optimistically update the chat UI immediately
    setActiveChats(prev => {
      const updated = new Map(prev);
      const messages = updated.get(chatId) || [];
      updated.set(chatId, [...messages, { ...message, pending: true }]);
      return updated;
    });
  
    return { success: true };
  };

  return (
    <ChatContext.Provider
      value={{
        socket,
        isConnected,
        onlineUsers,
        activeChats,
        setActiveChats,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook for easier context usage in components
export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
