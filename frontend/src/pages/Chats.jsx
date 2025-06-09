import React, { useState, useEffect, useRef } from 'react';
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
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
} from '@mui/material';
import { 
  Message as MessageIcon, 
  Schedule as ScheduleIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  ChatBubble as ChatBubbleIcon,
  GroupAdd as GroupAddIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { useChat } from '../context/chatContext';
import axios from 'axios';

const Chats = () => {
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const { isConnected, onlineUsers } = useChat();
  
  // State management
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [pageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);
  
  // Search timeout ref for debouncing
  const searchTimeoutRef = useRef(null);

  // Create the isUserOnline function locally
  const isUserOnline = (userId) => {
    return onlineUsers.has(userId);
  };

  // Search users via API
  const searchUsers = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearchMode(false);
      return;
    }

    setSearchLoading(true);
    setIsSearchMode(true);

    try {
      const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:4000';
      
      const response = await axios.post(`${API_ENDPOINT}/users/search`, {
        firstName: query.trim()
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.data) {
        // Transform search results to include additional display info
        const transformedResults = response.data.map((user, index) => ({
          id: `search-${index}`, // Temporary ID for React keys
          firstName: user.firstName || 'Unknown',
          userId: user.userId, // Extract userId from API response
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.firstName || 'User'}&backgroundColor=8E2DE2`,
          isOnline: user.userId ? isUserOnline(user.userId) : false,
          isSearchResult: true,
        }));
        
        setSearchResults(transformedResults);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Failed to search users:', error);
      setSearchResults([]);
      setError('Failed to search users. Please try again.');
    } finally {
      setSearchLoading(false);
    }
  };

  // Filter chats based on search query (for existing chats)
  const filteredChats = chats.filter(chat => {
    if (!searchQuery.trim() || isSearchMode) return true;
    
    const searchTerm = searchQuery.toLowerCase().trim();
    const firstName = chat.firstName?.toLowerCase() || '';
    const lastName = chat.lastName?.toLowerCase() || '';
    const fullName = `${firstName} ${lastName}`.toLowerCase();
    
    return firstName.includes(searchTerm) || 
           lastName.includes(searchTerm) || 
           fullName.includes(searchTerm);
  });

  // Handle search input change
  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    
    // Debounce the API call
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      searchUsers(query);
    }, 500); // Wait 500ms after user stops typing
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchMode(false);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
  };

  // Handle find button click
  const handleFindClick = () => {
    if (searchQuery.trim()) {
      searchUsers(searchQuery);
    } else {
      // Focus the search input when find button is clicked
      const searchInput = document.querySelector('input[placeholder="Search users by name..."]');
      if (searchInput) {
        searchInput.focus();
      }
    }
  };

  // Handle adding a user (start a conversation)
  const handleAddUser = async (user) => {
    try {
      console.log('Starting conversation with user:', {
        firstName: user.firstName,
        userId: user.userId
      });

      if (!accessToken) {
        setError('No access token found. Please log in again.');
        navigate('/login');
        return;
      }

      const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:4000';
      
      // Create new conversation
      const response = await axios.post(`${API_ENDPOINT}/conversations`, {
        isGroup: false,
        name: `${user.firstName}_chat`,
        participantId: user.userId,
        message: `Hello ${user.firstName}`
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Conversation created:', response.data);

      // Navigate to the new chat
      if (response.data && response.data.chatId) {
        navigate(`/message/${response.data.chatId}`);
      } else if (response.data && response.data.id) {
        navigate(`/message/${response.data.id}`);
      } else {
        // If response structure is different, refresh chats and navigate to chats page
        console.log('Chat created successfully, refreshing chat list');
        fetchChats(1);
        navigate('/chats');
      }

    } catch (error) {
      console.error('Failed to start conversation:', error);
      if (error.response?.status === 401) {
        setError('Session expired. Please log in again.');
        navigate('/login');
      } else {
        setError(`Failed to start conversation with ${user.firstName}. Please try again.`);
      }
    }
  };

  // Determine what to display
  const displayData = isSearchMode ? searchResults : filteredChats;
  const displayCount = isSearchMode ? searchResults.length : filteredChats.length;

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
      //const offset = (pageNum - 1) * pageSize;
      
      
      const response = await axios.get(`${API_ENDPOINT}/conversations?page=${pageNum}&pageSize=${pageSize}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log('🔄 response', response.data);

      if (response.data && response.data.data) {
        // Transform API data to match UI expectations
        const transformedChats = response.data.data.map(chat => {
          if (chat.isGroup) {
            // Group chat
            return {
              id: chat.id || chat.chatId, // Use id for group, fallback to chatId
              name: chat.name || 'Group Chat',
              isGroup: true,
              avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(chat.name || 'Group')}&backgroundColor=8E2DE2`,
              lastMessage: 'No messages yet',
              timestamp: 'N/A',
              unreadCount: 0,
              isOnline: false,
              lastSeen: '',
            };
          } else {
            // 1:1 chat
            return {
              id: chat.chatId, // Use chatId as the main identifier for navigation
              memberId: chat.id, // Keep member ID if needed
              name: `Chat ${chat.chatId}`,
              firstName: chat.user?.profile?.firstName || 'Unknown',
              lastName: chat.user?.profile?.lastName || 'User',
              email: chat.user?.email || 'No email',
              lastMessage: 'No messages yet',
              timestamp: chat.joinedAt ? new Date(chat.joinedAt).toLocaleString('en-US', { 
                month: 'short', 
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              }) : 'Invalid Date',
              joinedAt: chat.joinedAt,
              unreadCount: 0, // API doesn't provide this
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${chat.user?.profile?.firstName || 'User'}&backgroundColor=8E2DE2`,
              isOnline: isUserOnline(chat.userId), // Use real online status from chat context
              lastSeen: isUserOnline(chat.userId) ? 'Active now' : 'Last seen recently', // Real status-based message
              isGroup: false, // This endpoint seems to return individual chat members
              userId: chat.userId,
              user: chat.user, // Keep full user object if needed
            };
          }
        });

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

      console.log(`Opening chat ${chatId}`);
      
      // Navigate to message page
      navigate(`/message/${chatId}`);
      
    } catch (error) {
      console.error('Failed to navigate to chat:', error);
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
              Chats ({displayCount})
            </Typography>
          </Box>
          
          {/* Connection Status Indicator and Create Group Button */}
          <Box sx={{ 
            position: 'absolute', 
            top: { xs: 10, md: 20 }, 
            right: { xs: 10, md: 20 },
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: isConnected ? '#4CAF50' : '#f44336',
                animation: isConnected ? 'pulse 2s infinite' : 'none',
                '@keyframes pulse': {
                  '0%': { opacity: 1 },
                  '50%': { opacity: 0.5 },
                  '100%': { opacity: 1 },
                },
              }}
            />
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'white', 
                fontSize: '0.7rem',
                opacity: 0.9,
              }}
            >
              {isConnected ? 'Online' : 'Connecting...'}
            </Typography>
            <Tooltip title="Create Group Chat">
              <IconButton color="secondary" onClick={() => navigate('/create-group')}>
                <GroupAddIcon sx={{ color: 'white' }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Search Section */}
        <Box sx={{ 
          p: { xs: 2, sm: 3, md: 4 }, 
          pb: { xs: 1, sm: 2, md: 2 },
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)' 
        }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <TextField
              fullWidth
              placeholder="Search users by name..."
              value={searchQuery}
              onChange={handleSearchChange}
              variant="outlined"
              size="medium"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <Button
                      onClick={handleClearSearch}
                      sx={{ 
                        minWidth: 'auto', 
                        p: 0.5,
                        color: 'rgba(255, 255, 255, 0.5)',
                        '&:hover': {
                          color: 'rgba(255, 255, 255, 0.8)',
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        }
                      }}
                    >
                      <ClearIcon fontSize="small" />
                    </Button>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: 2,
                  '& fieldset': {
                    borderColor: 'rgba(142, 45, 226, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(142, 45, 226, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#8E2DE2',
                    borderWidth: 2,
                  },
                },
                '& .MuiOutlinedInput-input': {
                  color: 'white',
                  fontSize: '1rem',
                  '&::placeholder': {
                    color: 'rgba(255, 255, 255, 0.5)',
                    opacity: 1,
                  },
                },
              }}
            />
            
            {/* Find Button */}
            <Button
              variant="contained"
              sx={{
                minWidth: '56px',
                height: '56px',
                borderRadius: 2,
                background: 'linear-gradient(135deg, #8E2DE2 0%, #4A148C 100%)',
                boxShadow: '0 4px 12px rgba(142, 45, 226, 0.3)',
                border: '1px solid rgba(142, 45, 226, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #9C27B0 0%, #6A1B9A 100%)',
                  boxShadow: '0 6px 16px rgba(142, 45, 226, 0.4)',
                  transform: 'translateY(-1px)',
                },
                '&:active': {
                  transform: 'translateY(0px)',
                  boxShadow: '0 2px 8px rgba(142, 45, 226, 0.3)',
                },
                transition: 'all 0.2s ease',
              }}
              onClick={handleFindClick}
            >
              <SearchIcon sx={{ 
                color: 'white', 
                fontSize: '1.5rem',
                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
              }} />
            </Button>
          </Box>
          
          {searchQuery && (
            <Typography
              variant="caption"
              sx={{
                color: 'rgba(255, 255, 255, 0.6)',
                mt: 1,
                display: 'block',
                fontSize: '0.75rem',
              }}
            >
              {displayCount} user{displayCount !== 1 ? 's' : ''} found
            </Typography>
          )}
        </Box>

        {/* Chats List */}
        <Box sx={{ p: 0 }}>
          {searchLoading ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <CircularProgress size={40} sx={{ color: '#8E2DE2', mb: 2 }} />
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Searching users...
              </Typography>
            </Box>
          ) : displayData.length === 0 && !loading ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                {searchQuery ? 'No users found' : 'No chats found'}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                {searchQuery 
                  ? `Try searching for a different name` 
                  : 'Start a conversation to see your chats here'
                }
              </Typography>
            </Box>
          ) : (
            <List sx={{ width: '100%', bgcolor: 'transparent', p: 0 }}>
              {displayData.map((chat, index) => (
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
                    onClick={chat.isSearchResult ? undefined : () => handleChatClick(chat.id)}
                  >
                    <ListItemAvatar sx={{ mr: { xs: 1.5, md: 2 } }}>
                      <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        variant="dot"
                        sx={{
                          '& .MuiBadge-badge': {
                            backgroundColor: chat.isGroup ? '#8E2DE2' : (chat.isOnline ? '#4CAF50' : '#757575'),
                            width: 14,
                            height: 14,
                            borderRadius: '50%',
                            border: '3px solid rgba(45, 45, 45, 0.95)',
                            boxShadow: chat.isGroup ? '0 0 0 2px rgba(142, 45, 226, 0.3)' : (chat.isOnline ? '0 0 0 2px rgba(76, 175, 80, 0.3)' : 'none'),
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
                            backgroundColor: chat.isGroup ? '#8E2DE2' : undefined,
                          }}
                        >
                          {chat.isGroup ? <GroupAddIcon sx={{ color: 'white' }} /> : null}
                        </Avatar>
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
                            {chat.isSearchResult ? chat.firstName : (chat.isGroup ? chat.name : `${chat.firstName} ${chat.lastName}`)}
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
                                ml: 1,
                              }}
                            />
                          )}
                          {chat.isSearchResult && (
                            <Chip
                              label="Search Result"
                              size="small"
                              sx={{
                                height: '18px',
                                fontSize: '0.65rem',
                                backgroundColor: 'rgba(33, 150, 243, 0.2)',
                                color: '#42A5F5',
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
                            {chat.isSearchResult ? 'Click Add to start a conversation' : chat.lastMessage}
                          </Typography>
                          {!chat.isSearchResult && (
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
                          )}
                        </Box>
                      }
                    />
                    
                    {/* Add button for search results, unread count for existing chats */}
                    {chat.isSearchResult ? (
                      <ListItemSecondaryAction>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleAddUser(chat)}
                          sx={{
                            background: 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)',
                            color: 'white',
                            fontWeight: 600,
                            textTransform: 'none',
                            borderRadius: 2,
                            px: 2,
                            py: 1,
                            minWidth: '100px',
                            boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #66BB6A 0%, #4CAF50 100%)',
                              boxShadow: '0 4px 12px rgba(76, 175, 80, 0.4)',
                              transform: 'translateY(-1px)',
                            },
                            '&:active': {
                              transform: 'translateY(0px)',
                            },
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <ChatBubbleIcon sx={{ fontSize: '1rem', mr: 0.5 }} />
                          Start Chat
                        </Button>
                      </ListItemSecondaryAction>
                    ) : (
                      chat.unreadCount > 0 && (
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
                      )
                    )}
                  </ListItem>
                  
                  {index < displayData.length - 1 && (
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

          {/* Load More Button - only show for existing chats, not search results */}
          {!isSearchMode && hasMore && displayData.length > 0 && (
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