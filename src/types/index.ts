export type Category = {
  id: string;
  name: string;
  icon: string;
};

export type Product = {
  id: string;
  name: string;
  brand: string;
  price: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  colors: string[];
  sizes: string[];
  categoryId: string;
  isTrending: boolean;
};

export type Review = {
  id: string;
  productId: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
};

export type CartItem = {
  id: string;
  productId: string;
  quantity: number;
};

export type OrderItem = {
  id: string;
  productId: string;
  quantity: number;
  price: number;
};

export type Order = {
  id: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered';
  placedAt: string;
  deliveryStep: number;
};

export type Address = {
  id: string;
  label: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  zip: string;
};

export type ProfilePreference = {
  id: string;
  title: string;
  enabled: boolean;
};
