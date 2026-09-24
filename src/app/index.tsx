import { Redirect } from "expo-router";
import {
  ActivityIndicator,
  StyleSheet,
  View,
} from "react-native";
import { useSession } from "../store/sessionStore";

export default function Index() {
  const { role, isLoading } = useSession();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#ffffff" />
      </View>
    );
  }

  if (role === "supplier") {
    return <Redirect href={"./supplier"} />;
  }

  if (role === "customer") {
    return <Redirect href={"./customer"} />;
  }

  return <Redirect href={"./auth"} />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000000",
  },
});