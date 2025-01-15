const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("join", (username) => {
        socket.username = username;
        io.emit("notification", `${username} has joined the chat.`);
    });

    // Fixed: Broadcast messages with username
    socket.on("chat message", ({ username, message }) => {
        const time = new Date().toLocaleTimeString();
        io.emit("chat message", { username, message, time });
    });

    socket.on("typing", (isTyping) => {
        socket.broadcast.emit("typing", { username: socket.username, isTyping });
    });

    socket.on("disconnect", () => {
        io.emit("notification", `${socket.username} has left the chat.`);
        console.log("A user disconnected");
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
