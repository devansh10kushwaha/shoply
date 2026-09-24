import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useSession } from "../../store/sessionStore";

const accountItems = [
  { label: "My Orders", icon: "receipt-outline" as const },
  { label: "Wishlist", icon: "heart-outline" as const },
  { label: "Saved Addresses", icon: "location-outline" as const },
  { label: "Payment Methods", icon: "card-outline" as const },
];

const settingItems = [
  { label: "Notifications", icon: "notifications-outline" as const },
  { label: "Privacy & Security", icon: "lock-closed-outline" as const },
  { label: "Help & Support", icon: "help-circle-outline" as const },
];

function showComingSoon(label: string) {
  Alert.alert(label, "This feature is coming soon.");
}

export default function CustomerProfile() {
  const { clearRole } = useSession();

  const logout = async () => {
    await clearRole();
    router.replace("/auth");
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable
          style={styles.headerButton}
          onPress={() => router.push("/customer")}
        >
          <Ionicons
            name="arrow-back"
            size={23}
            color="#ffffff"
          />
        </Pressable>

        <Text style={styles.headerTitle}>
          Profile
        </Text>

        <View style={styles.headerButtonPlaceholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* PROFILE */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Ionicons
              name="person"
              size={38}
              color="#ffffff"
            />
          </View>

          <Text style={styles.name}>
            Customer
          </Text>

          <Text style={styles.email}>
            customer@shoply.com
          </Text>

          <Pressable
            style={styles.editButton}
            onPress={() =>
              showComingSoon("Edit Profile")
            }
          >
            <Ionicons
              name="create-outline"
              size={17}
              color="#000000"
            />

            <Text style={styles.editButtonText}>
              Edit Profile
            </Text>
          </Pressable>
        </View>

        {/* ACCOUNT */}
        <Text style={styles.sectionTitle}>
          Account
        </Text>

        <View style={styles.menuCard}>
          {accountItems.map((item, index) => (
            <Pressable
              key={item.label}
              style={[
                styles.menuItem,
                index < accountItems.length - 1 &&
                  styles.menuItemBorder,
              ]}
              onPress={() => {
                if (item.label === "My Orders") {
                  router.push("/customer/orders");
                  return;
                }

                showComingSoon(item.label);
              }}
            >
              <View style={styles.menuIcon}>
                <Ionicons
                  name={item.icon}
                  size={20}
                  color="#ffffff"
                />
              </View>

              <Text style={styles.menuLabel}>
                {item.label}
              </Text>

              <Ionicons
                name="chevron-forward"
                size={19}
                color="#777777"
              />
            </Pressable>
          ))}
        </View>

        {/* SETTINGS */}
        <Text style={styles.sectionTitle}>
          Settings
        </Text>

        <View style={styles.menuCard}>
          {settingItems.map((item, index) => (
            <Pressable
              key={item.label}
              style={[
                styles.menuItem,
                index < settingItems.length - 1 &&
                  styles.menuItemBorder,
              ]}
              onPress={() =>
                showComingSoon(item.label)
              }
            >
              <View style={styles.menuIcon}>
                <Ionicons
                  name={item.icon}
                  size={20}
                  color="#ffffff"
                />
              </View>

              <Text style={styles.menuLabel}>
                {item.label}
              </Text>

              <Ionicons
                name="chevron-forward"
                size={19}
                color="#777777"
              />
            </Pressable>
          ))}
        </View>

        {/* LOGOUT */}
        <Pressable
          style={styles.logoutButton}
          onPress={() => void logout()}
        >
          <Ionicons
            name="log-out-outline"
            size={20}
            color="#ffffff"
          />

          <Text style={styles.logoutText}>
            Logout
          </Text>
        </Pressable>
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

  headerButton: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },

  headerButtonPlaceholder: {
    width: 34,
    height: 34,
  },

  headerTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",
  },

  content: {
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
    padding: 20,
    paddingBottom: 40,
  },

  profileCard: {
    alignItems: "center",
    padding: 24,
    backgroundColor: "#171717",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#292929",
  },

  avatar: {
    width: 82,
    height: 82,
    borderRadius: 41,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#333333",
    borderWidth: 1,
    borderColor: "#555555",
  },

  name: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "800",
    marginTop: 14,
  },

  email: {
    color: "#888888",
    fontSize: 14,
    marginTop: 5,
  },

  editButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginTop: 18,
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 9,
    backgroundColor: "#ffffff",
  },

  editButtonText: {
    color: "#000000",
    fontSize: 13,
    fontWeight: "700",
  },

  sectionTitle: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "700",
    marginTop: 28,
    marginBottom: 10,
  },

  menuCard: {
    overflow: "hidden",
    backgroundColor: "#171717",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#292929",
  },

  menuItem: {
    minHeight: 62,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },

  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#292929",
  },

  menuIcon: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9,
    backgroundColor: "#292929",
  },

  menuLabel: {
    flex: 1,
    color: "#ffffff",
    fontSize: 15,
    marginLeft: 12,
  },

  logoutButton: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 30,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#555555",
    backgroundColor: "#171717",
  },

  logoutText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
});