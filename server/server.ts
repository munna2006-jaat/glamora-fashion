import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './db';
import { Order } from '../src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5005;

app.use(cors());
app.use(express.json());

// ================= API ROUTES =================

// Products
app.get('/api/products', (req, res) => {
  try {
    const { category, subcategory, search, tier, minPrice, maxPrice } = req.query;
    let products = db.getProducts();

    if (category && category !== 'all') {
      products = products.filter(p => p.category === category);
    }
    if (subcategory) {
      products = products.filter(p => p.subcategory.toLowerCase() === (subcategory as string).toLowerCase());
    }
    if (tier) {
      products = products.filter(p => p.priceTier === tier);
    }
    if (minPrice) {
      products = products.filter(p => p.price >= Number(minPrice));
    }
    if (maxPrice) {
      products = products.filter(p => p.price <= Number(maxPrice));
    }
    if (search) {
      const q = (search as string).toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
        p.subcategory.toLowerCase().includes(q)
      );
    }

    res.json(products);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/products/:id', (req, res) => {
  const product = db.getProductById(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

// Admin Product CRUD
app.post('/api/admin/products', (req, res) => {
  try {
    const product = db.saveProduct({
      ...req.body,
      id: req.body.id || `prod-${Date.now()}`
    });
    res.json(product);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/products/:id', (req, res) => {
  try {
    const product = db.saveProduct({
      ...req.body,
      id: req.params.id
    });
    res.json(product);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/products/:id', (req, res) => {
  const deleted = db.deleteProduct(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Product not found' });
  res.json({ success: true, message: 'Product deleted' });
});

// Combos
app.get('/api/combos', (req, res) => {
  res.json(db.getCombos());
});

app.get('/api/combos/:id', (req, res) => {
  const combo = db.getComboById(req.params.id);
  if (!combo) return res.status(404).json({ error: 'Combo not found' });
  res.json(combo);
});

// Admin Combo CRUD
app.post('/api/admin/combos', (req, res) => {
  try {
    const combo = db.saveCombo({
      ...req.body,
      id: req.body.id || `combo-${Date.now()}`
    });
    res.json(combo);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/combos/:id', (req, res) => {
  try {
    const combo = db.saveCombo({
      ...req.body,
      id: req.params.id
    });
    res.json(combo);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/combos/:id', (req, res) => {
  const deleted = db.deleteCombo(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Combo not found' });
  res.json({ success: true, message: 'Combo deleted' });
});

// Orders
app.get('/api/orders', (req, res) => {
  res.json(db.getOrders());
});

app.get('/api/orders/track/:trackingId', (req, res) => {
  const order = db.getOrderByTrackingId(req.params.trackingId);
  if (!order) return res.status(404).json({ error: 'Order not found for given tracking or order ID' });
  res.json(order);
});

app.get('/api/orders/:id', (req, res) => {
  const order = db.getOrderById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

app.post('/api/orders', (req, res) => {
  try {
    const orderData = req.body;
    const orderNumber = `GLM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const trackingId = `TRK-GLM-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      trackingId,
      createdAt: new Date().toISOString(),
      items: orderData.items,
      subtotal: orderData.subtotal,
      discount: orderData.discount || 0,
      couponCode: orderData.couponCode || '',
      shipping: orderData.shipping || 0,
      giftWrap: Boolean(orderData.giftWrap),
      total: orderData.total,
      paymentMethod: orderData.paymentMethod || 'upi',
      paymentStatus: orderData.paymentMethod === 'cod' ? 'cod_verified' : 'paid',
      orderStatus: 'confirmed',
      shippingAddress: orderData.shippingAddress,
      estimatedDelivery: '3–5 Business Days',
      statusUpdates: [
        {
          status: 'Order Placed',
          time: 'Just now',
          desc: 'Your GLAMORA order has been verified and received at fulfillment hub'
        },
        {
          status: 'Packaging Queued',
          time: 'Just now',
          desc: 'Our artisans are preparing your luxury packaging with signature ribbons'
        }
      ]
    };

    const savedOrder = db.createOrder(newOrder);
    res.status(201).json(savedOrder);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/orders/:id/status', (req, res) => {
  const { status } = req.body;
  const updated = db.updateOrderStatus(req.params.id, status);
  if (!updated) return res.status(404).json({ error: 'Order not found' });
  res.json(updated);
});

// Coupons
app.get('/api/coupons', (req, res) => {
  res.json(db.getCoupons());
});

app.post('/api/coupons/validate', (req, res) => {
  const { code, amount } = req.body;
  const coupon = db.getCoupons().find(c => c.code.toUpperCase() === (code || '').toUpperCase().trim());
  if (!coupon) {
    return res.status(400).json({ error: 'Invalid coupon code. Try GLAMFIRST or COLLEGE15' });
  }
  if (amount < coupon.minOrder) {
    return res.status(400).json({ error: `Minimum order of ₹${coupon.minOrder} required for ${coupon.code}` });
  }

  let discount = Math.round((amount * coupon.discountPercent) / 100);
  if (coupon.maxDiscount && discount > coupon.maxDiscount) {
    discount = coupon.maxDiscount;
  }

  res.json({
    valid: true,
    code: coupon.code,
    discount,
    description: coupon.description
  });
});

// Reviews
app.get('/api/reviews', (req, res) => {
  res.json(db.getReviews());
});

app.post('/api/reviews', (req, res) => {
  const review = db.addReview({
    id: `rev-${Date.now()}`,
    ...req.body,
    date: 'Just now',
    verified: true
  });
  res.status(201).json(review);
});

// Settings
app.get('/api/settings', (req, res) => {
  res.json(db.getSettings());
});

app.post('/api/admin/settings', (req, res) => {
  try {
    const updated = db.updateSettings(req.body);
    res.json({ success: true, settings: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Stats
app.get('/api/admin/stats', (req, res) => {
  const orders = db.getOrders();
  const products = db.getProducts();
  const combos = db.getCombos();

  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? o.total : 0), 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.orderStatus === 'placed' || o.orderStatus === 'confirmed').length;
  const deliveredOrders = orders.filter(o => o.orderStatus === 'delivered').length;
  const lowStockProducts = products.filter(p => p.stock <= 15);

  res.json({
    totalRevenue,
    totalOrders,
    pendingOrders,
    deliveredOrders,
    productsCount: products.length,
    combosCount: combos.length,
    lowStockProducts
  });
});

// Admin Login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if ((username === 'admin@glamora.com' || username === 'admin') && (password === 'glamora2026' || password === 'admin123')) {
    res.json({
      success: true,
      token: 'jwt-glamora-token-adm2026',
      user: { name: 'Master Admin', email: 'admin@glamora.com', role: 'superadmin' }
    });
  } else {
    res.status(401).json({ error: 'Invalid admin credentials' });
  }
});

// Serve frontend in production
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`GLAMORA Backend API listening at http://localhost:${PORT}`);
});
