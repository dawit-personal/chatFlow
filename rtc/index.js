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
    socket.on('addNewChat', (userId) => {
      //do not add user id to online users if it already exists
      !onlineUsers.some(user => user.userId === userId) &&
        onlineUsers.push({
          userId,
          socketId: socket.id,
        });

        // Emit to all clients, including sender
        io.emit('user_online', userId);
       // io.emit('getOnlineUsers', onlineUsers);
       console.log('User disconnected:', socket.id, 'onlineUsers:', onlineUsers);
       io.emit('user_offline', userId);
       //emit the online users to the client- All users get this event
       io.emit('getOnlineUsers', onlineUsers);
    })

    socket.on('disconnect', () => {
      onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id);
      
      io.emit('getOnlineUsers', onlineUsers);
      console.log(`User disconnected: ${socket.id}`);
    });
    
});


io.listen(5000, () => console.log('Socket.IO server running on port 5000'));
