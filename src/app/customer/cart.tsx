import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { useCart } from "../../store/cartStore";

export default function Cart() {
  const {
    cart,
    cartTotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  const renderDeleteAction = (id: string) => (
    <Pressable
      style={styles.deleteAction}
      onPress={() => removeFromCart(id)}
    >
      <Ionicons name="trash-outline" size={22} color="#ffffff" />
      <Text style={styles.deleteActionText}>Delete</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </Pressable>

        <Text style={styles.title}>Cart</Text>

        <View style={{ width: 24 }} />
      </View>

      {cart.length === 0 ? (
        <View style={styles.content}>
          <Ionicons
            name="cart-outline"
            size={70}
            color="#666666"
          />

          <Text style={styles.emptyTitle}>Your cart is empty</Text>

          <Text style={styles.emptyText}>
            Add products to your cart and they will appear here.
          </Text>

          <Pressable
            style={styles.button}
            onPress={() => router.push("/customer/product")}
          >
            <Text style={styles.buttonText}>Continue Shopping</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        >
          {cart.map((item) => (
            <Swipeable
              key={item.id}
              renderRightActions={() => renderDeleteAction(item.id)}
              overshootRight={false}
            >
              <View style={styles.cartItem}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.itemImage}
                />

                <View style={styles.itemDetails}>
                  <Text style={styles.itemName} numberOfLines={2}>
                    {item.name}
                  </Text>

                  <Text style={styles.itemPrice}>
                    ₹{item.price.toLocaleString("en-IN")}
                  </Text>

                  <View style={styles.quantityControls}>
                    <Pressable
                      style={styles.quantityButton}
                      onPress={() => decreaseQuantity(item.id)}
                    >
                      <Ionicons name="remove" size={18} color="#ffffff" />
                    </Pressable>

                    <Text style={styles.itemQuantity}>{item.quantity}</Text>

                    <Pressable
                      style={styles.quantityButton}
                      onPress={() => increaseQuantity(item.id)}
                    >
                      <Ionicons name="add" size={18} color="#ffffff" />
                    </Pressable>
                  </View>
                </View>
              </View>
            </Swipeable>
          ))}

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              ₹{cartTotal.toLocaleString("en-IN")}
            </Text>
          </View>

          <Pressable
            style={styles.button}
            onPress={() => router.push("/customer")}
          >
            <Text style={styles.buttonText}>Continue Shopping</Text>
          </Pressable>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },

  header: {
    height: 75,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#222222",
  },

  title: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",
  },

  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  scroll: {
    flex: 1,
  },

  list: {
    padding: 20,
    paddingBottom: 40,
  },

  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#171717",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#292929",
  },

  deleteAction: {
    width: 92,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderRadius: 14,
    backgroundColor: "#333333",
  },

  deleteActionText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 5,
  },

  itemImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
    backgroundColor: "#dddddd",
  },

  itemDetails: {
    flex: 1,
    marginLeft: 14,
  },

  itemName: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },

  itemPrice: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
    marginTop: 8,
  },

  itemQuantity: {
    color: "#888888",
    fontSize: 15,
    fontWeight: "700",
    minWidth: 24,
    textAlign: "center",
  },

  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#333333",
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: "#292929",
  },

  totalLabel: {
    color: "#aaaaaa",
    fontSize: 17,
  },

  totalValue: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "800",
  },

  emptyTitle: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "700",
    marginTop: 20,
  },

  emptyText: {
    color: "#777777",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 21,
  },

  button: {
    marginTop: 25,
    backgroundColor: "#ffffff",
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 10,
  },

  buttonText: {
    color: "#000000",
    fontSize: 14,
    fontWeight: "700",
  },
});