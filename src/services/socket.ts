import { io, Socket } from "socket.io-client";

const SOCKET_URL = "https://de05-2401-4900-be88-5e2c-a42c-c828-4b65-966.ngrok-free.app";

export const CHAT_ROOM = "customer-support";

export type ChatMessage = {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
};

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ["websocket"],
});

export const connectSocket = () => {
  if (!socket.connected) {
    console.log("Connecting to chat server...");
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    console.log("Disconnecting from chat server...");
    socket.disconnect();
  }
};

export const joinChat = (room: string) => {
  connectSocket();

  const joinRoom = () => {
    console.log("Joining chat room:", room);

    socket.emit("join_chat", {
      room,
    });
  };

  if (socket.connected) {
    joinRoom();
  } else {
    socket.once("connect", joinRoom);
  }
};

export const sendMessage = (
  room: string,
  sender: string,
  text: string
) => {
  const cleanText = text.trim();

  if (!cleanText) {
    return;
  }

  if (!socket.connected) {
    console.log(
      "Cannot send message: socket is not connected."
    );
    return;
  }

  console.log(
    "Sending message:",
    cleanText
  );

  socket.emit("send_message", {
    room,
    sender,
    text: cleanText,
  });
};

socket.on("connect", () => {
  console.log(
    "Socket connected:",
    socket.id
  );
});

socket.on("disconnect", (reason) => {
  console.log(
    "Socket disconnected:",
    reason
  );
});

socket.on("connect_error", (error) => {
  console.log(
    "Socket connection error:",
    error.message
  );
});