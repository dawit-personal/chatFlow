import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Badge,
  CircularProgress,
  Alert,
  Button,
  Divider,
} from '@mui/material';
import { Message as MessageIcon, Schedule as ScheduleIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './authContext';
import axios from 'axios';

const Chats = () => {
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  
  // State management
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [pageSize] = useState(10);

  // Fetch chats from API
  const fetchChats = async (pageNum = 1, append = false) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError('');

      if (!accessToken) {
        setError('No access token found. Please log in again.');
        navigate('/login');
        return;
      }

      const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:4000';
      const offset = (pageNum - 1) * pageSize;
      
      const response = await axios.get(`${API_ENDPOINT}/conversations?offset=${offset}&limit=${pageSize}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.data && response.data.data) {
        // Transform API data to match UI expectations
        const transformedChats = response.data.data.map(chatMember => ({
          id: chatMember.chatId, // Use chatId as the main identifier for navigation
          memberId: chatMember.id, // Keep member ID if needed
          name: `Chat ${chatMember.chatId}`, // Fallback name for groups
          firstName: chatMember.user?.profile?.firstName || 'Unknown',
          lastName: chatMember.user?.profile?.lastName || 'User',
          email: chatMember.user?.email || 'No email',
          lastMessage: 'No messages yet',
          timestamp: new Date(chatMember.joinedAt).toLocaleString('en-US', { 
            month: 'short', 
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          }),
          joinedAt: chatMember.joinedAt,
          unreadCount: 0, // API doesn't provide this
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${chatMember.user?.profile?.firstName || 'User'}&backgroundColor=8E2DE2`,
          isOnline: Math.random() > 0.3, // Higher chance of being online for demo
          lastSeen: Math.random() > 0.5 ? 'Active now' : 'Last seen 2h ago', // Demo last seen
          isGroup: false, // This endpoint seems to return individual chat members
          userId: chatMember.userId,
          user: chatMember.user, // Keep full user object if needed
        }));

        if (append) {
          setChats(prevChats => [...prevChats, ...transformedChats]);
        } else {
          setChats(transformedChats);
        }

        // Check if there are more pages
        setHasMore(transformedChats.length === pageSize);
        setPage(pageNum);
      } else {
        setError('Invalid response format from server.');
      }
    } catch (error) {
      console.error('Failed to fetch chats:', error);
      if (error.response?.status === 401) {
        setError('Session expired. Please log in again.');
        navigate('/login');
      } else {
        setError('Failed to load chats. Please try again.');
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Load initial chats
  useEffect(() => {
    fetchChats(1);
  }, [accessToken]);

  // Handle load more
  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchChats(page + 1, true);
    }
  };

  const handleChatClick = async (chatId) => {
    try {
      if (!accessToken) {
        setError('No access token found. Please log in again.');
        navigate('/login');
        return;
      }

      const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:4000';
      
      console.log(`Opening chat ${chatId}`);
      
      // Make API call to get conversation details
      const response = await axios.get(`${API_ENDPOINT}/conversation/${chatId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log('Chat details:', response.data);
      
      // You can add navigation to a chat detail page here
      // navigate(`/chat/${chatId}`);
      
    } catch (error) {
      console.error('Failed to fetch chat details:', error);
      if (error.response?.status === 401) {
        setError('Session expired. Please log in again.');
        navigate('/login');
      } else {
        console.error('Failed to load chat details.');
      }
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
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 0, sm: 3 },
      }}
    >
      <Paper
        elevation={24}
        sx={{
          width: '100%',
          maxWidth: { xs: '100%', sm: '95%', md: '800px' },
          minHeight: { xs: '100vh', sm: '700px' },
          borderRadius: { xs: 0, sm: 4 },
          backgroundColor: 'rgba(45, 45, 45, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          overflow: 'hidden',
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #9B59B6 0%, #8E44AD 100%)',
            height: { xs: '120px', md: '150px' },
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            px: { xs: 2, sm: 3, md: 4 },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <MessageIcon sx={{ color: 'white', fontSize: { xs: '2rem', md: '2.5rem' } }} />
            <Typography
              variant="h3"
              sx={{
                color: 'white',
                fontWeight: 'bold',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
              }}
            >
              Chats ({chats.length})
            </Typography>
          </Box>
        </Box>

        {/* Chats List */}
        <Box sx={{ p: 0 }}>
          {chats.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                No chats found
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                Start a conversation to see your chats here
              </Typography>
            </Box>
          ) : (
            <List sx={{ width: '100%', bgcolor: 'transparent', p: 0 }}>
              {chats.map((chat, index) => (
                <React.Fragment key={chat.id}>
                  <ListItem
                    sx={{
                      px: { xs: 2, sm: 3, md: 4 },
                      py: { xs: 2, md: 2.5 },
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(142, 45, 226, 0.08)',
                      },
                      '&:active': {
                        backgroundColor: 'rgba(142, 45, 226, 0.12)',
                      },
                    }}
                    onClick={() => handleChatClick(chat.id)}
                  >
                    <ListItemAvatar sx={{ mr: { xs: 1.5, md: 2 } }}>
                      <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        variant="dot"
                        sx={{
                          '& .MuiBadge-badge': {
                            backgroundColor: chat.isOnline ? '#4CAF50' : '#757575',
                            width: 14,
                            height: 14,
                            borderRadius: '50%',
                            border: '3px solid rgba(45, 45, 45, 0.95)',
                            boxShadow: chat.isOnline ? '0 0 0 2px rgba(76, 175, 80, 0.3)' : 'none',
                          },
                        }}
                      >
                        <Avatar
                          src={chat.avatar}
                          sx={{
                            width: { xs: 48, md: 56 },
                            height: { xs: 48, md: 56 },
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                            filter: chat.isOnline ? 'none' : 'grayscale(20%)',
                          }}
                        />
                      </Badge>
                    </ListItemAvatar>
                    
                    <ListItemText
                      sx={{ m: 0 }}
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              color: 'white',
                              fontWeight: 600,
                              fontSize: { xs: '1rem', md: '1.1rem' },
                              lineHeight: 1.2,
                            }}
                          >
                            {chat.isGroup ? chat.name : `${chat.firstName} ${chat.lastName}`}
                          </Typography>
                          {chat.isOnline && (
                            <Chip
                              label="Online"
                              size="small"
                              sx={{
                                height: '18px',
                                fontSize: '0.65rem',
                                fontWeight: 600,
                                backgroundColor: 'rgba(76, 175, 80, 0.2)',
                                color: '#4CAF50',
                                border: '1px solid rgba(76, 175, 80, 0.4)',
                                '& .MuiChip-label': {
                                  px: 1,
                                },
                                animation: 'pulse 2s infinite',
                                '@keyframes pulse': {
                                  '0%': {
                                    boxShadow: '0 0 0 0 rgba(76, 175, 80, 0.7)',
                                  },
                                  '70%': {
                                    boxShadow: '0 0 0 4px rgba(76, 175, 80, 0)',
                                  },
                                  '100%': {
                                    boxShadow: '0 0 0 0 rgba(76, 175, 80, 0)',
                                  },
                                },
                              }}
                            />
                          )}
                          {chat.isGroup && (
                            <Chip
                              label="Group"
                              size="small"
                              sx={{
                                height: '18px',
                                fontSize: '0.65rem',
                                backgroundColor: 'rgba(156, 39, 176, 0.2)',
                                color: '#E1BEE7',
                                '& .MuiChip-label': {
                                  px: 1,
                                },
                              }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              color: 'rgba(255, 255, 255, 0.7)',
                              fontSize: { xs: '0.875rem', md: '0.9rem' },
                              lineHeight: 1.3,
                            }}
                          >
                            {chat.lastMessage}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <ScheduleIcon sx={{ 
                                fontSize: '0.875rem', 
                                color: 'rgba(255, 255, 255, 0.4)' 
                              }} />
                              <Typography
                                variant="caption"
                                sx={{
                                  color: 'rgba(255, 255, 255, 0.4)',
                                  fontSize: { xs: '0.75rem', md: '0.8rem' },
                                  fontWeight: 400,
                                }}
                              >
                                Joined {chat.timestamp}
                              </Typography>
                            </Box>
                            {!chat.isOnline && (
                              <Typography
                                variant="caption"
                                sx={{
                                  color: 'rgba(255, 255, 255, 0.5)',
                                  fontSize: { xs: '0.7rem', md: '0.75rem' },
                                  fontStyle: 'italic',
                                }}
                              >
                                {chat.lastSeen}
                              </Typography>
                            )}
                            {chat.isOnline && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                                <Box
                                  sx={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: '50%',
                                    backgroundColor: '#4CAF50',
                                    animation: 'blink 1.5s infinite',
                                    '@keyframes blink': {
                                      '0%, 50%': { opacity: 1 },
                                      '51%, 100%': { opacity: 0.3 },
                                    },
                                  }}
                                />
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: '#4CAF50',
                                    fontSize: { xs: '0.7rem', md: '0.75rem' },
                                    fontWeight: 500,
                                  }}
                                >
                                  Active now
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        </Box>
                      }
                    />
                    
                    {chat.unreadCount > 0 && (
                      <ListItemSecondaryAction>
                        <Badge
                          badgeContent={chat.unreadCount}
                          sx={{
                            '& .MuiBadge-badge': {
                              backgroundColor: '#8E2DE2',
                              color: 'white',
                              fontWeight: 600,
                              fontSize: '0.7rem',
                            },
                          }}
                        />
                      </ListItemSecondaryAction>
                    )}
                  </ListItem>
                  
                  {index < chats.length - 1 && (
                    <Divider 
                      sx={{ 
                        mx: { xs: 2, sm: 3, md: 4 },
                        borderColor: 'rgba(255, 255, 255, 0.08)',
                      }} 
                    />
                  )}
                </React.Fragment>
              ))}
            </List>
          )}

          {/* Load More Button */}
          {hasMore && chats.length > 0 && (
            <Box sx={{ 
              p: { xs: 2, sm: 3, md: 4 }, 
              pt: { xs: 3, md: 4 },
              textAlign: 'center', 
              borderTop: '1px solid rgba(255, 255, 255, 0.08)' 
            }}>
              <Button
                onClick={handleLoadMore}
                disabled={loadingMore}
                sx={{
                  backgroundColor: 'rgba(142, 45, 226, 0.15)',
                  color: '#8E2DE2',
                  border: '1px solid rgba(142, 45, 226, 0.25)',
                  px: { xs: 3, md: 4 },
                  py: { xs: 1.5, md: 2 },
                  borderRadius: 2,
                  fontWeight: 500,
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: 'rgba(142, 45, 226, 0.25)',
                    borderColor: 'rgba(142, 45, 226, 0.4)',
                  },
                  '&:disabled': {
                    color: 'rgba(142, 45, 226, 0.5)',
                    borderColor: 'rgba(142, 45, 226, 0.1)',
                  },
                }}
              >
                {loadingMore ? (
                  <>
                    <CircularProgress size={18} sx={{ color: '#8E2DE2', mr: 1 }} />
                    Loading...
                  </>
                ) : (
                  'Load More'
                )}
              </Button>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default Chats; 