import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/authContext';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Chats from './pages/Chats';
import Message from './pages/Message';
import CreateGroupName from './pages/CreateGroupName';
import CreateGroupParticipants from './pages/CreateGroupParticipants';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { useChat } from './context/chatContext';
import LogoutIcon from '@mui/icons-material/Logout';

// Protected Route Component
function ProtectedRoute({ children }) {
  const { accessToken } = useAuth();
  
  // If no access token, redirect to login
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }
  
  // If authenticated, render the protected component
  return children;
}

// Public Route Component (for login/register when already authenticated)
function PublicRoute({ children }) {
  const { accessToken } = useAuth();
  
  console.log('PublicRoute check:', { accessToken: accessToken ? 'exists' : 'null' });
  
  // If already authenticated, redirect to profile
  if (accessToken) {
    console.log('Redirecting to profile because access token exists');
    return <Navigate to="/profile" replace />;
  }
  
  console.log('Rendering public route (login/register)');
  // If not authenticated, render the public component
  return children;
}

function App() {
  const { accessToken, logout } = useAuth();
  const { disconnectSocket } = useChat ? useChat() : { disconnectSocket: () => {} };
  const navigate = useNavigate();
  const location = useLocation();

  // Logout handler for navbar
  const handleLogout = () => {
    disconnectSocket && disconnectSocket();
    logout && logout();
    navigate('/login');
  };

  // Show navbar only for authenticated users and not on login/register
  const showNav = accessToken && !['/login', '/register'].includes(location.pathname);

  return (
    <>
      {showNav && (
        <AppBar position="static" sx={{ background: 'linear-gradient(135deg, #9B59B6 0%, #8E44AD 100%)' }}>
          <Toolbar>
            <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
              <Button color="inherit" component={Link} to="/chats">Chats</Button>
              <Button color="inherit" component={Link} to="/create-group">Add Group</Button>
              <Button color="inherit" component={Link} to="/profile">Profile</Button>
            </Box>
            <Button
              color="inherit"
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
              sx={{
                ml: 2,
                fontWeight: 600,
                borderRadius: 2,
                px: 2,
                py: 1,
                background: 'rgba(244,67,54,0.08)',
                transition: 'all 0.2s',
                '&:hover': {
                  background: 'rgba(244,67,54,0.18)',
                  color: '#f44336',
                  boxShadow: '0 2px 8px rgba(244,67,54,0.12)',
                },
                '&:active': {
                  background: 'rgba(244,67,54,0.28)',
                },
                color: 'white',
                letterSpacing: 0.5,
              }}
            >
              Logout
            </Button>
          </Toolbar>
        </AppBar>
      )}
      <Routes>
        {/* Root route - redirect based on auth status */}
        <Route path="/" element={<RootRedirect />} />
        {/* Public routes - redirect to chats if already logged in */}
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />
        <Route path="/login" element={<Login />} />
        {/* Protected routes - require authentication */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/chats" element={
          <ProtectedRoute>
            <Chats />
          </ProtectedRoute>
        } />
        <Route path="/message/:chatId" element={
          <ProtectedRoute>
            <Message />
          </ProtectedRoute>
        } />
        <Route path="/create-group" element={
          <ProtectedRoute>
            <CreateGroupName />
          </ProtectedRoute>
        } />
        <Route path="/create-group/participants" element={
          <ProtectedRoute>
            <CreateGroupParticipants />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  );
}

// Root redirect component
function RootRedirect() {
  const { accessToken } = useAuth();
  
  // Redirect based on authentication status
  if (accessToken) {
    return <Navigate to="/chats" replace />;
  } else {
    return <Navigate to="/login" replace />;
  }
}

export default App;
