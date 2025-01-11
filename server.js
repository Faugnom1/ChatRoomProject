const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static(__dirname));

// Serve chatroom.html at the root route
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/chatroom.html');
});

// Handle socket.io connections
io.on('connection', (socket) => {
    console.log('A user connected');
    
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
});

const PORT = 3000;
http.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
