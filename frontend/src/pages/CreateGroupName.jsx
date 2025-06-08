import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CreateGroupName = () => {
  const [groupName, setGroupName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!groupName.trim()) {
      setError('Group name is required.');
      return;
    }
    setError('');
    navigate('/create-group/participants', { state: { groupName: groupName.trim() } });
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
          maxWidth: 400,
          backgroundColor: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.15)',
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: 'white' }}>
          Create Group Chat
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Group Name"
            value={groupName}
            onChange={e => setGroupName(e.target.value)}
            variant="outlined"
            sx={{ mb: 2, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }}
            InputLabelProps={{ style: { color: 'white' } }}
            InputProps={{ style: { color: 'white' } }}
          />
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ py: 1.2, fontWeight: 600, fontSize: '1rem', background: 'linear-gradient(135deg, #8E2DE2 0%, #4A148C 100%)' }}
          >
            Next
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateGroupName; 