export type ChatSender = "customer" | "supplier";

export interface ChatMessage {
  id: string;
  room: string;
  sender: ChatSender;
  text: string;
  timestamp: string;
}