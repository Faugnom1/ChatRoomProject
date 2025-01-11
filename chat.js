const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let users = {}; // Track connected users

app.use(express.static(__dirname)); // Serve static files (HTML, CSS, JS)

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Handle user login
    socket.on('set username', (username) => {
        users[socket.id] = username;
        io.emit('update users', Object.values(users)); // Broadcast updated user list
    });

    // Handle chat messages
    socket.on('chat message', (data) => {
        io.emit('chat message', data); // Broadcast message to all users
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
        delete users[socket.id]; // Remove user from the list
        io.emit('update users', Object.values(users)); // Broadcast updated user list
    });

    // Handle admin actions
    socket.on('kick', (data) => {
        const targetSocket = Object.keys(users).find(key => users[key] === data.username);
        if (targetSocket) {
            io.to(targetSocket).emit('kicked', 'You have been kicked by an admin.');
            io.sockets.sockets.get(targetSocket).disconnect();
        }
    });

    socket.on('ban', (data) => {
        const targetSocket = Object.keys(users).find(key => users[key] === data.username);
        if (targetSocket) {
            io.to(targetSocket).emit('banned', data.message);
            io.sockets.sockets.get(targetSocket).disconnect();
        }
    });

    socket.on('announcement', (data) => {
        io.emit('announcement', data); // Broadcast announcement to all users
    });
});

server.listen(3000, () => {
    console.log('Server running on port 3000');
});
