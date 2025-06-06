import React, { useState, useEffect } from 'react';
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
  Divider,
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

// Validation schema
const validationSchema = yup.object({
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters'),
  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters'),
  email: yup
    .string()
    .required('Email address is required')
    .email('Please enter a valid email address'),
  password: yup
    .string()
    .required('Password is required')
    .min(12, 'Password must be at least 12 characters long')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};"':\\|,.<>/?]).*$/,
      'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character (e.g., !@#$%^&*)'
    ),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
});

const Register = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    clearErrors,
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onTouched',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasInteracted, setHasInteracted] = useState(false);

  // Reset form state when component mounts to prevent validation errors from persisting
  useEffect(() => {
    reset();
    clearErrors();
    setError('');
    setHasInteracted(false);
  }, [reset, clearErrors]);

  // Handle form interaction to enable validation after first touch
  const handleFormInteraction = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
    }
  };

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    clearErrors(); // Clear form validation errors before submission
    
    try {
      const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:4000';
      const response = await axios.post(`${API_ENDPOINT}/auth/register`, {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      
      if (response.status === 201 || response.status === 200) {
        // Use setTimeout to ensure clean redirect without validation flash
        setTimeout(() => {
          navigate('/login');
        }, 0);
        return;
      }
    } catch (error) {
      console.error('Registration failed:', error);
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
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
          Create your FlowChat account
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
            <Box sx={{ width: '80%' }}>
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="First Name"
                    variant="outlined"
                    onFocus={handleFormInteraction}
                    error={hasInteracted && !!errors.firstName}
                    helperText={hasInteracted && errors.firstName?.message}
                    InputLabelProps={{ 
                      style: { color: (hasInteracted && errors.firstName) ? '#f44336' : 'rgba(255, 255, 255, 0.9)' } 
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { 
                          borderColor: (hasInteracted && errors.firstName) ? '#f44336' : 'rgba(255, 255, 255, 0.5)' 
                        },
                        '&:hover fieldset': { 
                          borderColor: (hasInteracted && errors.firstName) ? '#f44336' : 'rgba(255, 255, 255, 0.8)' 
                        },
                        '&.Mui-focused fieldset': { 
                          borderColor: (hasInteracted && errors.firstName) ? '#f44336' : 'white' 
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
            
            <Box sx={{ width: '80%' }}>
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Last Name"
                    variant="outlined"
                    onFocus={handleFormInteraction}
                    error={hasInteracted && !!errors.lastName}
                    helperText={hasInteracted && errors.lastName?.message}
                    InputLabelProps={{ 
                      style: { color: (hasInteracted && errors.lastName) ? '#f44336' : 'rgba(255, 255, 255, 0.9)' } 
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { 
                          borderColor: (hasInteracted && errors.lastName) ? '#f44336' : 'rgba(255, 255, 255, 0.5)' 
                        },
                        '&:hover fieldset': { 
                          borderColor: (hasInteracted && errors.lastName) ? '#f44336' : 'rgba(255, 255, 255, 0.8)' 
                        },
                        '&.Mui-focused fieldset': { 
                          borderColor: (hasInteracted && errors.lastName) ? '#f44336' : 'white' 
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
                    onFocus={handleFormInteraction}
                    error={hasInteracted && !!errors.email}
                    helperText={hasInteracted && errors.email?.message}
                    InputLabelProps={{ 
                      style: { color: (hasInteracted && errors.email) ? '#f44336' : 'rgba(255, 255, 255, 0.9)' } 
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { 
                          borderColor: (hasInteracted && errors.email) ? '#f44336' : 'rgba(255, 255, 255, 0.5)' 
                        },
                        '&:hover fieldset': { 
                          borderColor: (hasInteracted && errors.email) ? '#f44336' : 'rgba(255, 255, 255, 0.8)' 
                        },
                        '&.Mui-focused fieldset': { 
                          borderColor: (hasInteracted && errors.email) ? '#f44336' : 'white' 
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
                    onFocus={handleFormInteraction}
                    error={hasInteracted && !!errors.password}
                    helperText={hasInteracted && errors.password?.message}
                    InputLabelProps={{ 
                      style: { color: (hasInteracted && errors.password) ? '#f44336' : 'rgba(255, 255, 255, 0.9)' } 
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { 
                          borderColor: (hasInteracted && errors.password) ? '#f44336' : 'rgba(255, 255, 255, 0.5)' 
                        },
                        '&:hover fieldset': { 
                          borderColor: (hasInteracted && errors.password) ? '#f44336' : 'rgba(255, 255, 255, 0.8)' 
                        },
                        '&.Mui-focused fieldset': { 
                          borderColor: (hasInteracted && errors.password) ? '#f44336' : 'white' 
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
            
            <Box sx={{ width: '80%' }}>
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    variant="outlined"
                    onFocus={handleFormInteraction}
                    error={hasInteracted && !!errors.confirmPassword}
                    helperText={hasInteracted && errors.confirmPassword?.message}
                    InputLabelProps={{ 
                      style: { color: (hasInteracted && errors.confirmPassword) ? '#f44336' : 'rgba(255, 255, 255, 0.9)' } 
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { 
                          borderColor: (hasInteracted && errors.confirmPassword) ? '#f44336' : 'rgba(255, 255, 255, 0.5)' 
                        },
                        '&:hover fieldset': { 
                          borderColor: (hasInteracted && errors.confirmPassword) ? '#f44336' : 'rgba(255, 255, 255, 0.8)' 
                        },
                        '&.Mui-focused fieldset': { 
                          borderColor: (hasInteracted && errors.confirmPassword) ? '#f44336' : 'white' 
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
                            onClick={handleConfirmPasswordVisibility}
                            edge="end"
                            sx={{
                              color: 'rgba(255, 255, 255, 0.7)',
                              '&:hover': {
                                color: 'white',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              },
                            }}
                          >
                            {showConfirmPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
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
                {loading ? 'Creating Account...' : 'Sign Up'}
              </Button>
            </Box>
          </Box>
          
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link 
                component="button" 
                variant="body2" 
                sx={{ color: 'white', textDecoration: 'none' }}
                onClick={() => navigate('/login')}
              >
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default Register;
