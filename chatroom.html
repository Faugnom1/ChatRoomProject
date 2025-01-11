<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chat Room</title>
    <link rel="stylesheet" href="styles.css">
    <script src="https://cdn.jsdelivr.net/npm/tsparticles@2/tsparticles.bundle.min.js"></script>
    <script src="/socket.io/socket.io.js"></script>
</head>
<body>
    <div id="particles-js"></div>
    <div id="chat-box">
        <div id="chat-header">
            <button id="back-arrow">⬅</button>
            Chat Room
            <button id="forward-arrow">➡</button>
            <span id="role-display"></span>
        </div>
        <ul id="messages"></ul>
        <form id="form">
            <input id="input" autocomplete="off" placeholder="Type your message...">
            <button type="submit" id="send-button">Send</button>
        </form>
    </div>

    <div id="settings-panel">
        <h2>Settings</h2>
        <label for="background-slider">Background Color</label>
        <input type="range" id="background-slider" min="0" max="360">
        <input type="text" id="admin-code" placeholder="Enter admin code" style="display: none;">
        <button id="home-button">Home</button>
    </div>

    <div id="admin-menu">
        <button id="purge-chat">Purge Chat</button>
        <button id="kick-user">Kick User</button>
        <button id="ban-user">Ban User</button>
    </div>

    <script>
        const socket = io();
        const messages = document.getElementById('messages');
        const input = document.getElementById('input');
        const form = document.getElementById('form');
        const chatBox = document.getElementById('chat-box');
        const chatHeader = document.getElementById('chat-header');
        const roleDisplay = document.getElementById('role-display');
        const settingsPanel = document.getElementById('settings-panel');
        const backgroundSlider = document.getElementById('background-slider');
        const adminCodeInput = document.getElementById('admin-code');
        const homeButton = document.getElementById('home-button');
        const adminMenu = document.getElementById('admin-menu');
        const purgeChatButton = document.getElementById('purge-chat');
        const kickUserButton = document.getElementById('kick-user');
        const banUserButton = document.getElementById('ban-user');
        const backArrow = document.getElementById('back-arrow');
        const forwardArrow = document.getElementById('forward-arrow');

        let username = prompt('Enter your username:');
        let role = 'Student';
        let sliderMoves = 0;
        let lastSliderValue = backgroundSlider.value;

        roleDisplay.textContent = `Role: ${role}`;

        adminCodeInput.addEventListener('input', (e) => {
            if (e.target.value === 'nickiscool123') {
                role = 'Admin';
                roleDisplay.textContent = `Role: ${role}`;
                alert('You are now an admin!');
            }
        });

        backgroundSlider.addEventListener('input', (e) => {
            const hue = e.target.value;
            document.body.style.background = `hsl(${hue}, 100%, 50%)`;

            if (Math.abs(hue - lastSliderValue) > 20) {
                sliderMoves++;
            }
            lastSliderValue = hue;

            if (sliderMoves >= 10) {
                adminCodeInput.style.display = 'block';
            }
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (input.value.trim()) {
                socket.emit('chat message', `${username}: ${input.value}`);
                input.value = '';
            }
        });

        socket.on('chat message', (msg) => {
            const item = document.createElement('li');
            item.textContent = msg;
            item.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                if (role === 'Admin') {
                    showAdminMenu(e.clientX, e.clientY, msg.split(':')[0]);
                }
            });
            messages.appendChild(item);
            messages.scrollTop = messages.scrollHeight;
        });

        function showAdminMenu(x, y, targetUsername) {
            adminMenu.style.display = 'block';
            adminMenu.style.left = `${x}px`;
            adminMenu.style.top = `${y}px`;

            purgeChatButton.onclick = () => {
                socket.emit('purge chat');
                adminMenu.style.display = 'none';
            };

            kickUserButton.onclick = () => {
                if (targetUsername === username) {
                    alert("You can't kick yourself!");
                } else {
                    socket.emit('kick user', targetUsername);
                }
                adminMenu.style.display = 'none';
            };

            banUserButton.onclick = () => {
                if (targetUsername === username) {
                    alert("You sped, why you trying to ban urself?");
                } else {
                    const reason = prompt('what do you want this kid to see when they get back on:');
                    socket.emit('ban user', { username: targetUsername, reason });
                }
                adminMenu.style.display = 'none';
            };
        }

        document.addEventListener('click', () => {
            adminMenu.style.display = 'none';
        });

        socket.on('purge chat', () => {
            messages.innerHTML = '';
        });

        socket.on('kicked', () => {
            alert('You have been kicked XDXDXDXDXDXDXDX imagine getting kicked.');
            window.location.reload();
        });

        socket.on('banned', (data) => {
            alert(`You have been banned lolllll imagine getting banned in a chat!!!!!. Reason: ${data.reason}`);
            window.location.href = '/banned.html';
        });

        // Drag functionality
        let isDragging = false;
        let offsetX, offsetY;

        chatHeader.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - chatBox.offsetLeft;
            offsetY = e.clientY - chatBox.offsetTop;
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                chatBox.style.left = `${e.clientX - offsetX}px`;
                chatBox.style.top = `${e.clientY - offsetY}px`;
                chatBox.style.position = 'absolute';
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        // Arrow navigation
        backArrow.addEventListener('click', () => {
            settingsPanel.style.display = 'block';
            chatBox.style.display = 'none';
        });

        forwardArrow.addEventListener('click', () => {
            settingsPanel.style.display = 'block';
            chatBox.style.display = 'none';
        });

        homeButton.addEventListener('click', () => {
            settingsPanel.style.display = 'none';
            chatBox.style.display = 'block';
        });

        // Initialize particles
        tsParticles.load("particles-js", {
            particles: {
                number: {
                    value: 50,
                },
                size: {
                    value: 3,
                },
                move: {
                    enable: true,
                    speed: 2,
                },
                color: {
                    value: "#ffffff",
                },
            },
            interactivity: {
                events: {
                    onhover: {
                        enable: true,
                        mode: "repulse",
                    },
                },
            },
        });
    </script>
</body>
</html>
