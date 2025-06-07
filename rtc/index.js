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
  console.log('a user connected', socket.id);

  // listen to a connection 
  socket.on('create_new_chat', (userId) => {
    //do not add user id to online users if it already exists
    !onlineUsers.some(user => user.userId === userId) &&
      onlineUsers.push({
        userId,
        socketId: socket.id,
      });

    // Emit to all clients, including sender
    io.emit('user_online', userId);
    //emit the online users to the client- All users get this event
    io.emit('get_online_users', onlineUsers);
    console.log('User connected:', userId, 'onlineUsers:', onlineUsers);
  })

  // Handle request for current online users
      socket.on('get_online_users', () => {
      socket.emit('get_online_users', onlineUsers);
    console.log('Sent online users to client:', socket.id, onlineUsers);
  });

  socket.on('send_message', (message, callback) => {
    const { recipientId } = message;

    // Find recipient socket
    const recipient = onlineUsers.find(user => user.userId === recipientId);

    if (!recipient) {
      console.log(`Recipient ${recipientId} not online`);
      return callback({ success: false, reason: 'User offline' });
    }

    // Emit the message to recipient
    io.to(recipient.socketId).emit('receive_message', message);
    console.log(`Message sent from ${message.senderId} to ${recipientId}`);

    // Optionally: emit back to sender for confirmation or echo
    callback({ success: true });
  });

  
  socket.on('disconnect', () => {
    // Find the user that's disconnecting before removing them
    const disconnectedUser = onlineUsers.find(user => user.socketId === socket.id);

    // Remove user from online users array
    onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id);

    // If we found the user, emit offline event with their userId
    if (disconnectedUser) {
      io.emit('user_offline', disconnectedUser.userId);
      console.log(`User disconnected: ${socket.id}, userId: ${disconnectedUser.userId}`);
    } else {
      console.log(`User disconnected: ${socket.id} (userId not found)`);
    }

    // Emit updated online users list to all clients
    io.emit('get_online_users', onlineUsers);
    console.log('Updated onlineUsers after disconnect:', onlineUsers);
  });

});


io.listen(5000, () => console.log('Socket.IO server running on port 5000'));
