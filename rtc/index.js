const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const { Server } = require('socket.io');

const io = new Server({
  cors: {
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

let onlineUsers = [];

io.on('connection', (socket) => {
  console.log('🔌 Server Debug - New client connected:', socket.id);
  console.log('🔌 Server Debug - Auth data:', socket.handshake.auth);

  // listen to a connection 
  socket.on('create_new_chat', (userId) => {
    console.log('🔌 Server Debug - create_new_chat received from:', userId, 'socket:', socket.id);

    //do not add user id to online users if it already exists
    if (!onlineUsers.some(user => user.userId === userId)) {
      onlineUsers.push({
        userId,
        socketId: socket.id,
      });
      console.log('🔌 Server Debug - Added user to online users:', userId);
    } else {
      console.log('🔌 Server Debug - User already online:', userId);
    }

    // Emit to all clients, including sender
    io.emit('user_online', userId);
    //emit the online users to the client- All users get this event
    io.emit('get_online_users', onlineUsers);
    console.log('🔌 Server Debug - Emitted online status. Current online users:', onlineUsers);
  })

  // Handle request for current online users
  socket.on('get_online_users', () => {
    console.log('🔌 Server Debug - get_online_users requested by:', socket.id);
    socket.emit('get_online_users', onlineUsers);
    console.log('🔌 Server Debug - Sent online users:', onlineUsers);
  });

  socket.on('send_message', (message, callback) => {
    console.log('🔌 Server Debug - send_message received:', message);
    const { recipientId } = message;

    // Find recipient socket
    const recipient = onlineUsers.find(user => user.userId === recipientId);
    console.log('🔌 Server Debug - Recipient lookup:', { recipientId, found: !!recipient });

    if (!recipient) {
      console.log('🔌 Server Debug - Recipient not online:', recipientId);
      return callback({ success: false, reason: 'User offline' });
    }

    // Emit the message to recipient
    io.to(recipient.socketId).emit('receive_message', message);
    console.log('🔌 Server Debug - Message forwarded to recipient:', recipient.socketId);

    // Optionally: emit back to sender for confirmation or echo
    callback({ success: true });
  });

  socket.on('disconnect', () => {
    console.log('🔌 Server Debug - Client disconnecting:', socket.id);
    // Find the user that's disconnecting before removing them
    const disconnectedUser = onlineUsers.find(user => user.socketId === socket.id);

    // Remove user from online users array
    onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id);

    // If we found the user, emit offline event with their userId
    if (disconnectedUser) {
      console.log('🔌 Server Debug - User disconnected:', disconnectedUser.userId);
      io.emit('user_offline', disconnectedUser.userId);
    } else {
      console.log('🔌 Server Debug - Unknown user disconnected:', socket.id);
    }

    // Emit updated online users list to all clients
    io.emit('get_online_users', onlineUsers);
    console.log('🔌 Server Debug - Updated online users after disconnect:', onlineUsers);
  });
});

io.listen(5000, () => console.log('Socket.IO server running on port 5000'));

// TEMPORARY: Test function to manually emit messages (REMOVE AFTER TESTING)
setTimeout(() => {
  console.log('Connected users:', onlineUsers);

  // Emit a test message to all connected users after 10 seconds
  if (onlineUsers.length > 0) {
    console.log('Emitting test message to all users...');
    io.emit('receive_message', {
      chatId: '10', // Replace with actual chatId you're testing
      id: Date.now(),
      content: 'TEST: Real-time message from server!',
      senderId: 'test-sender-123',
      recipientId: onlineUsers[0].userId,
      timestamp: new Date().toISOString()
    });
  }
}, 10000); // Wait 10 seconds after server starts
