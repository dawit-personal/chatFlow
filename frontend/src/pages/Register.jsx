import React from 'react';
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
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'; // A classic, professional icon

const Register = () => {
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
        <Box component="form" noValidate sx={{ width: '100%' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
            {/* Personal Information First - Best Practice */}
            <Box sx={{ width: '80%' }}>
              <TextField name="firstName" required fullWidth id="firstName" label="First Name" variant="outlined" InputLabelProps={{ style: { color: 'rgba(255, 255, 255, 0.9)' } }} sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' }, '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.8)' }, '&.Mui-focused fieldset': { borderColor: 'white' }, '& .MuiInputBase-input': { color: 'white' }, }, }} />
            </Box>
            
            <Box sx={{ width: '80%' }}>
              <TextField name="lastName" required fullWidth id="lastName" label="Last Name" variant="outlined" InputLabelProps={{ style: { color: 'rgba(255, 255, 255, 0.9)' } }} sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' }, '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.8)' }, '&.Mui-focused fieldset': { borderColor: 'white' }, '& .MuiInputBase-input': { color: 'white' }, }, }} />
            </Box>
            
            {/* Login Credentials */}
            <Box sx={{ width: '80%' }}>
              <TextField name="email" required fullWidth id="email" label="Email Address" autoComplete="email" variant="outlined" InputLabelProps={{ style: { color: 'rgba(255, 255, 255, 0.9)' } }} sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' }, '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.8)' }, '&.Mui-focused fieldset': { borderColor: 'white' }, '& .MuiInputBase-input': { color: 'white' }, }, }} />
            </Box>
            
            <Box sx={{ width: '80%' }}>
              <TextField name="password" required fullWidth id="password" label="Password" type="password" variant="outlined" InputLabelProps={{ style: { color: 'rgba(255, 255, 255, 0.9)' } }} sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' }, '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.8)' }, '&.Mui-focused fieldset': { borderColor: 'white' }, '& .MuiInputBase-input': { color: 'white' }, }, }} />
            </Box>
            
            <Box sx={{ width: '80%' }}>
              <TextField name="confirmPassword" required fullWidth id="confirmPassword" label="Confirm Password" type="password" variant="outlined" InputLabelProps={{ style: { color: 'rgba(255, 255, 255, 0.9)' } }} sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' }, '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.8)' }, '&.Mui-focused fieldset': { borderColor: 'white' }, '& .MuiInputBase-input': { color: 'white' }, }, }} />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 2 }}>
            <Box sx={{ width: '80%' }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  py: 1.5,
                  backgroundColor: '#8E2DE2',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: '#9A4DFF',
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
