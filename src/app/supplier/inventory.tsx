import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useProducts } from "../../store/productStore";

type InventoryProduct = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
};

export default function InventoryScreen() {
  const { products } = useProducts();

  const [inventory, setInventory] = useState<InventoryProduct[]>([]);

  useEffect(() => {
    setInventory(
      products.map((product) => ({
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        stock: Number((product as any).stock ?? 0),
      }))
    );
  }, [products]);

  const increaseStock = (id: string) => {
    setInventory((current) =>
      current.map((product) =>
        product.id === id
          ? { ...product, stock: product.stock + 1 }
          : product
      )
    );
  };

  const decreaseStock = (id: string) => {
    setInventory((current) =>
      current.map((product) =>
        product.id === id
          ? {
              ...product,
              stock: Math.max(0, product.stock - 1),
            }
          : product
      )
    );
  };

  const deleteProduct = (id: string) => {
    setInventory((current) =>
      current.filter((product) => product.id !== id)
    );
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) {
      return {
        label: "Out of Stock",
        style: styles.outOfStock,
      };
    }

    if (stock <= 5) {
      return {
        label: "Low Stock",
        style: styles.lowStock,
      };
    }

    return {
      label: "In Stock",
      style: styles.inStock,
    };
  };

  const totalProducts = inventory.length;

  const totalStock = inventory.reduce(
    (total, product) => total + product.stock,
    0
  );

  const lowStockProducts = inventory.filter(
    (product) => product.stock > 0 && product.stock <= 5
  ).length;

  const outOfStockProducts = inventory.filter(
    (product) => product.stock === 0
  ).length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>‹</Text>
        </Pressable>

        <Text style={styles.headerTitle}>Inventory</Text>

        <View style={styles.headerSpace} />
      </View>

      {/* Summary */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{totalProducts}</Text>
          <Text style={styles.summaryLabel}>Products</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{totalStock}</Text>
          <Text style={styles.summaryLabel}>Total Stock</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{lowStockProducts}</Text>
          <Text style={styles.summaryLabel}>Low Stock</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>
            {outOfStockProducts}
          </Text>
          <Text style={styles.summaryLabel}>Out</Text>
        </View>
      </View>

      {/* Section heading */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Products</Text>
        <Text style={styles.sectionCount}>
          {inventory.length} items
        </Text>
      </View>

      {/* Product list */}
      <FlatList
        data={inventory}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>
              No products available
            </Text>

            <Text style={styles.emptyText}>
              Your products will appear here.
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const status = getStockStatus(item.stock);

          return (
            <View style={styles.productCard}>
              {/* Product information */}
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>
                  {item.name}
                </Text>

                <Text style={styles.category}>
                  {item.category}
                </Text>

                <Text style={styles.price}>
                  ₹{item.price.toLocaleString("en-IN")}
                </Text>

                <View
                  style={[
                    styles.statusBadge,
                    status.style,
                  ]}
                >
                  <Text style={styles.statusText}>
                    {status.label}
                  </Text>
                </View>
              </View>

              {/* Stock controls */}
              <View style={styles.stockSection}>
                <Text style={styles.stockLabel}>Stock</Text>

                <Text style={styles.stockValue}>
                  {item.stock}
                </Text>

                <View style={styles.stockControls}>
                  <Pressable
                    style={styles.controlButton}
                    onPress={() => decreaseStock(item.id)}
                  >
                    <Text style={styles.controlText}>−</Text>
                  </Pressable>

                  <Pressable
                    style={styles.controlButton}
                    onPress={() => increaseStock(item.id)}
                  >
                    <Text style={styles.controlText}>+</Text>
                  </Pressable>
                </View>

                <Pressable
                  style={styles.deleteButton}
                  onPress={() => deleteProduct(item.id)}
                >
                  <Text style={styles.deleteText}>
                    Delete
                  </Text>
                </Pressable>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  header: {
    height: 80,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#171717",
    alignItems: "center",
    justifyContent: "center",
  },

  backText: {
    color: "#fff",
    fontSize: 34,
    lineHeight: 36,
    marginTop: -4,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 21,
    fontWeight: "700",
  },

  headerSpace: {
    width: 44,
  },

  summaryContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 18,
    gap: 8,
  },

  summaryCard: {
    flex: 1,
    minHeight: 82,
    borderRadius: 12,
    backgroundColor: "#151515",
    borderWidth: 1,
    borderColor: "#292929",
    alignItems: "center",
    justifyContent: "center",
  },

  summaryValue: {
    color: "#fff",
    fontSize: 21,
    fontWeight: "700",
  },

  summaryLabel: {
    color: "#888",
    fontSize: 11,
    marginTop: 5,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 10,
  },

  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },

  sectionCount: {
    color: "#777",
    fontSize: 13,
  },

  list: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },

  productCard: {
    flexDirection: "row",
    backgroundColor: "#151515",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#292929",
    padding: 16,
    marginBottom: 12,
  },

  productInfo: {
    flex: 1,
    paddingRight: 12,
  },

  productName: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },

  category: {
    color: "#777",
    fontSize: 13,
    marginTop: 5,
  },

  price: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    marginTop: 8,
  },

  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
    marginTop: 10,
  },

  inStock: {
    backgroundColor: "#173d27",
  },

  lowStock: {
    backgroundColor: "#493b18",
  },

  outOfStock: {
    backgroundColor: "#401b1b",
  },

  statusText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },

  stockSection: {
    width: 105,
    alignItems: "center",
    justifyContent: "center",
  },

  stockLabel: {
    color: "#777",
    fontSize: 12,
  },

  stockValue: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    marginTop: 3,
  },

  stockControls: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },

  controlButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#303030",
    alignItems: "center",
    justifyContent: "center",
  },

  controlText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },

  deleteButton: {
    marginTop: 9,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 7,
    backgroundColor: "#292929",
  },

  deleteText: {
    color: "#aaa",
    fontSize: 11,
    fontWeight: "600",
  },

  emptyState: {
    alignItems: "center",
    paddingTop: 100,
  },

  emptyTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  emptyText: {
    color: "#777",
    fontSize: 14,
    marginTop: 8,
  },
});