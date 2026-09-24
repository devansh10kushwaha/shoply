import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useChat } from "../../store/chatStore";

export default function CustomerChat() {
  const { messages, sendMessage, isConnected } = useChat();

  const [text, setText] = useState("");

  const insets = useSafeAreaInsets();

  const handleSend = () => {
    const message = text.trim();

    if (!message) {
      return;
    }

    sendMessage(message, "customer");
    setText("");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.replace("/customer")}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color="#ffffff"
            />
          </Pressable>

          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>Support Chat</Text>
            <Text style={styles.subtitle}>SHOPLY Support</Text>
          </View>

          <View
            style={[
              styles.statusDot,
              {
                backgroundColor: isConnected
                  ? "#ffffff"
                  : "#555555",
              },
            ]}
          />
        </View>

        {/* Messages */}
        <ScrollView
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        >
          {messages.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons
                name="chatbubble-outline"
                size={48}
                color="#666666"
              />

              <Text style={styles.emptyTitle}>
                No messages yet
              </Text>

              <Text style={styles.emptyText}>
                Start a conversation with customer support.
              </Text>
            </View>
          ) : (
            messages.map((message) => {
              const isCustomer =
                message.sender === "customer";

              return (
                <View
                  key={message.id}
                  style={[
                    styles.messageRow,
                    isCustomer
                      ? styles.customerRow
                      : styles.supplierRow,
                  ]}
                >
                  <View
                    style={[
                      styles.messageBubble,
                      isCustomer
                        ? styles.customerBubble
                        : styles.supplierBubble,
                    ]}
                  >
                    <Text
                      style={[
                        styles.messageText,
                        isCustomer
                          ? styles.customerText
                          : styles.supplierText,
                      ]}
                    >
                      {message.text}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>

        {/* Message Input */}
        <View
          style={[
            styles.inputArea,
            {
              paddingBottom: Math.max(insets.bottom, 10),
            },
          ]}
        >
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Type your message..."
            placeholderTextColor="#777777"
            style={styles.input}
            multiline
            maxLength={1000}
            textAlignVertical="center"
          />

          <Pressable
            onPress={handleSend}
            disabled={!text.trim() || !isConnected}
            style={[
              styles.sendButton,
              (!text.trim() || !isConnected) &&
                styles.sendButtonDisabled,
            ]}
          >
            <Ionicons
              name="send"
              size={21}
              color={
                text.trim() && isConnected
                  ? "#000000"
                  : "#777777"
              }
            />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },

  keyboardView: {
    flex: 1,
  },

  header: {
    height: 80,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#222222",
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#171717",
    marginRight: 12,
  },

  headerTextContainer: {
    flex: 1,
  },

  title: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",
  },

  subtitle: {
    color: "#777777",
    fontSize: 13,
    marginTop: 2,
  },

  statusDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },

  messagesContainer: {
    flex: 1,
  },

  messagesContent: {
    paddingHorizontal: 17,
    paddingVertical: 20,
    flexGrow: 1,
  },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  emptyTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 14,
  },

  emptyText: {
    color: "#777777",
    fontSize: 14,
    textAlign: "center",
    marginTop: 7,
  },

  messageRow: {
    width: "100%",
    marginBottom: 14,
  },

  customerRow: {
    alignItems: "flex-end",
  },

  supplierRow: {
    alignItems: "flex-start",
  },

  messageBubble: {
    maxWidth: "78%",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 14,
  },

  customerBubble: {
    backgroundColor: "#ffffff",
    borderBottomRightRadius: 4,
  },

  supplierBubble: {
    backgroundColor: "#202020",
    borderBottomLeftRadius: 4,
  },

  messageText: {
    fontSize: 16,
    lineHeight: 21,
  },

  customerText: {
    color: "#000000",
  },

  supplierText: {
    color: "#ffffff",
  },

  inputArea: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 17,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#222222",
  },

  input: {
    flex: 1,
    minHeight: 46,
    maxHeight: 110,
    backgroundColor: "#171717",
    borderWidth: 1,
    borderColor: "#292929",
    borderRadius: 23,
    paddingHorizontal: 18,
    paddingVertical: 12,
    color: "#ffffff",
    fontSize: 15,
    marginRight: 9,
  },

  sendButton: {
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 23,
    backgroundColor: "#ffffff",
  },

  sendButtonDisabled: {
    backgroundColor: "#222222",
  },
});