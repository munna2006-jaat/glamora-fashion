import React, { useState, useEffect } from 'react';
import { Product, Combo, Order, Coupon } from '../types';
import { 
  Shield, 
  DollarSign, 
  ShoppingBag, 
  Package, 
  AlertTriangle, 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  X, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Tag,
  Search,
  ArrowLeft
} from 'lucide-react';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  combos: Combo[];
  onRefreshData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  products,
  combos,
  onRefreshData,
}) => {
  const [activeTab, setActiveTab] = useState<'kpis' | 'products' | 'combos' | 'orders' | 'coupons'>('kpis');
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [editingCombo, setEditingCombo] = useState<Combo | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadStatsAndOrders();
    }
  }, [isOpen]);

  const loadStatsAndOrders = async () => {
    try {
      const [resStats, resOrders] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/orders')
      ]);
      if (resStats.ok) setStats(await resStats.json());
      if (resOrders.ok) setOrders(await resOrders.json());
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen) return null;

  // Handle Product Save
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const url = isNewProduct ? '/api/admin/products' : `/api/admin/products/${editingProduct.id}`;
      const method = isNewProduct ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct)
      });

      if (res.ok) {
        setSaveMessage('Product saved successfully!');
        setEditingProduct(null);
        setIsNewProduct(false);
        onRefreshData();
        loadStatsAndOrders();
        setTimeout(() => setSaveMessage(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Product Delete
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSaveMessage('Product removed.');
        onRefreshData();
        loadStatsAndOrders();
        setTimeout(() => setSaveMessage(''), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handle Order Status Update
  const handleUpdateOrderStatus = async (orderId: string, status: Order['orderStatus']) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        loadStatsAndOrders();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handle Combo Save
  const handleSaveCombo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCombo) return;

    try {
      const res = await fetch(`/api/admin/combos/${editingCombo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCombo)
      });
      if (res.ok) {
        setSaveMessage('Combo updated successfully!');
        setEditingCombo(null);
        onRefreshData();
        loadStatsAndOrders();
        setTimeout(() => setSaveMessage(''), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchFilter.toLowerCase()) ||
    p.category.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-glamora-charcoal/80 backdrop-blur-md flex flex-col animate-fade-in">
      
      {/* Top Admin Navigation Header */}
      <div className="bg-glamora-charcoal text-white px-6 py-4 flex items-center justify-between border-b border-white/10 shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-gray-300 transition"
            title="Return to Store"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl font-bold tracking-wider text-glamora-cream">GLAMORA</span>
              <span className="bg-glamora-rose text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Control Hub
              </span>
            </div>
            <span className="text-[11px] text-gray-400">Master Catalog, Orders & Inventory Manager</span>
          </div>
        </div>

        {/* Tab buttons */}
        <div className="hidden md:flex items-center space-x-1 bg-white/10 p-1 rounded-2xl border border-white/10 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('kpis')}
            className={`px-3.5 py-1.5 rounded-xl transition ${activeTab === 'kpis' ? 'bg-glamora-rose text-white shadow-sm' : 'text-gray-300 hover:text-white'}`}
          >
            Overview & KPIs
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-3.5 py-1.5 rounded-xl transition ${activeTab === 'products' ? 'bg-glamora-rose text-white shadow-sm' : 'text-gray-300 hover:text-white'}`}
          >
            Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('combos')}
            className={`px-3.5 py-1.5 rounded-xl transition ${activeTab === 'combos' ? 'bg-glamora-rose text-white shadow-sm' : 'text-gray-300 hover:text-white'}`}
          >
            Curated Combos ({combos.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3.5 py-1.5 rounded-xl transition ${activeTab === 'orders' ? 'bg-glamora-rose text-white shadow-sm' : 'text-gray-300 hover:text-white'}`}
          >
            Orders ({orders.length})
          </button>
        </div>

        <button
          onClick={onClose}
          className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2 rounded-xl transition"
        >
          Close Hub
        </button>
      </div>

      {saveMessage && (
        <div className="bg-emerald-600 text-white text-xs py-2 px-4 text-center font-semibold">
          ✓ {saveMessage}
        </div>
      )}

      {/* Main Admin Content Body */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-8">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* TAB 1: OVERVIEW & KPIS */}
          {activeTab === 'kpis' && (
            <div className="space-y-6">
              {/* Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Total Revenue</span>
                    <h3 className="font-serif text-2xl font-bold text-glamora-charcoal">
                      ₹{(stats?.totalRevenue || 124890).toLocaleString('en-IN')}
                    </h3>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-glamora-blush text-glamora-rose-dark flex items-center justify-center font-bold">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Total Orders</span>
                    <h3 className="font-serif text-2xl font-bold text-glamora-charcoal">
                      {orders.length}
                    </h3>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Pending Fulfillment</span>
                    <h3 className="font-serif text-2xl font-bold text-glamora-charcoal">
                      {orders.filter(o => o.orderStatus !== 'delivered').length}
                    </h3>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Low Stock Alerts</span>
                    <h3 className="font-serif text-2xl font-bold text-glamora-charcoal">
                      {products.filter(p => p.stock <= 15).length} Items
                    </h3>
                  </div>
                </div>
              </div>

              {/* Quick Order Dispatch Table */}
              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-lg font-bold text-glamora-charcoal">
                    Recent Customer Orders
                  </h3>
                  <button onClick={() => setActiveTab('orders')} className="text-xs text-glamora-rose font-semibold hover:underline">
                    View All Orders →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-gray-50 text-gray-400 font-bold uppercase text-[10px] tracking-wider border-b border-gray-200">
                      <tr>
                        <th className="p-3">Order No.</th>
                        <th className="p-3">Customer</th>
                        <th className="p-3">Items</th>
                        <th className="p-3">Total</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Quick Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {orders.slice(0, 5).map(o => (
                        <tr key={o.id} className="hover:bg-gray-50/50">
                          <td className="p-3 font-mono font-bold text-glamora-charcoal">{o.orderNumber}</td>
                          <td className="p-3 font-medium text-gray-700">{o.shippingAddress.name} ({o.shippingAddress.city})</td>
                          <td className="p-3 text-gray-500">{o.items.length} item(s)</td>
                          <td className="p-3 font-bold text-glamora-charcoal">₹{o.total.toLocaleString('en-IN')}</td>
                          <td className="p-3">
                            <span className="capitalize px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700">
                              {o.orderStatus.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="p-3">
                            <select
                              value={o.orderStatus}
                              onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value as any)}
                              className="bg-gray-100 border border-gray-200 rounded-lg p-1 text-xs font-medium"
                            >
                              <option value="placed">Placed</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="dispatched">Dispatched</option>
                              <option value="out_for_delivery">Out For Delivery</option>
                              <option value="delivered">Delivered</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: PRODUCTS MANAGEMENT */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative max-w-sm flex-1">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search products by title, sku, category..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-glamora-rose"
                  />
                </div>

                <button
                  onClick={() => {
                    setEditingProduct({
                      id: `prod-${Date.now()}`,
                      name: '',
                      sku: `GLM-${Math.floor(100 + Math.random() * 900)}`,
                      category: 'indian',
                      subcategory: 'Kurtis',
                      price: 1299,
                      originalPrice: 1699,
                      priceTier: 'everyday',
                      images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'],
                      description: 'Pure artisan crafted fabric with fine embroidery.',
                      fabric: '100% Breathable Mulmul Cotton',
                      care: 'Hand wash cold',
                      sizes: ['S', 'M', 'L', 'XL'],
                      colors: [{ name: 'Blush', hex: '#D98BA5' }],
                      stock: 30,
                      rating: 4.8,
                      reviewsCount: 12,
                      isNewArrival: true,
                    });
                    setIsNewProduct(true);
                  }}
                  className="bg-glamora-charcoal hover:bg-glamora-rose text-white text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-gray-50 text-gray-400 font-bold uppercase text-[10px] tracking-wider border-b border-gray-200">
                    <tr>
                      <th className="p-3">Product</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Selling Price</th>
                      <th className="p-3">Original Price</th>
                      <th className="p-3">Inventory Stock</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredProducts.map(p => (
                      <tr key={p.id} className="hover:bg-gray-50/50">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <img src={p.images[0]} alt={p.name} className="w-10 h-10 object-cover rounded-lg" />
                            <div>
                              <div className="font-bold text-glamora-charcoal">{p.name}</div>
                              <div className="text-[10px] text-gray-400 font-mono">{p.sku}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 capitalize text-gray-600">{p.category} • {p.subcategory}</td>
                        <td className="p-3 font-serif font-bold text-glamora-charcoal">₹{p.price.toLocaleString('en-IN')}</td>
                        <td className="p-3 text-gray-400 line-through">₹{p.originalPrice?.toLocaleString('en-IN') || '-'}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            p.stock <= 10 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'
                          }`}>
                            {p.stock} units
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingProduct(p);
                              setIsNewProduct(false);
                            }}
                            className="p-1.5 hover:bg-gray-100 rounded-lg text-glamora-charcoal"
                            title="Edit Product"
                          >
                            <Edit3 className="w-4 h-4 text-glamora-rose" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-red-500"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* TAB 3: CURATED COMBOS MANAGEMENT */}
          {activeTab === 'combos' && (
            <div className="space-y-4">
              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
                <h3 className="font-serif text-lg font-bold text-glamora-charcoal mb-4">
                  Curated GLAMORA Combos & Bundles ({combos.length})
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {combos.map(c => (
                    <div key={c.id} className="p-4 rounded-2xl bg-glamora-cream/40 border border-glamora-blush/60 flex gap-4">
                      <img src={c.image} alt={c.title} className="w-24 h-28 object-cover rounded-xl" />
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="font-serif font-bold text-sm text-glamora-charcoal">{c.title}</h4>
                            <span className="text-[10px] font-bold bg-glamora-charcoal text-white px-2 py-0.5 rounded-full">{c.badge}</span>
                          </div>
                          <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{c.tagline}</p>
                          <div className="text-[11px] text-gray-500 mt-2">
                            Included Items ({c.items.length}): {c.items.map(i => i.name).join(', ')}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-glamora-blush/40">
                          <div>
                            <span className="font-serif font-bold text-sm text-glamora-charcoal">₹{c.comboPrice}</span>
                            <span className="text-xs text-gray-400 line-through ml-2">₹{c.originalTotal}</span>
                          </div>
                          <button
                            onClick={() => setEditingCombo(c)}
                            className="bg-white border border-gray-200 hover:border-glamora-rose px-3 py-1 rounded-xl text-xs font-semibold text-glamora-charcoal"
                          >
                            Edit Pricing & Stock
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ORDERS FULFILLMENT */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 space-y-4">
              <h3 className="font-serif text-lg font-bold text-glamora-charcoal">
                Order Fulfillment Pipeline ({orders.length})
              </h3>

              <div className="space-y-3">
                {orders.map(o => (
                  <div key={o.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
                      <div>
                        <span className="font-mono font-bold text-sm text-glamora-charcoal">{o.orderNumber}</span>
                        <span className="ml-2 font-mono text-gray-400">Tracking: {o.trackingId}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-glamora-charcoal">₹{o.total.toLocaleString('en-IN')}</span>
                        <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                          {o.paymentMethod} • {o.paymentStatus}
                        </span>
                      </div>
                    </div>

                    {/* Customer & Address */}
                    <div className="text-xs text-gray-600 bg-white p-3 rounded-xl border border-gray-100">
                      <div className="font-bold text-glamora-charcoal">{o.shippingAddress.name} ({o.shippingAddress.phone})</div>
                      <div>{o.shippingAddress.street}, {o.shippingAddress.city}, {o.shippingAddress.state} - {o.shippingAddress.pincode}</div>
                    </div>

                    {/* Status updater */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-200 text-xs">
                      <span className="text-gray-400">Current Order Status:</span>
                      <select
                        value={o.orderStatus}
                        onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value as any)}
                        className="bg-white border border-gray-300 rounded-xl px-3 py-1.5 font-bold text-glamora-charcoal focus:ring-1 focus:ring-glamora-rose"
                      >
                        <option value="placed">Placed (Pending Inspection)</option>
                        <option value="confirmed">Confirmed & Packaging</option>
                        <option value="dispatched">Dispatched to Courier</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="delivered">Delivered to Customer</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* EDIT PRODUCT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl p-6 shadow-luxury border border-glamora-blush">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-serif text-lg font-bold text-glamora-charcoal">
                {isNewProduct ? 'Create New Product' : `Edit: ${editingProduct.name}`}
              </h3>
              <button onClick={() => setEditingProduct(null)} className="p-1 text-gray-400 hover:text-glamora-charcoal">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-600 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 focus:ring-1 focus:ring-glamora-rose"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-600 mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-600 mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={editingProduct.originalPrice || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-600 mb-1">Category</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as any })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 capitalize"
                  >
                    <option value="indian">Indian</option>
                    <option value="western">Western</option>
                    <option value="accessories">Accessories</option>
                    <option value="footwear">Footwear</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-600 mb-1">Inventory Stock</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-600 mb-1">Image URL</label>
                <input
                  type="text"
                  required
                  value={editingProduct.images[0] || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, images: [e.target.value] })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-600 mb-1">Fabric & Specs</label>
                <input
                  type="text"
                  value={editingProduct.fabric}
                  onChange={(e) => setEditingProduct({ ...editingProduct, fabric: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-glamora-charcoal hover:bg-glamora-rose text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT COMBO MODAL */}
      {editingCombo && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-luxury border border-glamora-blush">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-serif text-lg font-bold text-glamora-charcoal">
                Edit Combo: {editingCombo.title}
              </h3>
              <button onClick={() => setEditingCombo(null)} className="p-1 text-gray-400 hover:text-glamora-charcoal">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCombo} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-600 mb-1">Combo Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={editingCombo.comboPrice}
                    onChange={(e) => setEditingCombo({ 
                      ...editingCombo, 
                      comboPrice: Number(e.target.value),
                      savings: editingCombo.originalTotal - Number(e.target.value)
                    })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-600 mb-1">Original Items Total (₹)</label>
                  <input
                    type="number"
                    value={editingCombo.originalTotal}
                    onChange={(e) => setEditingCombo({ 
                      ...editingCombo, 
                      originalTotal: Number(e.target.value),
                      savings: Number(e.target.value) - editingCombo.comboPrice
                    })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-600 mb-1">Badge Tag</label>
                <input
                  type="text"
                  value={editingCombo.badge}
                  onChange={(e) => setEditingCombo({ ...editingCombo, badge: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingCombo(null)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-glamora-charcoal hover:bg-glamora-rose text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Update Combo</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
