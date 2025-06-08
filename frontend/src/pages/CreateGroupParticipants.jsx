import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, Chip, Avatar, CircularProgress, Alert } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/authContext';

const CreateGroupParticipants = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { accessToken, user } = useAuth();
  const groupName = location.state?.groupName || '';

  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);

  // Search users API
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    setLoading(true);
    setError('');
    try {
      const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:4000';
      const res = await axios.post(`${API_ENDPOINT}/users/search`, { firstName: search.trim() }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setSearchResults(res.data || []);
    } catch (err) {
      setError('Failed to search users.');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Add/remove user
  const toggleUser = (userObj) => {
    setSelectedUsers(prev => {
      if (prev.some(u => u.userId === userObj.userId)) {
        return prev.filter(u => u.userId !== userObj.userId);
      } else {
        setSearchResults(results => results.filter(u => u.userId !== userObj.userId));
        setSearch('');
        return [...prev, userObj];
      }
    });
  };

  // Create group chat
  const handleCreateGroup = async () => {
    if (!groupName || selectedUsers.length === 0) {
      setError('Please enter a group name and select at least one participant.');
      return;
    }
    setCreating(true);
    setError('');
    try {
      const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:4000';
      // Include yourself in the group
      const participantIds = [user.userId, ...selectedUsers.map(u => u.userId)];
      const payload = {
        name: groupName,
        isGroup: true,
        participantIds,
      };
      const res = await axios.post(`${API_ENDPOINT}/conversations`, payload, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      // On success, go to the new group chat or chats list
      if (res.data && res.data.chatId) {
        navigate(`/message/${res.data.chatId}`);
      } else if (res.data && res.data.id) {
        navigate(`/message/${res.data.id}`);
      } else {
        navigate('/chats');
      }
    } catch (err) {
      setError('Failed to create group chat.');
    } finally {
      setCreating(false);
    }
  };

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
      <Paper
        elevation={12}
        sx={{
          p: 4,
          borderRadius: 4,
          minWidth: 340,
          maxWidth: 500,
          backgroundColor: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.15)',
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: 'white' }}>
          Add Participants
        </Typography>
        <Typography variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
          Group: <b>{groupName}</b>
        </Typography>
        <form onSubmit={handleSearch} style={{ marginBottom: 16 }}>
          <TextField
            fullWidth
            label="Search users by first name"
            value={search}
            onChange={e => setSearch(e.target.value)}
            variant="outlined"
            sx={{ mb: 2, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }}
            InputLabelProps={{ style: { color: 'white' } }}
            InputProps={{ style: { color: 'white' } }}
          />
          <Button type="submit" variant="contained" sx={{ mb: 2, background: 'linear-gradient(135deg, #8E2DE2 0%, #4A148C 100%)' }}>
            Search
          </Button>
        </form>
        {loading && <CircularProgress size={28} sx={{ color: '#8E2DE2', mb: 2 }} />}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {/* Selected users */}
        {selectedUsers.length > 0 && (
          <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {selectedUsers.map(u => (
              <Chip
                key={u.userId}
                avatar={<Avatar src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.firstName}&backgroundColor=8E2DE2`} />}
                label={`${u.firstName} ${u.lastName || ''}`}
                onDelete={() => toggleUser(u)}
                sx={{ background: 'rgba(142,45,226,0.15)', color: 'white' }}
              />
            ))}
          </Box>
        )}
        {/* Search results */}
        {searchResults.length > 0 && (
          <Box sx={{ mb: 2 }}>
            {searchResults.map(u => (
              <Chip
                key={u.userId}
                avatar={<Avatar src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.firstName}&backgroundColor=8E2DE2`} />}
                label={`${u.firstName} ${u.lastName || ''}`}
                clickable
                color={selectedUsers.some(sel => sel.userId === u.userId) ? 'primary' : 'default'}
                onClick={() => toggleUser(u)}
                sx={{ m: 0.5, background: selectedUsers.some(sel => sel.userId === u.userId) ? 'linear-gradient(135deg, #8E2DE2 0%, #4A148C 100%)' : 'rgba(255,255,255,0.1)', color: 'white' }}
              />
            ))}
          </Box>
        )}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          disabled={selectedUsers.length === 0 || creating}
          onClick={handleCreateGroup}
          sx={{ py: 1.2, fontWeight: 600, fontSize: '1rem', background: 'linear-gradient(135deg, #8E2DE2 0%, #4A148C 100%)', mt: 2 }}
        >
          {creating ? 'Creating Group...' : 'Done'}
        </Button>
      </Paper>
    </Box>
  );
};

export default CreateGroupParticipants; 