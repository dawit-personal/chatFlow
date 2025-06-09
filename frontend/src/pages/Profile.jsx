import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Paper,
  Divider,
  Grid,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { useChat } from '../context/chatContext';
import axios from 'axios';

const Profile = () => {
  const navigate = useNavigate();
  const { accessToken, logout } = useAuth();
  const { disconnectSocket } = useChat();
  
  // State for user data and loading
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Check if access token is available from auth context
        if (!accessToken) {
          setError('No access token found. Please log in again.');
          navigate('/login');
          return;
        }

        const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:4000';
        const response = await axios.get(`${API_ENDPOINT}/users/me`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.data && response.data.user) {
          // Transform API data to match our component structure
          const user = response.data.user;
          const transformedData = {
            firstName: user.firstName || 'N/A',
            lastName: user.lastName || 'N/A', 
            email: user['user.email'] || 'Not available',
            avatar: user.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.firstName || 'User'}&backgroundColor=8E2DE2`,
            joinDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A',
            status: 'Active',
            profileId: user.profileId,
            userId: user.userId,
          };
          setUserData(transformedData);
        } else {
          setError('Invalid response format from server.');
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        if (error.response?.status === 401) {
          setError('Session expired. Please log in again.');
          navigate('/login');
        } else {
          setError('Failed to load user data. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, accessToken]);

  // Logout handler
  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:4000';
      await axios.post(
        `${API_ENDPOINT}/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (error) {
      // Even if logout fails, clear local state
      console.error('Logout request failed:', error);
    } finally {
      disconnectSocket(); // Disconnect socket on logout
      logout(); // Clear token from context/localStorage
      setLoggingOut(false);
      navigate('/login');
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

  // Main component render (only if userData exists)
  if (!userData) {
    return null;
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
          maxWidth: { xs: '100%', sm: '95%', md: '900px' },
          minHeight: { xs: '100vh', sm: '600px' },
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
            height: { xs: '200px', md: '200px' },
            position: 'relative',
            display: 'flex',
            alignItems: 'flex-end',
            px: { xs: 1, sm: 2, md: 4 },
            pb: { xs: 2, md: 3 },
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'center', sm: 'center' }, 
            gap: { xs: 1, sm: 3 },
            width: '100%'
          }}>
            <Avatar
              src={userData.avatar}
              sx={{
                width: { xs: 70, sm: 100, md: 120 },
                height: { xs: 70, sm: 100, md: 120 },
                border: '4px solid white',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              }}
            />
            <Box sx={{ textAlign: { xs: 'center', sm: 'left' }, px: { xs: 0.5, sm: 0 } }}>
              <Typography
                variant="h3"
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  fontSize: { xs: '1.3rem', sm: '2rem', md: '2.5rem' },
                  mb: { xs: 0.5, md: 1 },
                }}
              >
                {userData.firstName} {userData.lastName}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', sm: 'flex-start' }, gap: 1 }}>
                <EmailIcon sx={{ color: 'rgba(255,255,255,0.9)', fontSize: { xs: '0.9rem', md: '1.2rem' } }} />
                <Typography
                  variant="h6"
                  sx={{
                    color: 'rgba(255,255,255,0.9)',
                    fontWeight: 400,
                    fontSize: { xs: '0.75rem', sm: '1rem', md: '1.1rem' },
                  }}
                >
                  {userData.email}
                </Typography>
              </Box>
            </Box>
          </Box>
          
          {/* Logout Button */}
          <IconButton
            sx={{
              position: 'absolute',
              top: { xs: 10, md: 20 },
              right: { xs: 60, md: 70 },
              color: 'white',
              backgroundColor: 'rgba(244,67,54,0.7)',
              ml: 1,
              '&:hover': {
                backgroundColor: 'rgba(244,67,54,0.9)',
              },
            }}
            onClick={handleLogout}
            disabled={loggingOut}
            title="Logout"
          >
            {loggingOut ? <CircularProgress size={22} sx={{ color: 'white' }} /> : <LogoutIcon />}
          </IconButton>
        </Box>

        {/* Content Section */}
        <Box sx={{ 
          p: { xs: 1, sm: 2, md: 4 }, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <Grid container spacing={{ xs: 1, sm: 2, md: 4 }} sx={{ width: '100%', maxWidth: '100%' }}>
            {/* Personal Information */}
            <Grid item xs={12} md={6} sx={{ width: '100%' }}>
              <Paper
                elevation={2}
                sx={{
                  p: { xs: 1.5, sm: 2, md: 3 },
                  borderRadius: 3,
                  backgroundColor: 'transparent',
                  border: '2px solid rgba(142, 45, 226, 0.3)',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 }, mb: { xs: 1.5, md: 3 } }}>
                  <PersonIcon sx={{ color: '#8E2DE2', fontSize: { xs: '1rem', md: '1.5rem' } }} />
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 'bold',
                      color: 'white',
                      fontSize: { xs: '0.95rem', sm: '1.1rem', md: '1.5rem' },
                    }}
                  >
                    Personal Information
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1, md: 2 } }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 'bold', fontSize: { xs: '0.7rem', md: '0.875rem' } }}>
                      First Name
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'white', fontSize: { xs: '0.85rem', md: '1.1rem' } }}>
                      {userData.firstName}
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ opacity: 0.3, backgroundColor: 'rgba(255,255,255,0.2)' }} />
                  
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 'bold', fontSize: { xs: '0.7rem', md: '0.875rem' } }}>
                      Last Name
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'white', fontSize: { xs: '0.85rem', md: '1.1rem' } }}>
                      {userData.lastName}
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ opacity: 0.3, backgroundColor: 'rgba(255,255,255,0.2)' }} />
                  
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 'bold', fontSize: { xs: '0.7rem', md: '0.875rem' } }}>
                      Email Address
                    </Typography>
                    <Typography variant="body1" sx={{ 
                      color: 'white', 
                      fontSize: { xs: '0.75rem', sm: '0.85rem', md: '1.1rem' }, 
                      wordBreak: 'break-all',
                      overflowWrap: 'break-word'
                    }}>
                      {userData.email}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* Account Information */}
            <Grid item xs={12} md={6} sx={{ width: '100%' }}>
              <Paper
                elevation={2}
                sx={{
                  p: { xs: 1.5, sm: 2, md: 3 },
                  borderRadius: 3,
                  backgroundColor: 'transparent',
                  border: '2px solid rgba(74, 0, 224, 0.3)',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 'bold',
                    color: 'white',
                    mb: { xs: 1.5, md: 3 },
                    fontSize: { xs: '0.95rem', sm: '1.1rem', md: '1.5rem' },
                  }}
                >
                  Account Details
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1, md: 2 } }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 'bold', fontSize: { xs: '0.7rem', md: '0.875rem' } }}>
                      Member Since
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'white', fontSize: { xs: '0.85rem', md: '1.1rem' } }}>
                      {userData.joinDate}
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ opacity: 0.3, backgroundColor: 'rgba(255,255,255,0.2)' }} />
                  
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 'bold', fontSize: { xs: '0.7rem', md: '0.875rem' } }}>
                      Account Status
                    </Typography>
                    <Chip
                      label={userData.status}
                      sx={{
                        mt: 1,
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: { xs: '0.7rem', md: '0.875rem' },
                        height: { xs: '24px', md: '32px' },
                      }}
                    />
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* Action Button */}
          <Box sx={{ 
            mt: { xs: 1.5, md: 4 }, 
            px: { xs: 1, sm: 0 },
            pb: { xs: 1.5, md: 0 },
            width: '100%',
            display: 'flex',
            justifyContent: 'center'
          }}>
            <Box
              component="button"
              onClick={() => navigate('/dashboard')}
              sx={{
                px: { xs: 2, md: 4 },
                py: { xs: 1, md: 2 },
                backgroundColor: '#8E2DE2',
                color: 'white',
                border: 'none',
                borderRadius: 3,
                fontSize: { xs: '0.8rem', md: '1rem' },
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                minWidth: { xs: '120px', md: '200px' },
                width: { xs: '70%', sm: 'auto' },
                maxWidth: { xs: '250px', md: '300px' },
                '&:hover': {
                  backgroundColor: '#9A4DFF',
                  boxShadow: '0 8px 25px rgba(142, 45, 226, 0.3)',
                },
              }}
            >
              Back to Chat
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Profile; 