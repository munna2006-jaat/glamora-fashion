import React, { useState, useEffect } from 'react';
import { Product, Combo, Order, AppSettings } from '../types';
import { 
  Shield, 
  DollarSign, 
  ShoppingBag, 
  AlertTriangle, 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  X, 
  Clock, 
  QrCode,
  Upload,
  Search,
  ArrowLeft,
  Settings,
  Lock,
  LogOut,
  Image as ImageIcon
} from 'lucide-react';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  combos: Combo[];
  settings: AppSettings;
  onRefreshData: () => void;
  onUpdateSettings: (settings: AppSettings) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  products,
  combos,
  settings,
  onRefreshData,
  onUpdateSettings,
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('glamora_admin_auth') === 'true';
  });
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');

  // Dashboard Tabs
  const [activeTab, setActiveTab] = useState<'kpis' | 'products' | 'combos' | 'qr' | 'orders' | 'settings'>('kpis');
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [editingCombo, setEditingCombo] = useState<Combo | null>(null);
  const [isNewCombo, setIsNewCombo] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [saveMessage, setSaveMessage] = useState('');

  // QR Code & Settings Form State
  const [qrUpiId, setQrUpiId] = useState(settings?.upiId || 'glamora@upi');
  const [qrUpiName, setQrUpiName] = useState(settings?.upiName || 'GLAMORA FASHION PVT LTD');
  const [qrPreviewUrl, setQrPreviewUrl] = useState(settings?.qrCodeUrl || '');
  const [announcement, setAnnouncement] = useState(settings?.announcementText || '');
  const [whatsapp, setWhatsapp] = useState(settings?.whatsappNumber || '+91 98765 43210');
  const [freeShippingAbove, setFreeShippingAbove] = useState(settings?.freeShippingAbove || 799);

  useEffect(() => {
    if (settings) {
      setQrUpiId(settings.upiId);
      setQrUpiName(settings.upiName);
      setQrPreviewUrl(settings.qrCodeUrl);
      setAnnouncement(settings.announcementText);
      setWhatsapp(settings.whatsappNumber);
      setFreeShippingAbove(settings.freeShippingAbove);
    }
  }, [settings]);

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadStatsAndOrders();
    }
  }, [isOpen, isAuthenticated]);

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

  // Handle Admin Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      (loginUser.trim() === 'admin' || loginUser.trim() === 'admin@glamora.com') &&
      (loginPass.trim() === 'glamora2026' || loginPass.trim() === 'admin123')
    ) {
      setIsAuthenticated(true);
      localStorage.setItem('glamora_admin_auth', 'true');
      setLoginError('');
      loadStatsAndOrders();
    } else {
      setLoginError('Invalid credentials! Default: admin / glamora2026');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('glamora_admin_auth');
  };

  // QR Code Image File Upload Handler
  const handleQrFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setQrPreviewUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Save Settings & QR Code
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSettings: AppSettings = {
      upiId: qrUpiId,
      upiName: qrUpiName,
      qrCodeUrl: qrPreviewUrl,
      announcementText: announcement,
      whatsappNumber: whatsapp,
      shippingCharge: 70,
      freeShippingAbove: Number(freeShippingAbove)
    };

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings)
      });
      if (res.ok) {
        onUpdateSettings(updatedSettings);
        setSaveMessage('QR Code & Website Settings updated successfully!');
        setTimeout(() => setSaveMessage(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

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
        setSaveMessage('Product catalog saved successfully!');
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

  // Handle Product Image Upload
  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProduct) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        const currentImgs = editingProduct.images || [];
        setEditingProduct({
          ...editingProduct,
          images: [reader.result, ...currentImgs.filter(img => img !== reader.result)]
        });
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Combo Image Upload
  const handleComboImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingCombo) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setEditingCombo({
          ...editingCombo,
          image: reader.result
        });
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Combo Save
  const handleSaveCombo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCombo) return;

    try {
      const url = isNewCombo ? '/api/admin/combos' : `/api/admin/combos/${editingCombo.id}`;
      const method = isNewCombo ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCombo)
      });
      if (res.ok) {
        setSaveMessage(isNewCombo ? 'New Combo created successfully!' : 'Combo updated successfully!');
        setEditingCombo(null);
        setIsNewCombo(false);
        onRefreshData();
        loadStatsAndOrders();
        setTimeout(() => setSaveMessage(''), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handle Combo Delete
  const handleDeleteCombo = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this combo?')) return;
    try {
      const res = await fetch(`/api/admin/combos/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSaveMessage('Combo removed from store.');
        onRefreshData();
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
    <div className="fixed inset-0 z-50 overflow-hidden bg-glamora-charcoal/90 backdrop-blur-md flex flex-col animate-fade-in">
      
      {/* Top Admin Bar */}
      <div className="bg-glamora-charcoal text-white px-4 sm:px-6 py-3.5 flex items-center justify-between border-b border-white/10 shadow-lg">
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
              <span className="font-serif text-lg sm:text-xl font-bold tracking-wider text-glamora-cream">GLAMORA</span>
              <span className="bg-glamora-rose text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Admin Control Hub
              </span>
            </div>
            <span className="text-[11px] text-gray-400 hidden sm:inline">Direct Access: /admin</span>
          </div>
        </div>

        {isAuthenticated && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs px-3 py-1.5 rounded-xl border border-red-500/30 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
            <button
              onClick={onClose}
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition"
            >
              Exit
            </button>
          </div>
        )}
      </div>

      {saveMessage && (
        <div className="bg-emerald-600 text-white text-xs py-2 px-4 text-center font-semibold animate-fade-in">
          ✓ {saveMessage}
        </div>
      )}

      {/* LOGIN SCREEN IF NOT AUTHENTICATED */}
      {!isAuthenticated ? (
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-luxury border border-glamora-blush">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-glamora-cream border border-glamora-blush flex items-center justify-center mx-auto mb-3">
                <Lock className="w-8 h-8 text-glamora-rose" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-glamora-charcoal">GLAMORA Master Admin</h2>
              <p className="text-xs text-gray-500 mt-1">Enter credentials to manage products, QR code & orders</p>
            </div>

            {loginError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-xs border border-red-200 font-medium">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Username / Email</label>
                <input
                  type="text"
                  required
                  placeholder="admin@glamora.com"
                  value={loginUser}
                  onChange={(e) => setLoginUser(e.target.value)}
                  className="w-full bg-glamora-cream/50 border border-glamora-blush rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-glamora-rose"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  className="w-full bg-glamora-cream/50 border border-glamora-blush rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-glamora-rose"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-glamora-charcoal hover:bg-glamora-rose text-white text-sm font-bold py-3.5 rounded-xl transition shadow-md cursor-pointer"
                >
                  Login to Admin Panel
                </button>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl text-[11px] text-gray-500 text-center border border-gray-100">
                Default Credentials: Username: <b className="text-glamora-charcoal">admin</b> | Password: <b className="text-glamora-charcoal">glamora2026</b>
              </div>
            </form>
          </div>
        </div>
      ) : (
        /* AUTHENTICATED ADMIN DASHBOARD */
        <div className="flex-1 overflow-y-auto bg-gray-50 flex flex-col">
          
          {/* Navigation Tab Bar */}
          <div className="bg-white border-b border-gray-200 px-4 sm:px-8 py-2.5 overflow-x-auto scrollbar-none flex items-center gap-2">
            <button
              onClick={() => setActiveTab('kpis')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                activeTab === 'kpis' ? 'bg-glamora-charcoal text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Overview & KPIs
            </button>
            <button
              onClick={() => setActiveTab('qr')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                activeTab === 'qr' ? 'bg-glamora-rose text-white shadow-sm' : 'bg-glamora-blush/60 text-glamora-rose-dark hover:bg-glamora-blush'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>UPI & QR Code Manager</span>
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                activeTab === 'products' ? 'bg-glamora-charcoal text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Products Catalog ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('combos')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                activeTab === 'combos' ? 'bg-glamora-charcoal text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Combos Manager ({combos.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                activeTab === 'orders' ? 'bg-glamora-charcoal text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Customer Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                activeTab === 'settings' ? 'bg-glamora-charcoal text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Full Store Access</span>
            </button>
          </div>

          {/* Tab Content Area */}
          <div className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-6">

            {/* TAB: UPI & QR CODE MANAGER */}
            {activeTab === 'qr' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-2 mb-2">
                    <QrCode className="w-5 h-5 text-glamora-rose" />
                    <h3 className="font-serif text-xl font-bold text-glamora-charcoal">
                      Payment QR Code & UPI Configuration
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 mb-6">
                    Customer jab bhi checkout par Instant UPI select karega, unhe yeh QR Code aur UPI ID dikhega. Aap apna khud ka PhonePe / GooglePay / Paytm QR code upload kar sakte hain.
                  </p>

                  <form onSubmit={handleSaveSettings} className="space-y-5 text-xs">
                    
                    {/* Live Preview & Upload Box */}
                    <div className="p-4 rounded-2xl bg-glamora-cream/60 border border-glamora-blush flex flex-col sm:flex-row items-center gap-6">
                      <div className="bg-white p-3 rounded-2xl border border-glamora-blush/60 shadow-sm text-center">
                        <img
                          src={qrPreviewUrl || 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=glamora@upi&pn=GLAMORA%20FASHION&cu=INR'}
                          alt="Current UPI QR Code"
                          className="w-36 h-36 object-contain rounded-xl mx-auto"
                        />
                        <span className="text-[10px] text-gray-500 font-bold block mt-1.5">LIVE SCANNER PREVIEW</span>
                      </div>

                      <div className="flex-1 space-y-3 w-full">
                        <div>
                          <label className="block font-bold text-glamora-charcoal mb-1">
                            Option 1: Upload QR Code Image from Device
                          </label>
                          <label className="flex items-center gap-2 p-2.5 bg-white border border-dashed border-glamora-rose rounded-xl cursor-pointer hover:bg-glamora-blush/20 transition">
                            <Upload className="w-4 h-4 text-glamora-rose" />
                            <span className="text-xs text-glamora-rose font-semibold">Choose QR Image File (JPG/PNG)</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleQrFileUpload}
                              className="hidden"
                            />
                          </label>
                        </div>

                        <div>
                          <label className="block font-bold text-glamora-charcoal mb-1">
                            Option 2: Direct Image URL
                          </label>
                          <input
                            type="text"
                            placeholder="https://..."
                            value={qrPreviewUrl}
                            onChange={(e) => setQrPreviewUrl(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl p-2.5 font-mono text-xs focus:ring-1 focus:ring-glamora-rose"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">UPI ID / VPA *</label>
                        <input
                          type="text"
                          required
                          value={qrUpiId}
                          onChange={(e) => setQrUpiId(e.target.value)}
                          placeholder="e.g. mobile@upi or yourname@okhdfcbank"
                          className="w-full bg-white border border-gray-200 rounded-xl p-2.5 font-bold text-glamora-charcoal focus:ring-1 focus:ring-glamora-rose"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Payee Name (Shown to Customer) *</label>
                        <input
                          type="text"
                          required
                          value={qrUpiName}
                          onChange={(e) => setQrUpiName(e.target.value)}
                          placeholder="e.g. GLAMORA FASHION"
                          className="w-full bg-white border border-gray-200 rounded-xl p-2.5 font-bold text-glamora-charcoal focus:ring-1 focus:ring-glamora-rose"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="bg-glamora-charcoal hover:bg-glamora-rose text-white text-xs font-bold px-6 py-3 rounded-xl transition flex items-center gap-2 shadow-sm cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save & Update Checkout QR</span>
                      </button>
                    </div>

                  </form>
                </div>
              </div>
            )}

            {/* TAB: KPIS & OVERVIEW */}
            {activeTab === 'kpis' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                      <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Total Sales</span>
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
                      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Pending Delivery</span>
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
                      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Low Stock</span>
                      <h3 className="font-serif text-2xl font-bold text-glamora-charcoal">
                        {products.filter(p => p.stock <= 15).length} Items
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Quick Orders Overview */}
                <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-serif text-lg font-bold text-glamora-charcoal">
                      Recent Customer Purchases
                    </h3>
                    <button onClick={() => setActiveTab('orders')} className="text-xs text-glamora-rose font-semibold hover:underline">
                      View Full Table →
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-gray-50 text-gray-400 font-bold uppercase text-[10px] tracking-wider border-b border-gray-200">
                        <tr>
                          <th className="p-3">Order No.</th>
                          <th className="p-3">Customer</th>
                          <th className="p-3">Total Amount</th>
                          <th className="p-3">Status</th>
                          <th className="p-3">Update Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {orders.slice(0, 5).map(o => (
                          <tr key={o.id} className="hover:bg-gray-50/50">
                            <td className="p-3 font-mono font-bold text-glamora-charcoal">{o.orderNumber}</td>
                            <td className="p-3 font-medium text-gray-700">{o.shippingAddress.name} ({o.shippingAddress.city})</td>
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

            {/* TAB: PRODUCTS CATALOG (FULL ACCESS & EDIT) */}
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
                        price: 499,
                        originalPrice: 999,
                        priceTier: 'affordable',
                        images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'],
                        description: 'Pure Rajasthani handblock cotton kurti with elegant detailing.',
                        fabric: '100% Breathable Jaipur Cotton',
                        care: 'Gentle hand wash cold',
                        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
                        colors: [{ name: 'Gulabi Rose', hex: '#D98BA5' }],
                        stock: 50,
                        rating: 4.9,
                        reviewsCount: 15,
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
                        <th className="p-3">Stock Units</th>
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
                              {p.stock} in stock
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

            {/* TAB: COMBOS MANAGER */}
            {activeTab === 'combos' && (
              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-glamora-charcoal">
                      Curated Rajasthani Combos & Offers ({combos.length})
                    </h3>
                    <p className="text-xs text-gray-500">Edit combo discount pricing, badge tags, upload photos, and create new combos</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingCombo({
                        id: `combo-${Date.now()}`,
                        title: '',
                        tagline: '',
                        description: '',
                        badge: 'SPECIAL COMBO',
                        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
                        items: [
                          {
                            productId: 'item-1',
                            name: 'Rajasthani Handblock Kurti',
                            category: 'Kurti',
                            individualPrice: 499,
                            image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
                            availableSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
                          },
                          {
                            productId: 'item-2',
                            name: '18K Minakari Chandbali Jhumka',
                            category: 'Accessory',
                            individualPrice: 399,
                            image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&q=80'
                          }
                        ],
                        comboPrice: 499,
                        originalTotal: 898,
                        savings: 399,
                        stock: 50,
                        rating: 4.9,
                        reviewsCount: 88,
                      });
                      setIsNewCombo(true);
                    }}
                    className="bg-glamora-rose hover:bg-glamora-rose-dark text-white text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create New Combo</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {combos.map(c => (
                    <div key={c.id} className="p-4 rounded-2xl bg-glamora-cream/40 border border-glamora-blush/60 flex gap-4">
                      <img src={c.image} alt={c.title} className="w-24 h-28 object-cover rounded-xl border border-glamora-blush/60 flex-shrink-0" />
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="font-serif font-bold text-sm text-glamora-charcoal truncate">{c.title}</h4>
                            <span className="text-[10px] font-bold bg-glamora-rose text-white px-2 py-0.5 rounded-full flex-shrink-0">{c.badge}</span>
                          </div>
                          <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{c.tagline}</p>
                          <div className="text-[11px] text-gray-500 mt-2 line-clamp-1">
                            Items: {c.items.map(i => i.name).join(', ')}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-glamora-blush/40">
                          <div>
                            <span className="font-serif font-bold text-base text-glamora-charcoal">₹{c.comboPrice}</span>
                            <span className="text-xs text-gray-400 line-through ml-2">₹{c.originalTotal}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                setEditingCombo(c);
                                setIsNewCombo(false);
                              }}
                              className="bg-white border border-gray-200 hover:border-glamora-rose px-3 py-1 rounded-xl text-xs font-semibold text-glamora-charcoal cursor-pointer"
                            >
                              Edit & Photo
                            </button>
                            <button
                              onClick={() => handleDeleteCombo(c.id)}
                              className="p-1 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition"
                              title="Delete Combo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: ORDERS FULFILLMENT */}
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

            {/* TAB: STORE SETTINGS & FULL ACCESS */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm max-w-2xl">
                <h3 className="font-serif text-lg font-bold text-glamora-charcoal mb-4">
                  Full Store Settings & Announcements
                </h3>

                <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Top Announcement Bar Text</label>
                    <input
                      type="text"
                      value={announcement}
                      onChange={(e) => setAnnouncement(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Customer Support WhatsApp Number</label>
                    <input
                      type="text"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Free Shipping Order Threshold (₹)</label>
                    <input
                      type="number"
                      value={freeShippingAbove}
                      onChange={(e) => setFreeShippingAbove(Number(e.target.value))}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-bold"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="bg-glamora-charcoal hover:bg-glamora-rose text-white text-xs font-bold px-6 py-3 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Update Store Settings</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>

        </div>
      )}

      {/* EDIT PRODUCT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl p-6 shadow-luxury border border-glamora-blush my-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-serif text-lg font-bold text-glamora-charcoal">
                {isNewProduct ? 'Add New Product to Catalog' : `Edit Product: ${editingProduct.name}`}
              </h3>
              <button onClick={() => setEditingProduct(null)} className="p-1 text-gray-400 hover:text-glamora-charcoal">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-600 mb-1">Product Title *</label>
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
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-bold text-glamora-rose"
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
                    <option value="indian">Indian Wear / Kurtis</option>
                    <option value="western">Western / Jeans</option>
                    <option value="accessories">Jewelry & Accessories</option>
                    <option value="footwear">Footwear</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-600 mb-1">Inventory Stock Units</label>
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
                <label className="block font-semibold text-gray-600 mb-1">Product Photo / Image *</label>
                
                {/* Photo Preview + Direct File Upload Option */}
                <div className="flex items-center gap-3 mb-2 p-3 bg-gray-50 border border-gray-200 rounded-2xl">
                  {editingProduct.images?.[0] ? (
                    <img
                      src={editingProduct.images[0]}
                      alt="Product Preview"
                      className="w-16 h-20 object-cover rounded-xl border border-glamora-blush shadow-sm flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-20 rounded-xl bg-gray-200 flex items-center justify-center text-gray-400 flex-shrink-0">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}

                  <div className="flex-1 space-y-1.5">
                    <label className="inline-flex items-center gap-2 bg-glamora-rose hover:bg-glamora-rose-dark text-white text-xs font-bold px-3.5 py-2 rounded-xl cursor-pointer transition shadow-sm">
                      <Upload className="w-4 h-4" />
                      <span>Upload Photo from Phone / PC</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProductImageUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[10px] text-gray-500">
                      Tap above to pick photo from mobile gallery or computer files
                    </p>
                  </div>
                </div>

                <input
                  type="text"
                  placeholder="Or enter Image URL (https://...)"
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

              <div>
                <label className="block font-semibold text-gray-600 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-glamora-charcoal hover:bg-glamora-rose text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save to Catalog</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT / CREATE COMBO MODAL */}
      {editingCombo && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-luxury border border-glamora-blush my-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-serif text-lg font-bold text-glamora-charcoal">
                {isNewCombo ? 'Create New Curated Combo' : `Edit Combo: ${editingCombo.title}`}
              </h3>
              <button onClick={() => setEditingCombo(null)} className="p-1 text-gray-400 hover:text-glamora-charcoal">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCombo} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-gray-600 mb-1">Combo Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SANGANERI KURTI + MINAKARI JHUMKA COMBO"
                  value={editingCombo.title}
                  onChange={(e) => setEditingCombo({ ...editingCombo, title: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-bold focus:ring-1 focus:ring-glamora-rose"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-600 mb-1">Tagline *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pure Mulmul Cotton Kurti with 18K Gold Plated Jhumkis"
                  value={editingCombo.tagline}
                  onChange={(e) => setEditingCombo({ ...editingCombo, tagline: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5"
                />
              </div>

              {/* Combo Image Upload Option */}
              <div>
                <label className="block font-semibold text-gray-600 mb-1">Combo Image *</label>
                <div className="flex items-center gap-3 mb-2 p-3 bg-gray-50 border border-gray-200 rounded-2xl">
                  {editingCombo.image ? (
                    <img
                      src={editingCombo.image}
                      alt="Combo Preview"
                      className="w-16 h-20 object-cover rounded-xl border border-glamora-blush shadow-sm flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-20 rounded-xl bg-gray-200 flex items-center justify-center text-gray-400 flex-shrink-0">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}

                  <div className="flex-1 space-y-1.5">
                    <label className="inline-flex items-center gap-2 bg-glamora-rose hover:bg-glamora-rose-dark text-white text-xs font-bold px-3.5 py-2 rounded-xl cursor-pointer transition shadow-sm">
                      <Upload className="w-4 h-4" />
                      <span>Upload Combo Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleComboImageUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[10px] text-gray-500">
                      Upload model photo wearing the combo from mobile/PC
                    </p>
                  </div>
                </div>

                <input
                  type="text"
                  placeholder="Or enter Image URL (https://...)"
                  value={editingCombo.image || ''}
                  onChange={(e) => setEditingCombo({ ...editingCombo, image: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-mono text-[11px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-600 mb-1">Combo Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={editingCombo.comboPrice}
                    onChange={(e) => setEditingCombo({ 
                      ...editingCombo, 
                      comboPrice: Number(e.target.value),
                      savings: (editingCombo.originalTotal || 999) - Number(e.target.value)
                    })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-bold text-glamora-rose"
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
                  placeholder="e.g. VIRAL DEAL • FLAT ₹499"
                  value={editingCombo.badge}
                  onChange={(e) => setEditingCombo({ ...editingCombo, badge: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-600 mb-1">Combo Description</label>
                <textarea
                  rows={2}
                  placeholder="Brief details about the combo outfit styling..."
                  value={editingCombo.description}
                  onChange={(e) => setEditingCombo({ ...editingCombo, description: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingCombo(null)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-glamora-charcoal hover:bg-glamora-rose text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>{isNewCombo ? 'Create & Publish Combo' : 'Save Combo Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
