import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import {
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring,
} from "react-native-reanimated";
import { useCart } from "../../store/cartStore";
import { useProducts } from "../../store/productStore";

export default function CustomerHome() {
  const router = useRouter();

  const { products } = useProducts();
  const { addToCart, cartCount } = useCart();

  const badgeScale = useSharedValue(1);

  useEffect(() => {
    if (cartCount > 0) {
      badgeScale.value = withSequence(
        withSpring(1.25),
        withSpring(1)
      );
    }
  }, [badgeScale, cartCount]);

  const animatedBadgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
  }));

  const handleAddToCart = (product: (typeof products)[0]) => {
    if (product.stock <= 0) {
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      rating: product.rating,
    });
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Welcome back</Text>
          <Text style={styles.logo}>SHOPLY</Text>
        </View>

        {/* HEADER ACTIONS */}
        <View style={styles.headerActions}>
          {/* SUPPORT CHAT */}
          <Pressable
            style={styles.profileButton}
            onPress={() => router.push("/customer/chat")}
          >
            <Ionicons
              name="chatbubble-outline"
              size={22}
              color="#ffffff"
            />
          </Pressable>

          {/* PROFILE */}
          <Pressable
            style={styles.profileButton}
            onPress={() => router.push("/customer/profile")}
          >
            <Ionicons
              name="person-outline"
              size={22}
              color="#ffffff"
            />
          </Pressable>
        </View>
      </View>

      {/* PRODUCTS */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.productGrid}
        showsVerticalScrollIndicator={false}
      >
        {products.map((product) => (
          <View key={product.id} style={styles.productCard}>
            {/* PRODUCT IMAGE / DETAILS */}
            <Pressable
              style={styles.productContent}
              onPress={() =>
                router.push(`/customer/product?id=${product.id}`)
              }
            >
              <Image
                source={{ uri: product.image }}
                style={styles.productImage}
              />

              <View style={styles.productInfo}>
                <Text
                  style={styles.productName}
                  numberOfLines={1}
                >
                  {product.name}
                </Text>

                <View style={styles.ratingRow}>
                  <Ionicons
                    name="star"
                    size={15}
                    color="#ffffff"
                  />

                  <Text style={styles.ratingText}>
                    {product.rating}
                  </Text>
                </View>

                <Text style={styles.productPrice}>
                  ₹{product.price.toLocaleString("en-IN")}
                </Text>
              </View>
            </Pressable>

            {/* HEART */}
            <Pressable
              style={styles.heartButton}
              onPress={() => {
                console.log(
                  `${product.name} added to wishlist`
                );
              }}
            >
              <Ionicons
                name="heart-outline"
                size={23}
                color="#ffffff"
              />
            </Pressable>

            {/* ADD TO CART */}
            <Pressable
              style={[
                styles.addButton,
                product.stock <= 0 && styles.addButtonDisabled,
              ]}
              onPress={() => handleAddToCart(product)}
              disabled={product.stock <= 0}
            >
              <Text style={styles.addButtonText}>
                {product.stock <= 0 ? "×" : "+"}
              </Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>

      {/* BOTTOM NAVIGATION */}
      <View style={styles.bottomNav}>
        {/* HOME */}
        <Pressable
          style={styles.navItem}
          onPress={() => router.replace("/customer")}
        >
          <Ionicons
            name="home"
            size={23}
            color="#ffffff"
          />

          <Text style={[styles.navText, styles.navTextActive]}>
            Home
          </Text>
        </Pressable>

        {/* PRODUCTS */}
        <Pressable
          style={styles.navItem}
          onPress={() =>
            router.push("/customer/product")
          }
        >
          <Ionicons
            name="grid-outline"
            size={23}
            color="#777777"
          />

          <Text style={styles.navText}>
            Products
          </Text>
        </Pressable>

        {/* CART */}
        <Pressable
          style={styles.navItem}
          onPress={() => router.push("/customer/cart")}
        >
          <View style={styles.cartIconContainer}>
            <Ionicons
              name="cart-outline"
              size={23}
              color="#777777"
            />

            {cartCount > 0 && (
              <Animated.View
                style={[
                  styles.cartBadge,
                  animatedBadgeStyle,
                ]}
              >
                <Text style={styles.cartBadgeText}>
                  {cartCount}
                </Text>
              </Animated.View>
            )}
          </View>

          <Text style={styles.navText}>
            Cart
          </Text>
        </Pressable>

        {/* PROFILE */}
        <Pressable
          style={styles.navItem}
          onPress={() =>
            router.push("/customer/profile")
          }
        >
          <Ionicons
            name="person-outline"
            size={23}
            color="#777777"
          />

          <Text style={styles.navText}>
            Profile
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

  /* HEADER */
  header: {
    height: 105,
    paddingHorizontal: 20,
    paddingTop: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  welcome: {
    color: "#777777",
    fontSize: 14,
    marginBottom: 3,
  },

  logo: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 1,
  },

  profileButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#151515",
    borderWidth: 1,
    borderColor: "#292929",
    alignItems: "center",
    justifyContent: "center",
  },

  /* PRODUCTS */
  scroll: {
    flex: 1,
  },

  productGrid: {
    paddingHorizontal: 14,
    paddingBottom: 100,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  productCard: {
    width: "48.5%",
    backgroundColor: "#171717",
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 14,
    position: "relative",
  },

  productContent: {
    width: "100%",
  },

  productImage: {
    width: "100%",
    height: 205,
    backgroundColor: "#222222",
  },

  productInfo: {
    padding: 12,
  },

  productName: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 7,
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 8,
  },

  ratingText: {
    color: "#aaaaaa",
    fontSize: 13,
  },

  productPrice: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
  },

  /* HEART */
  heartButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#333333",
    alignItems: "center",
    justifyContent: "center",
  },

  /* ADD BUTTON */
  addButton: {
    position: "absolute",
    right: 12,
    bottom: 12,
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },

  addButtonDisabled: {
    backgroundColor: "#444444",
  },

  addButtonText: {
    color: "#000000",
    fontSize: 28,
    fontWeight: "500",
    lineHeight: 30,
  },

  /* BOTTOM NAVIGATION */
  bottomNav: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 82,
    backgroundColor: "#050505",
    borderTopWidth: 1,
    borderTopColor: "#242424",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingBottom: 6,
  },

  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  navText: {
    color: "#777777",
    fontSize: 12,
    marginTop: 5,
  },

  navTextActive: {
    color: "#ffffff",
    fontWeight: "600",
  },

  /* CART BADGE */
  cartIconContainer: {
    position: "relative",
  },

  cartBadge: {
    position: "absolute",
    right: -9,
    top: -9,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },

  cartBadgeText: {
    color: "#000000",
    fontSize: 10,
    fontWeight: "800",
  },
});