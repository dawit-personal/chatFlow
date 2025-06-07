import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './pages/authContext';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Chats from './pages/Chats';

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
  
  // If already authenticated, redirect to profile
  if (accessToken) {
    return <Navigate to="/profile" replace />;
  }
  
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
          <PublicRoute>
            <Login />
          </PublicRoute>
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
