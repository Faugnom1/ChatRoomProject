// server.js
require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcrypt');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Supabase setup
const SUPABASE_URL = 'https://pvknnhhboncxlcjrbqug.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2a25uaGhib25jeGxjanJicXVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY4NjA0MzIsImV4cCI6MjA1MjQzNjQzMn0.4g829-j8wPvkbNcTXcr_FzUv0q31xFcIvK5nP1thapI';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

app.use(express.static(__dirname));
app.use(express.json());

// Track connected users
const connectedUsers = new Map();

// Authentication endpoints
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        // Check if user exists
        const { data: existingUser } = await supabase
            .from('users')
            .select()
            .eq('username', username)
            .single();

        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Hash password and create user
        const hashedPassword = await bcrypt.hash(password, 10);
        const { data, error } = await supabase
            .from('users')
            .insert([
                { 
                    username,
                    password: hashedPassword,
                    status: 'offline',
                    is_banned: false
                }
            ]);

        if (error) throw error;
        res.json({ message: 'Registration successful' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        // Get user
        const { data: user } = await supabase
            .from('users')
            .select()
            .eq('username', username)
            .single();

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        if (user.is_banned) {
            return res.status(403).json({ error: 'This account has been banned' });
        }

        // Check password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.json({ 
            message: 'Login successful',
            username: user.username
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Socket.io connection handling
io.on('connection', async (socket) => {
    console.log('User connected:', socket.id);

    // Send chat history to new connection
    const { data: messages } = await supabase
        .from('messages')
        .select('*')
        .order('timestamp', { ascending: true })
        .limit(100);
    
    socket.emit('chat history', messages || []);

    // Handle user authentication
    socket.on('authenticate', async ({ username }) => {
        const { data: user } = await supabase
            .from('users')
            .select()
            .eq('username', username)
            .single();

        if (user && !user.is_banned) {
            connectedUsers.set(socket.id, username);
            await supabase
                .from('users')
                .update({ status: 'online', socket_id: socket.id })
                .eq('username', username);

            // Broadcast updated user list
            const { data: activeUsers } = await supabase
                .from('users')
                .select('username, status')
                .eq('status', 'online')
                .eq('is_banned', false);

            io.emit('update users', activeUsers || []);
        }
    });

    // Handle chat messages
    socket.on('chat message', async (message) => {
        const username = connectedUsers.get(socket.id);
        if (!username) return;

        const { data: user } = await supabase
            .from('users')
            .select('is_banned')
            .eq('username', username)
            .single();

        if (user && !user.is_banned) {
            const { data, error } = await supabase
                .from('messages')
                .insert([{
                    username,
                    message,
                    timestamp: new Date().toISOString()
                }]);

            if (!error) {
                io.emit('chat message', { username, message });
            }
        }
    });

    // Handle admin actions
    socket.on('ban', async ({ username, adminUsername }) => {
        if (adminUsername && connectedUsers.get(socket.id) === adminUsername) {
            // Update user's banned status
            await supabase
                .from('users')
                .update({ is_banned: true })
                .eq('username', username);

            // Find and disconnect banned user's socket
            for (const [socketId, user] of connectedUsers.entries()) {
                if (user === username) {
                    const bannedSocket = io.sockets.sockets.get(socketId);
                    if (bannedSocket) {
                        bannedSocket.emit('banned');
                        bannedSocket.disconnect(true);
                    }
                    break;
                }
            }

            // Update user list
            const { data: activeUsers } = await supabase
                .from('users')
                .select('username, status')
                .eq('status', 'online')
                .eq('is_banned', false);

            io.emit('update users', activeUsers || []);
        }
    });

    // Handle disconnection
    socket.on('disconnect', async () => {
        const username = connectedUsers.get(socket.id);
        if (username) {
            await supabase
                .from('users')
                .update({ status: 'offline' })
                .eq('username', username);

            connectedUsers.delete(socket.id);

            const { data: activeUsers } = await supabase
                .from('users')
                .select('username, status')
                .eq('status', 'online')
                .eq('is_banned', false);

            io.emit('update users', activeUsers || []);
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});