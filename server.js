const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let users = []; // Temporary user storage (replace with a database later mr fanugo )

app.use(bodyParser.json());
app.use(express.static(__dirname));

// Sign-up end pointy
app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    if (users.find(user => user.username === username)) {
        return res.status(400).send({ message: 'User already exists' });
    }
    users.push({ username, password });
    res.send({ message: 'Sign-up successful' });
});

// login stuff
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        return res.send({ message: 'Login successful' });
    }
    res.status(400).send({ message: 'Invalid credentials' });
});

// handle chat messagessssssss
io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
