import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Paper,
  TextField,
  IconButton,
  CircularProgress,
  Alert,
  AppBar,
  Toolbar,
} from '@mui/material';
import {
  Send as SendIcon,
  ArrowBack as ArrowBackIcon,
  MoreVert as MoreVertIcon,
  Done as DoneIcon,
  DoneAll as DoneAllIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { useChat } from '../context/chatContext';
import axios from 'axios';

const Message = () => {
  const navigate = useNavigate();
  const { chatId } = useParams();
  const { accessToken, user } = useAuth();
  const { onlineUsers, socket, sendMessage: sendSocketMessage } = useChat();
  
  // State management
  const [messages, setMessages] = useState([]);
  const [chatInfo, setChatInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [otherUserId, setOtherUserId] = useState(null); // Track the other user's ID for online status

  // Create the isUserOnline function locally
  const isUserOnline = (userId) => {
    return onlineUsers.has(userId);
  };

  // Fetch chat details and messages
  const fetchChatData = async () => {
    try {
      setLoading(true);
      setError('');

      if (!accessToken) {
        setError('No access token found. Please log in again.');
        navigate('/login');
        return;
      }

      const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:4000';
      
      // Fetch real messages from API
      const messagesResponse = await axios.get(`${API_ENDPOINT}/conversations/${chatId}/messages`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });


      // Get current user ID for comparison
      const currentUserId = user?.userId 
      
      // Transform API messages to match UI expectations
      const transformedMessages = messagesResponse.data.messages.map(message => ({
        id: message.id,
        content: message.content,
        senderId: message.senderId,
        recipientId: message.recipientId,
        timestamp: new Date(message.timestamp || Date.now()), // Use current time if timestamp is missing
        // Message is "mine" if current user is the sender
        isMe: message.senderId === currentUserId,
        isRead: message.isRead || false, // Default to false if not provided
        messageType: message.messageType || 'text',
        senderName: message.sender ? `${message.sender.firstName} ${message.sender.lastName}`.trim() : 'Unknown',
        senderFirstName: message.sender?.firstName || 'Unknown',
        senderLastName: message.sender?.lastName || '',
      }));

      // Determine the other user's ID (the one who is not the current user)
      // Check both sender and recipient to find the other participant
      let otherUser = null;
      for (const message of messagesResponse.data.messages) {
        if (message.senderId !== currentUserId) {
          otherUser = message.senderId;
          break;
        } else if (message.recipientId !== currentUserId) {
          otherUser = message.recipientId;
          break;
        }
      }
      
      if (otherUser) {
        setOtherUserId(otherUser);
      }

      // Create chat info using sender information from the first message
      const firstMessage = messagesResponse.data.messages[0];
      const chatDisplayName = firstMessage?.sender 
        ? `${firstMessage.sender.firstName} ${firstMessage.sender.lastName}`.trim()
        : 'Chat Conversation';

      const fakeChatInfo = {
        id: chatId,
        name: chatDisplayName,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${chatDisplayName}&backgroundColor=8E2DE2`,
        isOnline: otherUser ? isUserOnline(otherUser) : false,
      };

      setChatInfo(fakeChatInfo);
      setMessages(transformedMessages);
      
    } catch (error) {
      console.error('Failed to fetch chat data:', error);
      if (error.response?.status === 401) {
        setError('Session expired. Please log in again.');
        navigate('/login');
      } else if (error.response?.status === 404) {
        setError('Chat not found.');
      } else {
        setError('Failed to load chat. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Load chat data on component mount
  useEffect(() => {
    fetchChatData();
  }, [chatId, accessToken]);

  // Listen for real-time messages
  useEffect(() => {
    if (!socket) {
      console.log('🔌 Message Debug - No socket available for message listening');
      return;
    }

    console.log('🔌 Message Debug - Setting up message listener for chat:', chatId);

    const handleReceiveMessage = (messageData) => {
      console.log('🔌 Message Debug - Received real-time message:', messageData);
      console.log('🔌 Message Debug - Current chat ID:', chatId);
      console.log('🔌 Message Debug - Message chat ID:', messageData.chatId);
      
      // Only add message if it belongs to the current chat
      if (messageData.chatId && messageData.chatId.toString() === chatId.toString()) {
        console.log('🔌 Message Debug - Message belongs to current chat, adding to UI');
        
        // Transform the received message to match our UI format
        const transformedMessage = {
          id: messageData.id || messageData.messageId || Date.now(),
          content: messageData.content || messageData.text,
          senderId: messageData.senderId,
          recipientId: messageData.recipientId,
          timestamp: new Date(messageData.timestamp || Date.now()),
          isMe: messageData.senderId === user?.userId,
          isRead: false, // New received messages are unread
          messageType: 'text',
          senderName: messageData.senderName || 'Unknown',
          senderFirstName: messageData.senderFirstName || 'Unknown',
          senderLastName: messageData.senderLastName || '',
        };

        console.log('🔌 Message Debug - Transformed message:', transformedMessage);

        // Add message to state (with deduplication)
        setMessages(prevMessages => {
          // Check if message already exists
          const messageExists = prevMessages.some(msg => 
            msg.id === transformedMessage.id || 
            (msg.content === transformedMessage.content && 
             msg.senderId === transformedMessage.senderId &&
             Math.abs(new Date(msg.timestamp) - new Date(transformedMessage.timestamp)) < 1000)
          );

          if (messageExists) {
            console.log('🔌 Message Debug - Message already exists, skipping duplicate');
            return prevMessages;
          }

          console.log('🔌 Message Debug - Adding new message to chat UI');
          return [...prevMessages, transformedMessage];
        });
      } else {
        console.log('🔌 Message Debug - Message not for current chat, ignoring');
      }
    };

    // Register the event listener
    socket.on('receive_message', handleReceiveMessage);
    console.log('🔌 Message Debug - Registered receive_message listener for chat:', chatId);

    // Cleanup function
    return () => {
      console.log('🔌 Message Debug - Cleaning up message listener for chat:', chatId);
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [socket, chatId, user?.userId]); // Dependencies: re-run when socket, chatId, or user changes

  // Send message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    // Create new message object for optimistic update
    const currentUserId = user?.userId || user?.id;
    const messageObj = {
      id: Date.now(), // Temporary ID
      content: newMessage.trim(),
      senderId: currentUserId,
      recipientId: otherUserId, // Add recipient ID
      chatId: chatId, // Add chat ID
      timestamp: new Date(),
      isMe: true,
      isRead: false, // New messages start as unread
      messageType: 'text',
    };

    try {
      setSending(true);
      console.log('🔌 Message Debug - Starting message send process');

      // Add message to list immediately (optimistic update)
      setMessages(prev => [...prev, messageObj]);
      setNewMessage('');

      // Send message via socket for real-time delivery
      if (socket && otherUserId) {
        console.log('🔌 Message Debug - Sending via socket to:', otherUserId);
        const socketResult = sendSocketMessage(chatId, otherUserId, newMessage.trim());
        if (!socketResult.success) {
          console.warn('🔌 Message Debug - Socket send failed:', socketResult.reason);
        }
      } else {
        console.warn('🔌 Message Debug - Socket not available or no recipient ID');
      }

      // Send message to API for persistence
      console.log('🔌 Message Debug - Sending to API for persistence');
      const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:4000';
      const response = await axios.post(`${API_ENDPOINT}/conversations/${chatId}/messages`, {
        content: newMessage.trim(),
      }, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      
      console.log('🔌 Message Debug - API response received:', response.data);
      
      // Update the message with real ID from server
      setMessages(prev => prev.map(msg => 
        msg.id === messageObj.id ? { ...msg, id: response.data.id } : msg
      ));

    } catch (error) {
      console.error('🔌 Message Debug - Failed to send message:', error);
      // Remove the message if sending failed
      setMessages(prev => prev.filter(msg => msg.id !== messageObj.id));
      setError('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Loading state
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          width: '100vw',
          background: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress size={60} sx={{ color: '#8E2DE2' }} />
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          width: '100vw',
          background: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
        }}
      >
        <Alert 
          severity="error" 
          sx={{ 
            maxWidth: '400px',
            backgroundColor: 'rgba(244, 67, 54, 0.1)',
            color: '#f44336',
            '& .MuiAlert-icon': { color: '#f44336' }
          }}
        >
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        background: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Chat Header */}
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          background: 'linear-gradient(135deg, #9B59B6 0%, #8E44AD 100%)',
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate('/chats')}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          
          <Avatar
            src={chatInfo?.avatar}
            sx={{ width: 40, height: 40, mr: 2 }}
          />
          
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {chatInfo?.name || `Chat ${chatId}`}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              {otherUserId && isUserOnline(otherUserId) ? 'Active now' : 'Last seen recently'}
            </Typography>
          </Box>
          
          <IconButton color="inherit">
            <MoreVertIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Messages Container */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {messages.length === 0 ? (
          // No messages state
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 4,
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h6"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  mb: 1,
                  fontWeight: 500,
                }}
              >
                No messages yet
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255, 255, 255, 0.5)',
                }}
              >
                Send a message to start the conversation
              </Typography>
            </Box>
          </Box>
        ) : (
          // Messages list
          <Box
            sx={{
              flexGrow: 1,
              overflow: 'auto',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            {messages.map((message, index) => (
              <Box
                key={message.id || `message-${index}-${message.timestamp}`}
                sx={{
                  display: 'flex',
                  justifyContent: message.isMe ? 'flex-end' : 'flex-start',
                  mb: 1,
                }}
              >
                {!message.isMe && (
                  <Avatar
                    src={chatInfo?.avatar}
                    sx={{ width: 32, height: 32, mr: 1, mt: 0.5 }}
                  />
                )}
                
                <Paper
                  elevation={2}
                  sx={{
                    p: 1.5,
                    maxWidth: '70%',
                    backgroundColor: message.isMe 
                      ? '#8E2DE2' 
                      : 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    borderRadius: 2,
                    ...(message.isMe ? {
                      borderBottomRightRadius: 4,
                    } : {
                      borderBottomLeftRadius: 4,
                    }),
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: '0.9rem',
                      lineHeight: 1.4,
                      wordWrap: 'break-word',
                    }}
                  >
                    {message.content}
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    mt: 0.5,
                  }}>
                    <Typography
                      variant="caption"
                      sx={{
                        opacity: 0.7,
                        fontSize: '0.7rem',
                      }}
                    >
                      {message.timestamp.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                      })}
                    </Typography>
                    {message.isMe && (
                      <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                        {message.isRead ? (
                          <DoneAllIcon 
                            sx={{ 
                              fontSize: '0.8rem', 
                              color: '#4CAF50', // Green for read
                              opacity: 0.8,
                            }} 
                          />
                        ) : (
                          <DoneIcon 
                            sx={{ 
                              fontSize: '0.8rem', 
                              color: 'rgba(255, 255, 255, 0.6)', // Grey for unread
                              opacity: 0.6,
                            }} 
                          />
                        )}
                      </Box>
                    )}
                  </Box>
                </Paper>
                
                {message.isMe && (
                  <Box sx={{ width: 32, ml: 1 }} /> // Spacer for alignment
                )}
              </Box>
            ))}
          </Box>
        )}

        {/* Message Input */}
        <Paper
          elevation={4}
          sx={{
            p: 2,
            backgroundColor: 'rgba(45, 45, 45, 0.95)',
            borderRadius: 0,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              disabled={sending}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 3,
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#8E2DE2',
                  },
                },
                '& .MuiInputBase-input::placeholder': {
                  color: 'rgba(255, 255, 255, 0.5)',
                },
              }}
            />
            <IconButton
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || sending}
              sx={{
                backgroundColor: '#8E2DE2',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#9A4DFF',
                },
                '&:disabled': {
                  backgroundColor: 'rgba(142, 45, 226, 0.3)',
                  color: 'rgba(255, 255, 255, 0.5)',
                },
              }}
            >
              {sending ? (
                <CircularProgress size={20} sx={{ color: 'white' }} />
              ) : (
                <SendIcon />
              )}
            </IconButton>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Message; 