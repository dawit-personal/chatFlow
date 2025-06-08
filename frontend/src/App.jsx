import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/authContext';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Chats from './pages/Chats';
import Message from './pages/Message';
import CreateGroupName from './pages/CreateGroupName';
import CreateGroupParticipants from './pages/CreateGroupParticipants';

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
  return (
    <BrowserRouter>
      <Routes>
        {/* Root route - redirect based on auth status */}
        <Route path="/" element={<RootRedirect />} />
        
        {/* Public routes - redirect to profile if already logged in */}
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />
        <Route path="/login" element={
          <Login />
        } />
        
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
    </BrowserRouter>
  );
}

// Root redirect component
function RootRedirect() {
  const { accessToken } = useAuth();
  
  // Redirect based on authentication status
  if (accessToken) {
    return <Navigate to="/profile" replace />;
  } else {
    return <Navigate to="/login" replace />;
  }
}

export default App;
