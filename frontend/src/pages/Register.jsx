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
  Divider,
  IconButton,
  InputAdornment,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'; // A classic, professional icon
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

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
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};"':\\|,.<>\/?]).*$/,
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
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onChange', // Validate on change for real-time feedback
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data) => {
    console.log('Form data:', data);
    // Handle form submission here
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
        background: 'linear-gradient(135deg, #232526 0%, #414345 100%)', // Elegant black and gray gradient
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
          mb: 4, // Add some margin to the bottom
        }}
      >
        <Avatar
          sx={{
            m: 1,
            bgcolor: '#8E2DE2', // A vibrant purple accent
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
          p: 2, // Reduced padding for more field space
          borderRadius: 6,
          width: '100%',
          maxWidth: '600px', // Increased width for better text field display
          // Frosted glass effect with a border
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ width: '100%' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
            {/* Personal Information First - Best Practice */}
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
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                    InputLabelProps={{ 
                      style: { color: errors.firstName ? '#f44336' : 'rgba(255, 255, 255, 0.9)' } 
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { 
                          borderColor: errors.firstName ? '#f44336' : 'rgba(255, 255, 255, 0.5)' 
                        },
                        '&:hover fieldset': { 
                          borderColor: errors.firstName ? '#f44336' : 'rgba(255, 255, 255, 0.8)' 
                        },
                        '&.Mui-focused fieldset': { 
                          borderColor: errors.firstName ? '#f44336' : 'white' 
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
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                    InputLabelProps={{ 
                      style: { color: errors.lastName ? '#f44336' : 'rgba(255, 255, 255, 0.9)' } 
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { 
                          borderColor: errors.lastName ? '#f44336' : 'rgba(255, 255, 255, 0.5)' 
                        },
                        '&:hover fieldset': { 
                          borderColor: errors.lastName ? '#f44336' : 'rgba(255, 255, 255, 0.8)' 
                        },
                        '&.Mui-focused fieldset': { 
                          borderColor: errors.lastName ? '#f44336' : 'white' 
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
            
            {/* Login Credentials */}
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
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                    InputLabelProps={{ 
                      style: { color: errors.confirmPassword ? '#f44336' : 'rgba(255, 255, 255, 0.9)' } 
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { 
                          borderColor: errors.confirmPassword ? '#f44336' : 'rgba(255, 255, 255, 0.5)' 
                        },
                        '&:hover fieldset': { 
                          borderColor: errors.confirmPassword ? '#f44336' : 'rgba(255, 255, 255, 0.8)' 
                        },
                        '&.Mui-focused fieldset': { 
                          borderColor: errors.confirmPassword ? '#f44336' : 'white' 
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
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 2 }}>
            <Box sx={{ width: '80%' }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={!isValid || !isDirty}
                sx={{
                  py: 1.5,
                  backgroundColor: !isValid || !isDirty ? 'rgba(142, 45, 226, 0.4)' : '#8E2DE2',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  color: !isValid || !isDirty ? 'rgba(255, 255, 255, 0.5)' : 'white',
                  '&:hover': {
                    backgroundColor: !isValid || !isDirty ? 'rgba(142, 45, 226, 0.4)' : '#9A4DFF',
                  },
                  '&.Mui-disabled': {
                    backgroundColor: 'rgba(142, 45, 226, 0.4)',
                    color: 'rgba(255, 255, 255, 0.5)',
                  },
                }}
              >
                Sign Up
              </Button>
            </Box>
          </Box>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="#" variant="body2" sx={{ color: 'white' }}>
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
