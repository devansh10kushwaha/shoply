export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  rating: number;
  stock: number;
  image: string;
  specifications: {
    label: string;
    value: string;
  }[];
};