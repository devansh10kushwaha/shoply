const { Server } = require("socket.io");
const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer();

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const PORT = 3001;

const DATA_DIR = path.join(__dirname, "data");
const MESSAGE_FILE = path.join(DATA_DIR, "messages.json");

const CHAT_ROOM = "customer-support";

let messages = [];

// Create data folder/file if they don't exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(MESSAGE_FILE)) {
  fs.writeFileSync(MESSAGE_FILE, "[]", "utf8");
}

// Load previous messages
try {
  const savedMessages = fs.readFileSync(MESSAGE_FILE, "utf8");
  messages = JSON.parse(savedMessages);

  if (!Array.isArray(messages)) {
    messages = [];
  }
} catch (error) {
  console.log("Could not load messages:", error.message);
  messages = [];
}

const saveMessages = () => {
  try {
    fs.writeFileSync(
      MESSAGE_FILE,
      JSON.stringify(messages, null, 2),
      "utf8"
    );
  } catch (error) {
    console.log("Could not save messages:", error.message);
  }
};

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("join_chat", ({ room }) => {
    if (!room) {
      console.log("No room provided");
      return;
    }

    socket.join(room);

    console.log(
      `${socket.id} joined room: ${room}`
    );

    // Send previous messages to this client
    if (room === CHAT_ROOM) {
      socket.emit("chat_history", messages);

      console.log(
        `Sent ${messages.length} previous messages to ${socket.id}`
      );
    }
  });

  socket.on("send_message", (message) => {
    console.log(
      "send_message received:",
      message
    );

    if (
      !message ||
      !message.room ||
      !message.sender ||
      !message.text ||
      !message.text.trim()
    ) {
      console.log("Invalid message");
      return;
    }

    const newMessage = {
      id: `${Date.now()}-${Math.random()}`,
      sender: message.sender,
      text: message.text.trim(),
      timestamp: new Date().toISOString(),
    };

    // Save message
    if (message.room === CHAT_ROOM) {
      messages.push(newMessage);
      saveMessages();
    }

    console.log(
      "Broadcasting message:",
      newMessage
    );

    // Send to everyone in the room
    io.to(message.room).emit(
      "receive_message",
      newMessage
    );
  });

  socket.on("disconnect", (reason) => {
    console.log(
      "Client disconnected:",
      socket.id,
      "Reason:",
      reason
    );
  });
});

server.listen(PORT, () => {
  console.log(
    `Socket.IO server running on port ${PORT}`
  );

  console.log(
    `Loaded ${messages.length} saved chat messages`
  );
});