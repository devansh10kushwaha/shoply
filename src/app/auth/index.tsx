import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSession } from "../../store/sessionStore";

export default function AuthScreen() {
  const router = useRouter();
  const { setRole } = useSession();

  const selectRole = async (role: "customer" | "supplier") => {
    await setRole(role);
    router.replace(role === "customer" ? "/customer" : "../supplier");
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>E - Commerce platform</Text>

        <Text style={styles.subtitle}>
          Select your account type
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.roleCard,
            pressed && styles.roleCardPressed,
          ]}
          onPress={() => void selectRole("customer")}
        >
          <Text style={styles.roleTitle}>Customer</Text>

          <Text style={styles.roleDescription}>
            Browse products and manage your purchases.
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.roleCard,
            pressed && styles.roleCardPressed,
          ]}
          onPress={() => void selectRole("supplier")}
        >
          <Text style={styles.roleTitle}>Supplier</Text>

          <Text style={styles.roleDescription}>
            Manage inventory, analytics, and customer support.
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },

  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 60,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "700",
    marginBottom: 12,
  },

  subtitle: {
    color: "#D1D5DB",
    fontSize: 18,
    marginBottom: 36,
  },

  roleCard: {
    backgroundColor: "#0A0A0A",
    borderWidth: 1,
    borderColor: "#4B4B4B",
    borderRadius: 16,
    paddingHorizontal: 28,
    paddingVertical: 28,
    marginBottom: 22,
  },

  roleCardPressed: {
    backgroundColor: "#161616",
    borderColor: "#FFFFFF",
  },

  roleTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
  },

  roleDescription: {
    color: "#D1D5DB",
    fontSize: 16,
    lineHeight: 24,
  },
});