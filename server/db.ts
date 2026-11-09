import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Product, Combo, Order, User, Review, Coupon, AppSettings } from '../src/types';
import { MOCK_PRODUCTS, MOCK_COMBOS, MOCK_REVIEWS, MOCK_COUPONS, DEFAULT_SETTINGS } from '../src/data/mockData';

const DB_PATH = path.join(process.cwd(), 'server', 'glamora_store.json');

export interface DatabaseSchema {
  products: Product[];
  combos: Combo[];
  orders: Order[];
  reviews: Review[];
  coupons: Coupon[];
  users: User[];
  settings: AppSettings;
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

const initialOrders: Order[] = [];

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
      settings: DEFAULT_SETTINGS,
      users: [
        {
          id: 'usr-1',
          name: 'Aditi Varma',
          email: 'aditi@example.com',
          phone: '+91 98765 43210',
          addresses: []
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

  deleteOrder(orderId: string): boolean {
    const initialLen = this.data.orders.length;
    this.data.orders = this.data.orders.filter(o => o.id !== orderId && o.orderNumber !== orderId);
    if (this.data.orders.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // Coupons
  getCoupons(): Coupon[] {
    return this.data.coupons;
  }

  // Settings
  getSettings(): AppSettings {
    if (!this.data.settings) {
      this.data.settings = DEFAULT_SETTINGS;
      this.save();
    }
    return this.data.settings;
  }

  updateSettings(newSettings: Partial<AppSettings>): AppSettings {
    this.data.settings = { ...this.getSettings(), ...newSettings };
    this.save();
    return this.data.settings;
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

