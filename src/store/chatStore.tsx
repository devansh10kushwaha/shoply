import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  CHAT_ROOM,
  connectSocket,
  joinChat,
  sendMessage as sendSocketMessage,
  socket,
} from "../services/socket";
import { ChatMessage, ChatSender } from "../types/chat";

interface ChatContextType {
  messages: ChatMessage[];
  sendMessage: (text: string, sender: ChatSender) => void;
  clearMessages: () => void;
  isConnected: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const addMessage = (message: ChatMessage) => {
      setMessages((currentMessages) => {
        if (
          currentMessages.some(
            (currentMessage) => currentMessage.id === message.id
          )
        ) {
          return currentMessages;
        }

        return [...currentMessages, message];
      });
    };

    const handleConnect = () => {
      setIsConnected(true);
      joinChat(CHAT_ROOM);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    const handleHistory = (history: ChatMessage[]) => {
      history.forEach(addMessage);
    };

    const handleReceiveMessage = (message: ChatMessage) => {
      addMessage(message);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("chat_history", handleHistory);
    socket.on("receive_message", handleReceiveMessage);

    connectSocket();
    joinChat(CHAT_ROOM);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("chat_history", handleHistory);
      socket.off("receive_message", handleReceiveMessage);
    };
  }, []);

  const sendMessage = (text: string, sender: ChatSender) => {
    const trimmedText = text.trim();

    if (!trimmedText) {
      return;
    }

    sendSocketMessage(CHAT_ROOM, sender, trimmedText);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        sendMessage,
        clearMessages,
        isConnected,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error("useChat must be used inside ChatProvider");
  }

  return context;
}