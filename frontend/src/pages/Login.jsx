import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Link,
  Avatar,
  CssBaseline,
  Paper,
  IconButton,
  InputAdornment,
  Alert,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Validation schema for login
const validationSchema = yup.object({
  email: yup
    .string()
    .required('Email address is required')
    .email('Please enter a valid email address'),
  password: yup
    .string()
    .required('Password is required'),
});

const Login = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    
    try {
      const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:4000';
      const response = await axios.post(`${API_ENDPOINT}/auth/login`, {
        email: data.email,
        password: data.password,
      });
      
      if (response.status === 200) {
        // Handle successful login (store token, redirect to dashboard, etc.)
        console.log('Login successful:', response.data);
        // For now, just redirect to a dashboard or home page
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        width: '100vw',
        background: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
        p: 3,
      }}
    >
      <CssBaseline />
      <Box
        sx={{
          width: '100%',
          maxWidth: '500px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Avatar
          sx={{
            m: 1,
            bgcolor: '#8E2DE2',
            width: 60,
            height: 60,
          }}
        >
          <LockOutlinedIcon sx={{ fontSize: '2.5rem' }} />
        </Avatar>
        <Typography
          component="h1"
          variant="h4"
          sx={{ fontWeight: 'bold', color: 'white' }}
        >
          Sign in to FlowChat
        </Typography>
      </Box>

      <Paper
        elevation={12}
        sx={{
          p: 2,
          borderRadius: 6,
          width: '100%',
          maxWidth: '600px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ width: '100%' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
            {/* Email */}
            <Box sx={{ width: '80%' }}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Email Address"
                    type="email"
                    variant="outlined"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    InputLabelProps={{ 
                      style: { color: errors.email ? '#f44336' : 'rgba(255, 255, 255, 0.9)' } 
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { 
                          borderColor: errors.email ? '#f44336' : 'rgba(255, 255, 255, 0.5)' 
                        },
                        '&:hover fieldset': { 
                          borderColor: errors.email ? '#f44336' : 'rgba(255, 255, 255, 0.8)' 
                        },
                        '&.Mui-focused fieldset': { 
                          borderColor: errors.email ? '#f44336' : 'white' 
                        },
                        '& .MuiInputBase-input': { color: 'white' },
                      },
                      '& .MuiFormHelperText-root': {
                        color: '#f44336',
                      },
                    }}
                  />
                )}
              />
            </Box>

            {/* Password */}
            <Box sx={{ width: '80%' }}>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    variant="outlined"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    InputLabelProps={{ 
                      style: { color: errors.password ? '#f44336' : 'rgba(255, 255, 255, 0.9)' } 
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { 
                          borderColor: errors.password ? '#f44336' : 'rgba(255, 255, 255, 0.5)' 
                        },
                        '&:hover fieldset': { 
                          borderColor: errors.password ? '#f44336' : 'rgba(255, 255, 255, 0.8)' 
                        },
                        '&.Mui-focused fieldset': { 
                          borderColor: errors.password ? '#f44336' : 'white' 
                        },
                        '& .MuiInputBase-input': { color: 'white' },
                      },
                      '& .MuiFormHelperText-root': {
                        color: '#f44336',
                      },
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handlePasswordVisibility}
                            edge="end"
                            sx={{
                              color: 'rgba(255, 255, 255, 0.7)',
                              '&:hover': {
                                color: 'white',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              },
                            }}
                          >
                            {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Box>
          </Box>
          
          {error && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Box sx={{ width: '80%' }}>
                <Alert severity="error" sx={{ 
                  backgroundColor: 'rgba(244, 67, 54, 0.1)',
                  color: '#f44336',
                  '& .MuiAlert-icon': { color: '#f44336' }
                }}>
                  {error}
                </Alert>
              </Box>
            </Box>
          )}
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 2 }}>
            <Box sx={{ width: '80%' }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={!isValid || !isDirty || loading}
                sx={{
                  py: 1.5,
                  backgroundColor: (!isValid || !isDirty || loading) ? 'rgba(142, 45, 226, 0.4)' : '#8E2DE2',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  color: (!isValid || !isDirty || loading) ? 'rgba(255, 255, 255, 0.5)' : 'white',
                  '&:hover': {
                    backgroundColor: (!isValid || !isDirty || loading) ? 'rgba(142, 45, 226, 0.4)' : '#9A4DFF',
                  },
                  '&.Mui-disabled': {
                    backgroundColor: 'rgba(142, 45, 226, 0.4)',
                    color: 'rgba(255, 255, 255, 0.5)',
                  },
                }}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </Box>
          </Box>
          
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link 
                component="button" 
                variant="body2" 
                sx={{ color: 'white', textDecoration: 'none' }}
                onClick={() => navigate('/register')}
              >
                Don't have an account? Sign up
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login; 