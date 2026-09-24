import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useProducts } from "../../../store/productStore";

export default function ProductScreen() {
  const { products } = useProducts();
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(products.map((product) => product.category))
      ),
    ],
    [products]
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchText.trim().toLowerCase());
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchText]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "All" ||
        product.category === selectedCategory;

      const matchesSearch =
        !debouncedSearch ||
        `${product.name} ${product.category}`
          .toLowerCase()
          .includes(debouncedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [debouncedSearch, products, selectedCategory]);

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.push("/customer")}
        >
          <Text style={styles.backButtonText}>‹</Text>
        </Pressable>

        <Text style={styles.title}>Products</Text>

        <View style={styles.headerSpacer} />
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchIcon}>
          <Text style={styles.searchIconText}>⌕</Text>
        </View>

        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search products"
          placeholderTextColor="#777777"
          style={styles.searchInput}
          autoCapitalize="none"
          autoCorrect={false}
        />

        {searchText.length > 0 && (
          <Pressable
            style={styles.clearButton}
            onPress={() => setSearchText("")}
          >
            <Text style={styles.clearButtonText}>×</Text>
          </Pressable>
        )}
      </View>

      {/* Categories */}
      <FlatList
        horizontal
        data={categories}
        keyExtractor={(category) => category}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryList}
        renderItem={({ item: category }) => (
          <Pressable
            style={[
              styles.categoryChip,
              selectedCategory === category &&
                styles.categoryChipActive,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryChipText,
                selectedCategory === category &&
                  styles.categoryChipTextActive,
              ]}
            >
              {category}
            </Text>
          </Pressable>
        )}
      />

      {/* Products */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No products found</Text>

            <Text style={styles.emptyText}>
              Try a different product name or category.
            </Text>

            <Pressable
              style={styles.clearSearchButton}
              onPress={() => setSearchText("")}
            >
              <Text style={styles.clearSearchButtonText}>
                Clear Search
              </Text>
            </Pressable>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/customer/product/[id]",
                params: { id: item.id },
              })
            }
          >
            <Image
              source={{ uri: item.image }}
              style={styles.image}
            />

            <Text style={styles.name} numberOfLines={2}>
              {item.name}
            </Text>

            <Text style={styles.price}>
              ₹{item.price.toLocaleString("en-IN")}
            </Text>

            <Text style={styles.rating}>
              ★ {item.rating}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: 35,
  },

  /* Header */
  header: {
    height: 65,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#171717",
    borderWidth: 1,
    borderColor: "#292929",
  },

  backButtonText: {
    color: "#ffffff",
    fontSize: 34,
    lineHeight: 36,
    fontWeight: "300",
    marginTop: -3,
  },

  headerSpacer: {
    width: 40,
  },

  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
  },

  /* Search */
  searchContainer: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#292929",
    backgroundColor: "#151515",
  },

  searchIcon: {
    width: 25,
    alignItems: "center",
    justifyContent: "center",
  },

  searchIconText: {
    color: "#aaaaaa",
    fontSize: 24,
    lineHeight: 25,
  },

  searchInput: {
    flex: 1,
    height: 46,
    paddingHorizontal: 8,
    color: "#ffffff",
    fontSize: 14,
  },

  clearButton: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },

  clearButtonText: {
    color: "#aaaaaa",
    fontSize: 24,
    lineHeight: 24,
  },

  /* Categories */
  categoryList: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 8,
  },

  categoryChip: {
    minHeight: 38,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#333333",
    backgroundColor: "#151515",
  },

  categoryChipActive: {
    borderColor: "#ffffff",
    backgroundColor: "#ffffff",
  },

  categoryChipText: {
    color: "#aaaaaa",
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 18,
    textAlign: "center",
  },

  categoryChipTextActive: {
    color: "#000000",
  },

  /* Product List */
  list: {
    paddingHorizontal: 12,
    paddingBottom: 30,
  },

  card: {
    flex: 1,
    backgroundColor: "#151515",
    margin: 8,
    borderRadius: 16,
    padding: 10,
  },

  image: {
    width: "100%",
    height: 150,
    borderRadius: 12,
    backgroundColor: "#222",
  },

  name: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
  },

  price: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    marginTop: 6,
  },

  rating: {
    color: "#aaa",
    fontSize: 14,
    marginTop: 5,
  },

  /* Empty State */
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingTop: 90,
  },

  emptyTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",
  },

  emptyText: {
    color: "#777777",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
  },

  clearSearchButton: {
    marginTop: 20,
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 9,
    backgroundColor: "#ffffff",
  },

  clearSearchButtonText: {
    color: "#000000",
    fontSize: 13,
    fontWeight: "700",
  },
});