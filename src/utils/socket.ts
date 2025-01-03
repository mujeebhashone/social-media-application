import { Server } from 'socket.io';

let io: Server;

export const initSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: '*', // Allow all origins (update in production)
    },
  });

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Join a room based on user ID
    socket.on('joinRoom', (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined room`);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('A user disconnected:', socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};