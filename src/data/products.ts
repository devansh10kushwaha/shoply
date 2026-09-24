import { Product } from "@/types/product";

export const products: Product[] = [
  {
    id: "p1",
    name: "Wireless Headphones",
    category: "Electronics",
    price: 2499,
    description:
      "Wireless over-ear headphones with active noise cancellation and long battery life.",
    rating: 4.6,
    stock: 24,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    specifications: [
      { label: "Battery", value: "30 hours" },
      { label: "Connectivity", value: "Bluetooth 5.3" },
      { label: "Weight", value: "250 g" },
    ],
  },
  {
    id: "p2",
    name: "Smart Watch",
    category: "Electronics",
    price: 3999,
    description:
      "Modern smartwatch with fitness tracking, notifications, and health monitoring.",
    rating: 4.4,
    stock: 18,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    specifications: [
      { label: "Display", value: "AMOLED" },
      { label: "Battery", value: "7 days" },
      { label: "Water Resistance", value: "5 ATM" },
    ],
  },
  {
    id: "p3",
    name: "Running Shoes",
    category: "Fashion",
    price: 3299,
    description:
      "Lightweight running shoes designed for daily training and comfortable movement.",
    rating: 4.5,
    stock: 32,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    specifications: [
      { label: "Material", value: "Mesh" },
      { label: "Sole", value: "Rubber" },
      { label: "Type", value: "Running" },
    ],
  },
  {
    id: "p4",
    name: "Minimal Backpack",
    category: "Fashion",
    price: 1899,
    description:
      "Minimal everyday backpack with laptop compartment and water-resistant fabric.",
    rating: 4.3,
    stock: 27,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
    specifications: [
      { label: "Capacity", value: "22 L" },
      { label: "Material", value: "Polyester" },
      { label: "Laptop Size", value: "Up to 15.6 inch" },
    ],
  },
  {
    id: "p5",
    name: "Desk Lamp",
    category: "Home",
    price: 1299,
    description:
      "Adjustable LED desk lamp suitable for study, work, and reading.",
    rating: 4.2,
    stock: 41,
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c",
    specifications: [
      { label: "Light Type", value: "LED" },
      { label: "Modes", value: "3" },
      { label: "Power", value: "12 W" },
    ],
  },
  {
    id: "p6",
    name: "Ceramic Coffee Mug",
    category: "Home",
    price: 599,
    description:
      "Simple ceramic coffee mug suitable for home and office use.",
    rating: 4.7,
    stock: 56,
    image:
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d",
    specifications: [
      { label: "Material", value: "Ceramic" },
      { label: "Capacity", value: "350 ml" },
      { label: "Microwave Safe", value: "Yes" },
    ],
  },
];