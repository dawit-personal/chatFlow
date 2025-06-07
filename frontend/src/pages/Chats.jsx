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
} from '@mui/material';
import MessageIcon from '@mui/icons-material/Message';
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
        const transformedChats = response.data.data.map(chat => ({
          id: chat.id,
          name: chat.name || `Chat ${chat.id}`,
          lastMessage: 'No messages yet', // API doesn't provide this
          timestamp: new Date(chat.createdAt).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          unreadCount: 0, // API doesn't provide this
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${chat.name || chat.id}&backgroundColor=8E2DE2`,
          isOnline: false, // API doesn't provide this
          isGroup: chat.isGroup || false,
          userId: chat.userId,
          createdAt: chat.createdAt,
          updatedAt: chat.updatedAt,
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

  const handleChatClick = (chatId) => {
    // Navigate to individual chat (placeholder for now)
    console.log(`Opening chat ${chatId}`);
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
        <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
          {chats.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                No chats found
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                Start a conversation to see your chats here
              </Typography>
            </Box>
          ) : (
            <List sx={{ width: '100%', bgcolor: 'transparent', p: 0 }}>
              {chats.map((chat) => (
                <ListItem
                  key={chat.id}
                  sx={{
                    backgroundColor: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 2,
                    mb: 2,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(142, 45, 226, 0.1)',
                      borderColor: 'rgba(142, 45, 226, 0.3)',
                    },
                  }}
                  onClick={() => handleChatClick(chat.id)}
                >
                  <ListItemAvatar>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      variant="dot"
                      sx={{
                        '& .MuiBadge-badge': {
                          backgroundColor: chat.isOnline ? '#4CAF50' : 'transparent',
                          color: '#4CAF50',
                          '&::after': {
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            border: '1px solid currentColor',
                            content: '""',
                          },
                        },
                      }}
                    >
                      <Avatar
                        src={chat.avatar}
                        sx={{
                          width: { xs: 45, md: 60 },
                          height: { xs: 45, md: 60 },
                          border: '2px solid rgba(255, 255, 255, 0.1)',
                        }}
                      />
                    </Badge>
                  </ListItemAvatar>
                  
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            color: 'white',
                            fontWeight: chat.unreadCount > 0 ? 'bold' : 'normal',
                            fontSize: { xs: '0.9rem', md: '1.1rem' },
                          }}
                        >
                          {chat.name}
                        </Typography>
                        {chat.isGroup && (
                          <Chip
                            label="Group"
                            size="small"
                            sx={{
                              height: '20px',
                              fontSize: '0.7rem',
                              backgroundColor: 'rgba(156, 39, 176, 0.3)',
                              color: '#E1BEE7',
                            }}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: { xs: '0.75rem', md: '0.875rem' },
                            fontWeight: chat.unreadCount > 0 ? 'bold' : 'normal',
                          }}
                        >
                          {chat.lastMessage}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'rgba(255, 255, 255, 0.5)',
                            fontSize: { xs: '0.65rem', md: '0.75rem' },
                            ml: 1,
                          }}
                        >
                          {chat.timestamp}
                        </Typography>
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
                            fontWeight: 'bold',
                          },
                        }}
                      >
                        <Box sx={{ width: 20, height: 20 }} />
                      </Badge>
                    </ListItemSecondaryAction>
                  )}
                </ListItem>
              ))}
            </List>
          )}

          {/* Load More Button */}
          {hasMore && chats.length > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 3 }}>
              <Button
                onClick={handleLoadMore}
                disabled={loadingMore}
                sx={{
                  backgroundColor: 'rgba(142, 45, 226, 0.2)',
                  color: '#8E2DE2',
                  border: '1px solid rgba(142, 45, 226, 0.3)',
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  '&:hover': {
                    backgroundColor: 'rgba(142, 45, 226, 0.3)',
                  },
                  '&:disabled': {
                    color: 'rgba(142, 45, 226, 0.5)',
                  },
                }}
              >
                {loadingMore ? (
                  <>
                    <CircularProgress size={20} sx={{ color: '#8E2DE2', mr: 1 }} />
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