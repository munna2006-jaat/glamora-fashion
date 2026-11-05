import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Product, Combo, Order, User, Review, Coupon } from '../src/types';
import { MOCK_PRODUCTS, MOCK_COMBOS, MOCK_REVIEWS, MOCK_COUPONS } from '../src/data/mockData';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'glamora_store.json');

export interface DatabaseSchema {
  products: Product[];
  combos: Combo[];
  orders: Order[];
  reviews: Review[];
  coupons: Coupon[];
  users: User[];
  admin: {
    username: string;
    passwordHash: string; // Plain/simple for demo
    role: string;
  };
}

const defaultAdmin = {
  username: 'admin@glamora.com',
  passwordHash: 'glamora2026',
  role: 'superadmin'
};

const initialOrders: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'GLM-2026-9812',
    trackingId: 'TRK-GLM-88902',
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    items: [
      {
        id: 'item-1',
        comboId: 'combo-1',
        name: 'DESI DARLING COMBO',
        price: 1999,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
        isCombo: true,
        selectedComboSizes: { 'Gulabi Rose Handblock Tiered Anarkali Kurti': 'M' }
      }
    ],
    subtotal: 1999,
    discount: 200,
    couponCode: 'GLAMFIRST',
    shipping: 0,
    giftWrap: true,
    total: 1799,
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    orderStatus: 'dispatched',
    shippingAddress: {
      id: 'addr-1',
      name: 'Aditi Varma',
      phone: '+91 98765 43210',
      street: 'Flat 402, Sunshine Towers, Koramangala',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560034'
    },
    estimatedDelivery: 'Tomorrow, 5:00 PM',
    statusUpdates: [
      { status: 'Order Placed', time: '2 days ago', desc: 'Order verified and sent to packaging unit' },
      { status: 'Quality Checked', time: 'Yesterday', desc: 'All combo items inspected & packed in signature blush box' },
      { status: 'Dispatched', time: 'Today, 9:30 AM', desc: 'Handed over to BlueDart Express. Tracking #BLU-992147' }
    ]
  }
];

class StorageEngine {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_PATH)) {
        const fileContent = fs.readFileSync(DB_PATH, 'utf-8');
        return JSON.parse(fileContent);
      }
    } catch (e) {
      console.error('Failed reading glamora_store.json, creating fresh:', e);
    }

    const initial: DatabaseSchema = {
      products: MOCK_PRODUCTS,
      combos: MOCK_COMBOS,
      orders: initialOrders,
      reviews: MOCK_REVIEWS,
      coupons: MOCK_COUPONS,
      users: [
        {
          id: 'usr-1',
          name: 'Aditi Varma',
          email: 'aditi@example.com',
          phone: '+91 98765 43210',
          addresses: [initialOrders[0].shippingAddress]
        }
      ],
      admin: defaultAdmin
    };
    this.save(initial);
    return initial;
  }

  private save(dataToSave?: DatabaseSchema) {
    try {
      fs.writeFileSync(DB_PATH, JSON.stringify(dataToSave || this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed writing to glamora_store.json:', err);
    }
  }

  // Products
  getProducts(): Product[] {
    return this.data.products;
  }

  getProductById(id: string): Product | undefined {
    return this.data.products.find(p => p.id === id);
  }

  saveProduct(product: Product): Product {
    const idx = this.data.products.findIndex(p => p.id === product.id);
    if (idx >= 0) {
      this.data.products[idx] = product;
    } else {
      this.data.products.unshift(product);
    }
    this.save();
    return product;
  }

  deleteProduct(id: string): boolean {
    const initialLen = this.data.products.length;
    this.data.products = this.data.products.filter(p => p.id !== id);
    if (this.data.products.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // Combos
  getCombos(): Combo[] {
    return this.data.combos;
  }

  getComboById(id: string): Combo | undefined {
    return this.data.combos.find(c => c.id === id);
  }

  saveCombo(combo: Combo): Combo {
    const idx = this.data.combos.findIndex(c => c.id === combo.id);
    if (idx >= 0) {
      this.data.combos[idx] = combo;
    } else {
      this.data.combos.unshift(combo);
    }
    this.save();
    return combo;
  }

  deleteCombo(id: string): boolean {
    const initialLen = this.data.combos.length;
    this.data.combos = this.data.combos.filter(c => c.id !== id);
    if (this.data.combos.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // Orders
  getOrders(): Order[] {
    return this.data.orders;
  }

  getOrderById(id: string): Order | undefined {
    return this.data.orders.find(o => o.id === id || o.orderNumber === id);
  }

  getOrderByTrackingId(trackingId: string): Order | undefined {
    return this.data.orders.find(o => o.trackingId.toLowerCase() === trackingId.toLowerCase() || o.orderNumber.toLowerCase() === trackingId.toLowerCase());
  }

  createOrder(order: Order): Order {
    this.data.orders.unshift(order);
    // Deduct stock for products and combos
    order.items.forEach(item => {
      if (item.productId) {
        const p = this.getProductById(item.productId);
        if (p) p.stock = Math.max(0, p.stock - item.quantity);
      }
      if (item.comboId) {
        const c = this.getComboById(item.comboId);
        if (c) {
          c.stock = Math.max(0, c.stock - item.quantity);
          // Deduct included items stock too
          c.items.forEach(ci => {
            const cp = this.getProductById(ci.productId);
            if (cp) cp.stock = Math.max(0, cp.stock - item.quantity);
          });
        }
      }
    });
    this.save();
    return order;
  }

  updateOrderStatus(orderId: string, status: Order['orderStatus']): Order | undefined {
    const order = this.data.orders.find(o => o.id === orderId || o.orderNumber === orderId);
    if (order) {
      order.orderStatus = status;
      if (!order.statusUpdates) order.statusUpdates = [];
      order.statusUpdates.push({
        status: status.toUpperCase().replace('_', ' '),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Today',
        desc: `Status updated to ${status.replace('_', ' ')}`
      });
      this.save();
      return order;
    }
    return undefined;
  }

  // Coupons
  getCoupons(): Coupon[] {
    return this.data.coupons;
  }

  // Reviews
  getReviews(): Review[] {
    return this.data.reviews;
  }

  addReview(review: Review): Review {
    this.data.reviews.unshift(review);
    this.save();
    return review;
  }
}

export const db = new StorageEngine();
