const socketIo = require('socket.io');
let io;

const initWebSocket = (server) => {
    io = socketIo(server, {
        cors: { origin: '*' },
    });
    io.on('connection', (socket) => {
        console.log('New client connected');
        socket.on('join-room', (roomName) => {
            socket.join(roomName);
            console.log(`Client joined room: ${roomName}`);
        });

        socket.on('leave-room', (roomName) => {
            socket.leave(roomName);
            console.log(`Client ${socket.id} left room: ${roomName}`);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });
};

const emitToUser = (userId, event, data) => {
    console.log(`Emitting event '${event}' to user '${userId}' with data:`, data);
    io.to(userId).emit(event, data);
};

const emitToAdmin = (event, data) => {
    io.to('admin-room').emit(event, data);
};

module.exports = { initWebSocket, emitToUser, emitToAdmin };