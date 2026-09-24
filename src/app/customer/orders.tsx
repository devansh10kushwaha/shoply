import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function Orders() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={23}
            color="#ffffff"
          />
        </Pressable>

        <Text style={styles.headerTitle}>
          My Orders
        </Text>

        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
      >
        <View style={styles.emptyContainer}>
          <Ionicons
            name="receipt-outline"
            size={55}
            color="#777777"
          />

          <Text style={styles.emptyTitle}>
            No Orders Yet
          </Text>

          <Text style={styles.emptyText}>
            Your orders will appear here after
            you make a purchase.
          </Text>

          <Pressable
            style={styles.shopButton}
            onPress={() => router.push("/customer/product")}
          >
            <Text style={styles.shopButtonText}>
              Continue Shopping
            </Text>
          </Pressable>
        </View>
      </ScrollView>
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

  backButton: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },

  headerPlaceholder: {
    width: 34,
    height: 34,
  },

  headerTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",
  },

  content: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    maxWidth: 350,
  },

  emptyTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 18,
  },

  emptyText: {
    color: "#777777",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 21,
    marginTop: 8,
    textAlignVertical: "center",
  },

  shopButton: {
    marginTop: 24,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#ffffff",
  },

  shopButtonText: {
    color: "#000000",
    fontSize: 14,
    fontWeight: "700",
  },
});