import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  connectSocket,
  joinChat,
  sendMessage,
  socket,
} from "../../services/socket";

type ChatMessage = {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
};

const CHAT_ROOM = "customer-support";

export default function SupplierChat() {
  const router = useRouter();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    console.log("Starting supplier chat socket...");

    connectSocket();

    const handleChatHistory = (
      history: ChatMessage[]
    ) => {
      console.log(
        "Supplier received chat history:",
        history
      );

      setMessages(history);
    };

    const handleReceiveMessage = (
      receivedMessage: ChatMessage
    ) => {
      console.log(
        "Supplier received message:",
        receivedMessage
      );

      setMessages((previousMessages) => {
        const alreadyExists = previousMessages.some(
          (item) => item.id === receivedMessage.id
        );

        if (alreadyExists) {
          return previousMessages;
        }

        return [
          ...previousMessages,
          receivedMessage,
        ];
      });
    };

    socket.on(
      "chat_history",
      handleChatHistory
    );

    socket.on(
      "receive_message",
      handleReceiveMessage
    );

    /*
     * Join after listeners are registered.
     * This is important because the server
     * immediately sends chat_history after join.
     */
    joinChat(CHAT_ROOM);

    return () => {
      socket.off(
        "chat_history",
        handleChatHistory
      );

      socket.off(
        "receive_message",
        handleReceiveMessage
      );
    };
  }, []);

  const handleSendMessage = () => {
    const text = message.trim();

    if (!text) {
      return;
    }

    console.log(
      "Supplier sending message:",
      text
    );

    sendMessage(
      CHAT_ROOM,
      "supplier",
      text
    );

    setMessage("");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace("/supplier");
              }
            }}
          >
            <Ionicons
              name="arrow-back"
              size={23}
              color="#ffffff"
            />
          </Pressable>

          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>
              Support Chat
            </Text>

            <Text style={styles.status}>
              SHOPLY Customer Support
            </Text>
          </View>
        </View>

        {/* MESSAGES */}
        <ScrollView
          style={styles.messagesContainer}
          contentContainerStyle={
            messages.length === 0
              ? styles.emptyContent
              : styles.messagesContent
          }
          showsVerticalScrollIndicator={false}
        >
          {messages.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={48}
                color="#777777"
              />

              <Text style={styles.emptyTitle}>
                No messages yet
              </Text>

              <Text style={styles.emptyText}>
                Customer support messages will
                appear here.
              </Text>
            </View>
          ) : (
            messages.map((item) => {
              const isSupplier =
                item.sender === "supplier";

              return (
                <View
                  key={item.id}
                  style={[
                    styles.messageBubble,
                    isSupplier
                      ? styles.supplierBubble
                      : styles.customerBubble,
                  ]}
                >
                  <Text
                    style={
                      isSupplier
                        ? styles.supplierMessageText
                        : styles.customerMessageText
                    }
                  >
                    {item.text}
                  </Text>

                  <Text
                    style={
                      isSupplier
                        ? styles.supplierTime
                        : styles.customerTime
                    }
                  >
                    {new Date(
                      item.timestamp
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </View>
              );
            })
          )}
        </ScrollView>

        {/* INPUT */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Reply to customer..."
            placeholderTextColor="#666666"
            value={message}
            onChangeText={setMessage}
            onSubmitEditing={handleSendMessage}
            returnKeyType="send"
          />

          <Pressable
            style={[
              styles.sendButton,
              !message.trim() &&
                styles.sendButtonDisabled,
            ]}
            onPress={handleSendMessage}
            disabled={!message.trim()}
          >
            <Ionicons
              name="send"
              size={20}
              color="#000000"
            />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000000",
  },

  container: {
    flex: 1,
    backgroundColor: "#000000",
  },

  header: {
    height: 72,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#242424",
    flexDirection: "row",
    alignItems: "center",
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#151515",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  headerTextContainer: {
    justifyContent: "center",
  },

  title: {
    color: "#ffffff",
    fontSize: 19,
    fontWeight: "700",
  },

  status: {
    color: "#777777",
    fontSize: 12,
    marginTop: 3,
  },

  messagesContainer: {
    flex: 1,
  },

  emptyContent: {
    flexGrow: 1,
    justifyContent: "center",
  },

  messagesContent: {
    paddingHorizontal: 16,
    paddingVertical: 18,
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },

  emptyTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 16,
  },

  emptyText: {
    color: "#777777",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 21,
    marginTop: 8,
  },

  messageBubble: {
    maxWidth: "80%",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 17,
    marginBottom: 10,
  },

  customerBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#202020",
    borderBottomLeftRadius: 5,
  },

  supplierBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#ffffff",
    borderBottomRightRadius: 5,
  },

  customerMessageText: {
    color: "#ffffff",
    fontSize: 15,
    lineHeight: 21,
  },

  supplierMessageText: {
    color: "#000000",
    fontSize: 15,
    lineHeight: 21,
  },

  customerTime: {
    color: "#777777",
    fontSize: 10,
    marginTop: 4,
    textAlign: "right",
  },

  supplierTime: {
    color: "#777777",
    fontSize: 10,
    marginTop: 4,
    textAlign: "right",
  },

  inputContainer: {
    minHeight: 70,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#242424",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#050505",
  },

  input: {
    flex: 1,
    minHeight: 46,
    backgroundColor: "#171717",
    borderWidth: 1,
    borderColor: "#292929",
    borderRadius: 23,
    paddingHorizontal: 18,
    color: "#ffffff",
    fontSize: 15,
  },

  sendButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },

  sendButtonDisabled: {
    opacity: 0.45,
  },
});