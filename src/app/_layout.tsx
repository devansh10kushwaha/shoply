import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { CartProvider } from "../store/cartStore";
import { ChatProvider } from "../store/chatStore";
import { ProductProvider } from "../store/productStore";
import { SessionProvider } from "../store/sessionStore";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SessionProvider>
        <ProductProvider>
          <CartProvider>
            <ChatProvider>
              <Stack
                screenOptions={{
                  headerShown: false,
                }}
              />
            </ChatProvider>
          </CartProvider>
        </ProductProvider>
      </SessionProvider>
    </GestureHandlerRootView>
  );
}