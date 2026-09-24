import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
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

import { useCart } from "../../../store/cartStore";
import { useProducts } from "../../../store/productStore";

export default function ProductDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

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

  const product = products.find((item) => item.id === id);

  if (!product) {
    return (
      <View style={styles.container}>
        <View style={styles.notFoundContainer}>
          <Ionicons
            name="alert-circle-outline"
            size={50}
            color="#ffffff"
          />

          <Text style={styles.notFoundTitle}>
            Product Not Found
          </Text>

          <Text style={styles.notFoundText}>
            The product you are looking for is no longer available.
          </Text>

          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>
              Go Back
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const handleAddToCart = () => {
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
        <Pressable
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color="#ffffff"
          />
        </Pressable>

        <Text style={styles.headerTitle}>
          Product Details
        </Text>

        <Pressable
          style={styles.headerButton}
          onPress={() => router.push("/customer/cart")}
        >
          <Ionicons
            name="cart-outline"
            size={25}
            color="#ffffff"
          />

          {cartCount > 0 && (
            <Animated.View
              style={[styles.headerBadge, animatedBadgeStyle]}
            >
              <Text style={styles.headerBadgeText}>
                {cartCount}
              </Text>
            </Animated.View>
          )}
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* PRODUCT IMAGE */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.image }}
            style={styles.productImage}
            resizeMode="cover"
          />
        </View>

        {/* PRODUCT INFORMATION */}
        <View style={styles.infoContainer}>
          <View style={styles.categoryRow}>
            <Text style={styles.category}>
              {product.category}
            </Text>

            <View style={styles.ratingContainer}>
              <Ionicons
                name="star"
                size={16}
                color="#ffffff"
              />

              <Text style={styles.rating}>
                {product.rating}
              </Text>
            </View>
          </View>

          <Text style={styles.productName}>
            {product.name}
          </Text>

          <Text style={styles.price}>
            ₹{product.price.toLocaleString("en-IN")}
          </Text>

          {/* STOCK */}
          <View style={styles.stockRow}>
            <View
              style={[
                styles.stockDot,
                {
                  backgroundColor:
                    product.stock > 0
                      ? "#ffffff"
                      : "#555555",
                },
              ]}
            />

            <Text style={styles.stockText}>
              {product.stock > 0
                ? `${product.stock} units in stock`
                : "Out of stock"}
            </Text>
          </View>

          {/* DESCRIPTION */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Description
            </Text>

            <Text style={styles.description}>
              {product.description}
            </Text>
          </View>

          {/* SPECIFICATIONS */}
          {product.specifications &&
            product.specifications.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  Specifications
                </Text>

                <View style={styles.specificationsContainer}>
                  {product.specifications.map(
                    (specification, index) => (
                      <View
                        key={`${specification.label}-${index}`}
                        style={styles.specificationRow}
                      >
                        <Text style={styles.specificationLabel}>
                          {specification.label}
                        </Text>

                        <Text style={styles.specificationValue}>
                          {specification.value}
                        </Text>
                      </View>
                    )
                  )}
                </View>
              </View>
            )}

          {/* ADD TO CART */}
          <Pressable
            style={[
              styles.addToCartButton,
              product.stock <= 0 &&
                styles.disabledButton,
            ]}
            onPress={handleAddToCart}
            disabled={product.stock <= 0}
          >
            <Ionicons
              name="cart-outline"
              size={22}
              color="#000000"
            />

            <Text style={styles.addToCartText}>
              {product.stock > 0
                ? "Add to Cart"
                : "Out of Stock"}
            </Text>
          </Pressable>

          {/* CONTINUE SHOPPING */}
          <Pressable
            style={styles.continueButton}
            onPress={() => router.push("/customer/product")}
          >
            <Text style={styles.continueButtonText}>
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
    height: 88,
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#000000",
    borderBottomWidth: 1,
    borderBottomColor: "#222222",
  },

  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#151515",
    borderWidth: 1,
    borderColor: "#2b2b2b",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  headerTitle: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "700",
  },

  headerBadge: {
    position: "absolute",
    right: -5,
    top: -5,
    minWidth: 19,
    height: 19,
    borderRadius: 10,
    paddingHorizontal: 4,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },

  headerBadgeText: {
    color: "#000000",
    fontSize: 10,
    fontWeight: "800",
  },

  scroll: {
    flex: 1,
  },

  content: {
    paddingBottom: 40,
  },

  imageContainer: {
    width: "100%",
    height: 360,
    backgroundColor: "#151515",
  },

  productImage: {
    width: "100%",
    height: "100%",
  },

  infoContainer: {
    paddingHorizontal: 22,
    paddingTop: 24,
  },

  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  category: {
    color: "#888888",
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 1,
    fontWeight: "600",
  },

  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  rating: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },

  productName: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "800",
    marginTop: 12,
    lineHeight: 36,
  },

  price: {
    color: "#ffffff",
    fontSize: 25,
    fontWeight: "800",
    marginTop: 12,
  },

  stockRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
  },

  stockDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },

  stockText: {
    color: "#999999",
    fontSize: 14,
  },

  section: {
    marginTop: 30,
  },

  sectionTitle: {
    color: "#ffffff",
    fontSize: 19,
    fontWeight: "700",
    marginBottom: 12,
  },

  description: {
    color: "#a0a0a0",
    fontSize: 15,
    lineHeight: 24,
  },

  specificationsContainer: {
    borderWidth: 1,
    borderColor: "#292929",
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#111111",
  },

  specificationRow: {
    minHeight: 52,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#242424",
  },

  specificationLabel: {
    color: "#888888",
    fontSize: 14,
    flex: 1,
  },

  specificationValue: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "right",
    flex: 1,
  },

  addToCartButton: {
    height: 56,
    marginTop: 32,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  disabledButton: {
    backgroundColor: "#555555",
  },

  addToCartText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "800",
  },

  continueButton: {
    height: 52,
    marginTop: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#333333",
    alignItems: "center",
    justifyContent: "center",
  },

  continueButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },

  notFoundContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  notFoundTitle: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "800",
    marginTop: 18,
  },

  notFoundText: {
    color: "#888888",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    marginTop: 10,
  },

  backButton: {
    marginTop: 25,
    paddingHorizontal: 28,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },

  backButtonText: {
    color: "#000000",
    fontSize: 15,
    fontWeight: "700",
  },
});