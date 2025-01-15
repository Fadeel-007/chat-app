const socket = io();
let username = "";

const joinSection = document.getElementById("join-section");
const chatSection = document.getElementById("chat-section");
const chatBox = document.getElementById("chat-box");
const chatInput = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");
const joinBtn = document.getElementById("join-btn");
const usernameInput = document.getElementById("username-input");
const typingIndicator = document.getElementById("typing-indicator");

// Join the chat with a username
joinBtn.addEventListener("click", () => {
    username = usernameInput.value.trim();
    if (username) {
        socket.emit("join", username);
        
        // Hide the join section and show the chat
        joinSection.style.display = "none";
        chatSection.style.display = "block";
        
    } else {
        alert("Please enter a valid username.");
    }
});

// Function to display messages
function displayMessage(msg, type = "message") {
    const messageElement = document.createElement("p");
    if (type === "notification") {
        messageElement.style.fontStyle = "italic";
        messageElement.style.color = "gray";
    }
    messageElement.textContent = msg;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Send a message (Fixed: No "You" message duplication)
sendBtn.addEventListener("click", () => {
    const message = chatInput.value.trim();
    if (message) {
        socket.emit("chat message", { username, message }); // Send username & message
        chatInput.value = "";
        socket.emit("typing", false);
    }
});

// Listen for messages (Now displays correctly without duplicates)
socket.on("chat message", ({ username, message, time }) => {
    displayMessage(`${username} (${time}): ${message}`);
});

// Receive join/leave notifications
socket.on("notification", (msg) => {
    displayMessage(msg, "notification");
});

// Show typing indicator
socket.on("typing", (data) => {
    typingIndicator.style.display = data.isTyping ? "block" : "none";
    typingIndicator.textContent = `${data.username} is typing...`;
});
