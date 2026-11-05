export interface Product {
  id: string;
  name: string;
  sku: string;
  category: 'indian' | 'western' | 'accessories' | 'footwear';
  subcategory: string;
  price: number;
  originalPrice?: number;
  priceTier: 'affordable' | 'everyday' | 'premium' | 'luxury' | 'exclusive';
  images: string[];
  description: string;
  fabric: string;
  care: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  stock: number;
  rating: number;
  reviewsCount: number;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isCollegeGirlEdit?: boolean;
  isFestive?: boolean;
  matchingAccessories?: string[];
  frequentlyBoughtTogether?: string[];
}

export interface ComboItem {
  id?: string;
  productId: string;
  name: string;
  category: string;
  individualPrice: number;
  image: string;
  availableSizes?: string[];
  selectedSize?: string;
}

export interface Combo {
  id: string;
  title: string;
  tagline: string;
  description: string;
  badge: string;
  image: string;
  items: ComboItem[];
  comboPrice: number;
  originalTotal: number;
  savings: number;
  stock: number;
  rating: number;
  reviewsCount: number;
  isLimitedEdition?: boolean;
}

export interface CartItem {
  id: string; // unique cart line id
  productId?: string;
  comboId?: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  size?: string;
  color?: string;
  selectedComboSizes?: { [itemName: string]: string };
  quantity: number;
  isCombo: boolean;
  comboItems?: ComboItem[];
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  trackingId: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  shipping: number;
  giftWrap: boolean;
  total: number;
  paymentMethod: 'upi' | 'card' | 'cod' | 'netbanking';
  paymentStatus: 'paid' | 'pending' | 'cod_verified';
  orderStatus: 'placed' | 'confirmed' | 'dispatched' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'returned';
  shippingAddress: Address;
  estimatedDelivery: string;
  statusUpdates?: { status: string; time: string; desc: string }[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  addresses: Address[];
}

export interface Review {
  id: string;
  userName: string;
  city: string;
  rating: number;
  date: string;
  comment: string;
  productName: string;
  verified: boolean;
  image?: string;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  maxDiscount?: number;
  minOrder: number;
  description: string;
}
