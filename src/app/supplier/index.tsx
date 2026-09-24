import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
    Alert,
    Image,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    useWindowDimensions,
    View,
} from "react-native";
import { BarChart, PieChart } from "react-native-gifted-charts";
import { useProducts } from "../../store/productStore";
import { useSession } from "../../store/sessionStore";
import { Product } from "../../types/product";

const revenueData = [
  { value: 42, label: "Jan" },
  { value: 58, label: "Feb" },
  { value: 46, label: "Mar" },
  { value: 74, label: "Apr" },
  { value: 68, label: "May" },
  { value: 86, label: "Jun" },
];

const categoryData = [
  { value: 46, color: "#ffffff", text: "Electronics" },
  { value: 31, color: "#888888", text: "Fashion" },
  { value: 23, color: "#444444", text: "Home" },
];

export default function SupplierDashboard() {
  const { width: screenWidth } = useWindowDimensions();

  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct: deleteProductFromStore,
  } = useProducts();

  const { clearRole } = useSession();

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingProductId, setEditingProductId] =
    useState<string | null>(null);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState("");

  const totalStock = products.reduce(
    (total, product) => total + product.stock,
    0
  );

  const inventoryValue = products.reduce(
    (total, product) =>
      total + product.price * product.stock,
    0
  );

  const lowStockCount = products.filter(
    (product) => product.stock < 25
  ).length;

  const openAddForm = () => {
    setEditingProductId(null);
    setName("");
    setCategory("");
    setPrice("");
    setStock("");
    setImage("");
    setIsFormVisible(true);
  };

  const openEditForm = (product: Product) => {
    setEditingProductId(product.id);
    setName(product.name);
    setCategory(product.category);
    setPrice(String(product.price));
    setStock(String(product.stock));
    setImage(product.image);
    setIsFormVisible(true);
  };

  const saveProduct = () => {
    const parsedPrice = Number(price);
    const parsedStock = Number(stock);

    if (
      !name.trim() ||
      !category.trim() ||
      !image.trim() ||
      !Number.isFinite(parsedPrice) ||
      parsedPrice <= 0 ||
      !Number.isInteger(parsedStock) ||
      parsedStock < 0
    ) {
      Alert.alert(
        "Invalid product",
        "Enter a name, category, image URL, positive price, and valid stock quantity."
      );
      return;
    }

    if (editingProductId) {
      const existingProduct = products.find(
        (product) =>
          product.id === editingProductId
      );

      if (existingProduct) {
        updateProduct({
          ...existingProduct,
          name: name.trim(),
          category: category.trim(),
          price: parsedPrice,
          stock: parsedStock,
          image: image.trim(),
        });
      }
    } else {
      addProduct({
        id: `p${Date.now()}`,
        name: name.trim(),
        category: category.trim(),
        price: parsedPrice,
        stock: parsedStock,
        image: image.trim(),
        description: `${name.trim()} product`,
        rating: 0,
        specifications: [],
      });
    }

    setIsFormVisible(false);
  };

  const deleteProduct = (product: Product) => {
  deleteProductFromStore(product.id);
};

  const updateStock = (
    product: Product,
    newStock: number
  ) => {
    if (newStock < 0) {
      return;
    }

    updateProduct({
      ...product,
      stock: newStock,
    });
  };

  const toggleStockStatus = (
    product: Product
  ) => {
    if (product.stock > 0) {
      updateStock(product, 0);
    } else {
      updateStock(product, 1);
    }
  };

  const switchRole = async () => {
    await clearRole();
    router.replace("/auth");
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>
              SUPPLIER PORTAL
            </Text>

            <Text style={styles.title}>
              Dashboard
            </Text>
          </View>

          <Pressable
            style={styles.profileButton}
            onPress={() => void switchRole()}
          >
            <Ionicons
              name="person-outline"
              size={22}
              color="#ffffff"
            />
          </Pressable>
        </View>

        {/* SUPPORT CHAT */}
        <Pressable
          style={styles.supportChatButton}
          onPress={() =>
            router.push("/supplier/chat")
          }
        >
          <View style={styles.supportChatIcon}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={22}
              color="#000000"
            />
          </View>

          <View
            style={styles.supportChatTextContainer}
          >
            <Text style={styles.supportChatTitle}>
              Customer Support
            </Text>

            <Text
              style={styles.supportChatSubtitle}
            >
              View and reply to customer messages
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color="#000000"
          />
        </Pressable>

        {/* STATISTICS */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons
              name="cube-outline"
              size={22}
              color="#ffffff"
            />

            <Text style={styles.statValue}>
              {products.length}
            </Text>

            <Text style={styles.statLabel}>
              Products
            </Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons
              name="layers-outline"
              size={22}
              color="#ffffff"
            />

            <Text style={styles.statValue}>
              {totalStock}
            </Text>

            <Text style={styles.statLabel}>
              Total Stock
            </Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons
              name="wallet-outline"
              size={22}
              color="#ffffff"
            />

            <Text style={styles.statValue}>
              ₹{inventoryValue.toLocaleString("en-IN")}
            </Text>

            <Text style={styles.statLabel}>
              Inventory Value
            </Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons
              name="warning-outline"
              size={22}
              color="#ffffff"
            />

            <Text style={styles.statValue}>
              {lowStockCount}
            </Text>

            <Text style={styles.statLabel}>
              Low Stock
            </Text>
          </View>
        </View>

        {/* REVENUE */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>
                Revenue Overview
              </Text>

              <Text style={styles.sectionSubtitle}>
                Monthly performance
              </Text>
            </View>
          </View>

          <View style={styles.chartCard}>
            <BarChart
              data={revenueData}
              width={Math.max(
                220,
                screenWidth - 100
              )}
              height={190}
              barWidth={24}
              spacing={22}
              noOfSections={4}
              maxValue={100}
              yAxisThickness={0}
              xAxisThickness={1}
              yAxisTextStyle={styles.chartText}
              xAxisLabelTextStyle={
                styles.chartText
              }
              hideRules
              frontColor="#ffffff"
              roundedTop
            />
          </View>
        </View>

        {/* CATEGORY */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>
                Product Categories
              </Text>

              <Text style={styles.sectionSubtitle}>
                Current inventory distribution
              </Text>
            </View>
          </View>

          <View style={styles.categoryCard}>
            <PieChart
              data={categoryData}
              donut
              radius={75}
              innerRadius={45}
              centerLabelComponent={() => (
                <View>
                  <Text
                    style={styles.centerValue}
                  >
                    {products.length}
                  </Text>

                  <Text
                    style={styles.centerLabel}
                  >
                    Products
                  </Text>
                </View>
              )}
            />

            <View style={styles.legend}>
              {categoryData.map((item) => (
                <View
                  key={item.text}
                  style={styles.legendItem}
                >
                  <View
                    style={[
                      styles.legendDot,
                      {
                        backgroundColor:
                          item.color,
                      },
                    ]}
                  />

                  <Text style={styles.legendText}>
                    {item.text}
                  </Text>

                  <Text
                    style={styles.legendValue}
                  >
                    {item.value}%
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* INVENTORY */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>
                Inventory
              </Text>

              <Text style={styles.sectionSubtitle}>
                Manage your products
              </Text>
            </View>

            <Pressable
              style={styles.addButton}
              onPress={openAddForm}
            >
              <Ionicons
                name="add"
                size={18}
                color="#000000"
              />

              <Text style={styles.addButtonText}>
                Add Product
              </Text>
            </Pressable>
          </View>

          {products.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons
                name="cube-outline"
                size={42}
                color="#555555"
              />

              <Text
                style={styles.emptyTitle}
              >
                No products
              </Text>

              <Text
                style={styles.emptyText}
              >
                Add your first product to start
                managing inventory.
              </Text>
            </View>
          ) : (
            products.map((product) => (
              <View
                key={product.id}
                style={styles.productCard}
              >
                <Image
                  source={{
                    uri: product.image,
                  }}
                  style={styles.productImage}
                />

                <View
                  style={styles.productDetails}
                >
                  <Text
                    style={styles.productName}
                    numberOfLines={1}
                  >
                    {product.name}
                  </Text>

                  <Text
                    style={styles.productCategory}
                  >
                    {product.category}
                  </Text>

                  <Text
                    style={styles.productPrice}
                  >
                    ₹
                    {product.price.toLocaleString(
                      "en-IN"
                    )}
                  </Text>

                  <Text
                    style={styles.productStock}
                  >
                    Stock: {product.stock}
                  </Text>
                </View>

                <View
                  style={styles.productActions}
                >
                  <Pressable
                    style={styles.iconButton}
                    onPress={() =>
                      openEditForm(product)
                    }
                  >
                    <Ionicons
                      name="create-outline"
                      size={17}
                      color="#ffffff"
                    />
                  </Pressable>

                  <Pressable
                    style={styles.iconButton}
                    onPress={() =>
                      toggleStockStatus(
                        product
                      )
                    }
                  >
                    <Ionicons
                      name={
                        product.stock > 0
                          ? "pause-outline"
                          : "play-outline"
                      }
                      size={17}
                      color="#ffffff"
                    />
                  </Pressable>

                  <Pressable
                    style={styles.iconButton}
                    onPress={() =>
                      deleteProduct(product)
                    }
                  >
                    <Ionicons
                      name="trash-outline"
                      size={17}
                      color="#ffffff"
                    />
                  </Pressable>
                </View>
              </View>
            ))
          )}
        </View>

        {/* BACK / ROLE BUTTON */}
        <Pressable
          style={styles.backButton}
          onPress={() => void switchRole()}
        >
          <Ionicons
            name="swap-horizontal-outline"
            size={18}
            color="#000000"
          />

          <Text style={styles.backButtonText}>
            Switch Role
          </Text>
        </Pressable>
      </ScrollView>

      {/* ADD / EDIT PRODUCT MODAL */}
      <Modal
        visible={isFormVisible}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setIsFormVisible(false)
        }
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.formCard}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>
                {editingProductId
                  ? "Edit Product"
                  : "Add Product"}
              </Text>

              <Pressable
                onPress={() =>
                  setIsFormVisible(false)
                }
              >
                <Ionicons
                  name="close"
                  size={24}
                  color="#ffffff"
                />
              </Pressable>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Product name"
              placeholderTextColor="#666666"
              value={name}
              onChangeText={setName}
            />

            <TextInput
              style={styles.input}
              placeholder="Category"
              placeholderTextColor="#666666"
              value={category}
              onChangeText={setCategory}
            />

            <TextInput
              style={styles.input}
              placeholder="Price"
              placeholderTextColor="#666666"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              placeholder="Stock quantity"
              placeholderTextColor="#666666"
              value={stock}
              onChangeText={setStock}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              placeholder="Image URL"
              placeholderTextColor="#666666"
              value={image}
              onChangeText={setImage}
              autoCapitalize="none"
            />

            <Pressable
              style={styles.saveButton}
              onPress={saveProduct}
            >
              <Text
                style={styles.saveButtonText}
              >
                {editingProductId
                  ? "Update Product"
                  : "Add Product"}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },

  content: {
    paddingHorizontal: 18,
    paddingTop: 24,
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  eyebrow: {
    color: "#777777",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
  },

  title: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "800",
    marginTop: 3,
  },

  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#151515",
    alignItems: "center",
    justifyContent: "center",
  },

  supportChatButton: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 15,
    marginBottom: 18,
    borderRadius: 14,
    backgroundColor: "#ffffff",
  },

  supportChatIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eeeeee",
  },

  supportChatTextContainer: {
    flex: 1,
    marginLeft: 12,
  },

  supportChatTitle: {
    color: "#000000",
    fontSize: 15,
    fontWeight: "700",
  },

  supportChatSubtitle: {
    color: "#666666",
    fontSize: 12,
    marginTop: 3,
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },

  statCard: {
    width: "48%",
    minHeight: 120,
    padding: 16,
    borderRadius: 14,
    backgroundColor: "#171717",
    borderWidth: 1,
    borderColor: "#292929",
  },

  statValue: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "800",
    marginTop: 12,
  },

  statLabel: {
    color: "#777777",
    fontSize: 12,
    marginTop: 4,
  },

  section: {
    marginBottom: 24,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  sectionTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },

  sectionSubtitle: {
    color: "#777777",
    fontSize: 12,
    marginTop: 4,
  },

  chartCard: {
    padding: 14,
    borderRadius: 16,
    backgroundColor: "#171717",
    borderWidth: 1,
    borderColor: "#292929",
    overflow: "hidden",
  },

  chartText: {
    color: "#777777",
    fontSize: 10,
  },

  categoryCard: {
    padding: 18,
    borderRadius: 16,
    backgroundColor: "#171717",
    borderWidth: 1,
    borderColor: "#292929",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },

  centerValue: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
  },

  centerLabel: {
    color: "#777777",
    fontSize: 10,
    textAlign: "center",
    marginTop: 2,
  },

  legend: {
    gap: 12,
  },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: 145,
  },

  legendDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    marginRight: 8,
  },

  legendText: {
    flex: 1,
    color: "#ffffff",
    fontSize: 12,
  },

  legendValue: {
    color: "#777777",
    fontSize: 12,
  },

  productCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 10,
    borderRadius: 14,
    backgroundColor: "#171717",
    borderWidth: 1,
    borderColor: "#292929",
  },

  productImage: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: "#222222",
  },

  productDetails: {
    flex: 1,
    marginLeft: 12,
  },

  productName: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },

  productCategory: {
    color: "#777777",
    fontSize: 11,
    marginTop: 3,
  },

  productPrice: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 5,
  },

  productStock: {
    color: "#888888",
    fontSize: 11,
    marginTop: 2,
  },

  productActions: {
    gap: 7,
    marginLeft: 8,
  },

  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#333333",
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 8,
    marginTop: 14,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#ffffff",
  },

  backButtonText: {
    color: "#000000",
    fontSize: 14,
    fontWeight: "700",
  },

  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 9,
    backgroundColor: "#ffffff",
  },

  addButtonText: {
    color: "#000000",
    fontSize: 12,
    fontWeight: "700",
  },

  emptyState: {
    alignItems: "center",
    paddingVertical: 44,
  },

  emptyTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 12,
  },

  emptyText: {
    color: "#777777",
    fontSize: 13,
    textAlign: "center",
    marginTop: 6,
  },

  modalBackdrop: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
  },

  formCard: {
    width: "100%",
    maxWidth: 480,
    padding: 20,
    borderRadius: 18,
    backgroundColor: "#171717",
    borderWidth: 1,
    borderColor: "#333333",
  },

  formHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  formTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",
  },

  input: {
    height: 46,
    paddingHorizontal: 13,
    marginBottom: 11,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "#333333",
    color: "#ffffff",
    backgroundColor: "#0b0b0b",
  },

  saveButton: {
    alignItems: "center",
    paddingVertical: 13,
    marginTop: 5,
    borderRadius: 9,
    backgroundColor: "#ffffff",
  },

  saveButtonText: {
    color: "#000000",
    fontSize: 14,
    fontWeight: "700",
  },
});