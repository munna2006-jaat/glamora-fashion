import React, { useState, useEffect } from 'react';
import { Product, Combo, Order, AppSettings, QrCodeItem } from '../types';
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
  Image as ImageIcon,
  CheckCircle2,
  Power,
  RefreshCw,
  Key,
  ShieldCheck,
  Check,
  AlertCircle,
  Layers,
  Video,
  Target,
  ExternalLink,
  Copy,
  Download
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
  const [activeTab, setActiveTab] = useState<'kpis' | 'products' | 'combos' | 'qr' | 'orders' | 'meta-ads' | 'settings'>('kpis');
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
  const [qrPool, setQrPool] = useState<QrCodeItem[]>(Array.isArray(settings?.qrCodes) ? settings.qrCodes : []);
  const [selectedBatchFiles, setSelectedBatchFiles] = useState<{ title: string; image: string; upiId: string; upiName: string }[]>([]);
  const [isBatchUploading, setIsBatchUploading] = useState(false);

  // Meta Pixel & Domain State
  const [metaPixelId, setMetaPixelId] = useState(settings?.metaPixelId || '');
  const [siteDomain, setSiteDomain] = useState(settings?.siteDomain || 'glamora.living');
  const [copiedAdField, setCopiedAdField] = useState('');

  // Password & Security State
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [newAdminUser, setNewAdminUser] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [announcement, setAnnouncement] = useState(settings?.announcementText || '');
  const [whatsapp, setWhatsapp] = useState(settings?.whatsappNumber || '+91 98765 43210');
  const [freeShippingAbove, setFreeShippingAbove] = useState(settings?.freeShippingAbove || 799);

  // Safe QR Pool (prevents any undefined array crashes)
  const safeQrPool = Array.isArray(qrPool) ? qrPool.filter(Boolean) : [];

  useEffect(() => {
    if (settings) {
      setQrUpiId(settings.upiId || 'glamora@upi');
      setQrUpiName(settings.upiName || 'GLAMORA FASHION PVT LTD');
      setQrPreviewUrl(settings.qrCodeUrl || '');
      setQrPool(Array.isArray(settings.qrCodes) ? settings.qrCodes : []);
      setMetaPixelId(settings.metaPixelId || '');
      setSiteDomain(settings.siteDomain || 'glamora.living');
      setAnnouncement(settings.announcementText || '');
      setWhatsapp(settings.whatsappNumber || '+91 98765 43210');
      setFreeShippingAbove(settings.freeShippingAbove || 799);
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

  // Handle Admin Login (Supports API Auth + Fallback with Strong Credentials)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: loginUser.trim(),
          password: loginPass.trim()
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        localStorage.setItem('glamora_admin_auth', 'true');
        loadStatsAndOrders();
        return;
      }
    } catch (err) {
      console.warn('Backend login API fallback:', err);
    }

    const u = loginUser.trim().toLowerCase();
    const p = loginPass.trim();
    if (
      (u === 'admin@glamora.site' || u === 'glamora_superadmin' || u === 'admin') &&
      p === 'Glamora@2026#SecureAdmin!'
    ) {
      setIsAuthenticated(true);
      localStorage.setItem('glamora_admin_auth', 'true');
      setLoginError('');
      loadStatsAndOrders();
    } else {
      setLoginError('Invalid credentials! Access Denied.');
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

  // Batch QR Selection Handler (Multiple Images at once)
  const handleBatchSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    const newItems: { title: string; image: string; upiId: string; upiName: string }[] = [];
    let completed = 0;

    fileList.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const rawName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
          newItems.push({
            title: `Scanner Channel #${qrPool.length + newItems.length + 1} (${rawName.slice(0, 18)})`,
            image: reader.result,
            upiId: qrUpiId || 'glamora@upi',
            upiName: qrUpiName || 'GLAMORA FASHION PVT LTD'
          });
        }
        completed++;
        if (completed === fileList.length) {
          setSelectedBatchFiles(prev => [...prev, ...newItems]);
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleRemovePendingBatchItem = (index: number) => {
    setSelectedBatchFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUploadBatchQrs = async () => {
    if (selectedBatchFiles.length === 0) return;
    setIsBatchUploading(true);
    try {
      const res = await fetch('/api/admin/qr-codes/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: selectedBatchFiles })
      });
      const data = await res.json();
      if (res.ok && data.qrCodes) {
        setQrPool(data.qrCodes);
        setSelectedBatchFiles([]);
        setSaveMessage(`Successfully added ${selectedBatchFiles.length} QR code(s) to pool!`);
        onUpdateSettings({ ...settings, qrCodes: data.qrCodes });
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        const newPool: QrCodeItem[] = [
          ...qrPool,
          ...selectedBatchFiles.map((item, idx) => ({
            id: `qr-${Date.now()}-${idx}`,
            title: item.title,
            image: item.image,
            upiId: item.upiId,
            upiName: item.upiName,
            isActive: true,
            createdAt: new Date().toISOString()
          }))
        ];
        setQrPool(newPool);
        setSelectedBatchFiles([]);
        handleSaveSettingsWithPool(newPool);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsBatchUploading(false);
    }
  };

  const handleToggleQr = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/qr-codes/${id}/toggle`, { method: 'PATCH' });
      const data = await res.json();
      if (res.ok && data.qrCodes) {
        setQrPool(data.qrCodes);
        onUpdateSettings({ ...settings, qrCodes: data.qrCodes });
        setSaveMessage('QR Code status updated.');
        setTimeout(() => setSaveMessage(''), 2000);
      } else {
        const updated = qrPool.map(q => q.id === id ? { ...q, isActive: !q.isActive } : q);
        setQrPool(updated);
        handleSaveSettingsWithPool(updated);
      }
    } catch (err) {
      const updated = qrPool.map(q => q.id === id ? { ...q, isActive: !q.isActive } : q);
      setQrPool(updated);
      handleSaveSettingsWithPool(updated);
    }
  };

  const handleSetPrimaryQr = async (qr: QrCodeItem) => {
    try {
      const res = await fetch(`/api/admin/qr-codes/${qr.id}/set-primary`, { method: 'PATCH' });
      const data = await res.json();
      if (res.ok) {
        setQrPreviewUrl(qr.image);
        if (qr.upiId) setQrUpiId(qr.upiId);
        if (qr.upiName) setQrUpiName(qr.upiName);
        setSaveMessage(`Primary scanner set to "${qr.title}"!`);
        onUpdateSettings({ ...settings, qrCodeUrl: qr.image, upiId: qr.upiId || settings.upiId, upiName: qr.upiName || settings.upiName });
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        setQrPreviewUrl(qr.image);
        if (qr.upiId) setQrUpiId(qr.upiId);
        if (qr.upiName) setQrUpiName(qr.upiName);
        handleSaveSettingsWithPool(qrPool, qr.image, qr.upiId, qr.upiName);
      }
    } catch (err) {
      setQrPreviewUrl(qr.image);
      if (qr.upiId) setQrUpiId(qr.upiId);
      if (qr.upiName) setQrUpiName(qr.upiName);
      handleSaveSettingsWithPool(qrPool, qr.image, qr.upiId, qr.upiName);
    }
  };

  const handleDeleteQr = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this QR code from the pool?')) return;
    try {
      const res = await fetch(`/api/admin/qr-codes/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.qrCodes) {
        setQrPool(data.qrCodes);
        onUpdateSettings({ ...settings, qrCodes: data.qrCodes });
        setSaveMessage('QR Code removed from pool.');
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        const updated = qrPool.filter(q => q.id !== id);
        setQrPool(updated);
        handleSaveSettingsWithPool(updated);
      }
    } catch (err) {
      const updated = qrPool.filter(q => q.id !== id);
      setQrPool(updated);
      handleSaveSettingsWithPool(updated);
    }
  };

  const handleSaveSettingsWithPool = async (updatedPool?: QrCodeItem[], newQrUrl?: string, newUpiId?: string, newUpiName?: string) => {
    const poolToSave = Array.isArray(updatedPool) ? updatedPool : safeQrPool;
    const updatedSettings: AppSettings = {
      upiId: newUpiId || qrUpiId,
      upiName: newUpiName || qrUpiName,
      qrCodeUrl: newQrUrl || qrPreviewUrl,
      qrCodes: poolToSave,
      metaPixelId: metaPixelId.trim(),
      siteDomain: siteDomain.trim() || 'glamora.living',
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
        setSaveMessage('Store Settings, QR Codes & Meta Pixel saved successfully!');
        setTimeout(() => setSaveMessage(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Change Admin Password Handler
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPass !== confirmPass) {
      setPasswordError('New password and confirm password do not match');
      return;
    }
    if (newPass.length < 6) {
      setPasswordError('New password must be at least 6 characters long');
      return;
    }

    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: currentPass,
          newPassword: newPass,
          newUsername: newAdminUser || undefined
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPasswordSuccess('Admin credentials updated successfully!');
        setCurrentPass('');
        setNewPass('');
        setConfirmPass('');
        setNewAdminUser('');
        setTimeout(() => setPasswordSuccess(''), 4000);
      } else {
        setPasswordError(data.error || 'Failed to update admin credentials');
      }
    } catch (err) {
      setPasswordError('Network error while updating password');
    }
  };

  // Save Settings & QR Code
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSaveSettingsWithPool(qrPool);
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
                <label className="block font-semibold text-gray-700 mb-1">Admin Username / Email</label>
                <input
                  type="text"
                  required
                  value={loginUser}
                  onChange={(e) => setLoginUser(e.target.value)}
                  className="w-full bg-glamora-cream/50 border border-glamora-blush rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-glamora-rose font-medium text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Master Password</label>
                <input
                  type="password"
                  required
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  className="w-full bg-glamora-cream/50 border border-glamora-blush rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-glamora-rose text-xs"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-glamora-charcoal hover:bg-glamora-rose text-white text-sm font-bold py-3.5 rounded-xl transition shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Secure Admin Login</span>
                </button>
              </div>

              <div className="p-3 bg-emerald-50/60 rounded-xl text-[11px] text-gray-600 text-center border border-emerald-100/80">
                🔒 Protected Admin Portal: Authorized Admin Personnel Only
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
              onClick={() => setActiveTab('meta-ads')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                activeTab === 'meta-ads' ? 'bg-[#1877F2] text-white shadow-sm' : 'bg-blue-50 text-[#1877F2] hover:bg-blue-100'
              }`}
            >
              <Target className="w-4 h-4" />
              <span>Meta Pixel & Ads Hub</span>
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

            {/* TAB: UPI & MULTIPLE QR CODES MANAGER */}
            {activeTab === 'qr' && (
              <div className="space-y-6 max-w-5xl">
                
                {/* 1. Live Primary QR Code & Quick Configuration */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <QrCode className="w-5 h-5 text-glamora-rose" />
                        <h3 className="font-serif text-xl font-bold text-glamora-charcoal">
                          Primary Active QR Code & Store UPI
                        </h3>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Yeh primary QR code customer ko checkout par by default dikhega. Agar aapne multiple QRs upload kiye hain, to customer switch bhi kar sakega.
                      </p>
                    </div>

                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 self-start sm:self-auto">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Checkout Live Scanner</span>
                    </span>
                  </div>

                  <form onSubmit={handleSaveSettings} className="space-y-5 text-xs">
                    {/* Live Preview Box */}
                    <div className="p-4 rounded-2xl bg-glamora-cream/60 border border-glamora-blush flex flex-col sm:flex-row items-center gap-6">
                      <div className="bg-white p-3 rounded-2xl border border-glamora-blush/60 shadow-sm text-center flex-shrink-0">
                        <img
                          src={qrPreviewUrl || 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=glamora@upi&pn=GLAMORA%20FASHION&cu=INR'}
                          alt="Primary UPI QR Code"
                          className="w-36 h-36 object-contain rounded-xl mx-auto"
                        />
                        <span className="text-[10px] text-gray-500 font-bold block mt-1.5 tracking-wider uppercase">PRIMARY LIVE SCANNER</span>
                      </div>

                      <div className="flex-1 space-y-3 w-full">
                        <div>
                          <label className="block font-bold text-glamora-charcoal mb-1">
                            Replace Primary QR Image (Single File Upload)
                          </label>
                          <label className="flex items-center gap-2 p-2.5 bg-white border border-dashed border-glamora-rose rounded-xl cursor-pointer hover:bg-glamora-blush/20 transition">
                            <Upload className="w-4 h-4 text-glamora-rose" />
                            <span className="text-xs text-glamora-rose font-semibold">Choose Single Image (JPG/PNG)</span>
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
                            Or Direct QR Image URL
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
                        <label className="block font-semibold text-gray-700 mb-1">Store UPI ID / VPA *</label>
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
                          placeholder="e.g. GLAMORA FASHION PVT LTD"
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
                        <span>Save Primary QR Settings</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* 2. Batch Multiple QR Code Upload Section */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Layers className="w-5 h-5 text-glamora-rose" />
                    <h3 className="font-serif text-xl font-bold text-glamora-charcoal">
                      Batch Upload Multiple QR Codes (Pool / Channels)
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 mb-4">
                    Yahan se aap ek sath 2, 3 ya 5+ alag alag QR Code images (PhonePe, Google Pay, Paytm, BHIM) select karke upload kar sakte hain. Customer payment ke waqt channel change kar sakega.
                  </p>

                  <div className="p-6 rounded-2xl border-2 border-dashed border-glamora-rose/50 bg-glamora-cream/40 text-center hover:bg-glamora-blush/20 transition mb-6">
                    <input
                      type="file"
                      id="batch-qr-upload"
                      multiple
                      accept="image/*"
                      onChange={handleBatchSelect}
                      className="hidden"
                    />
                    <label htmlFor="batch-qr-upload" className="cursor-pointer block">
                      <div className="w-12 h-12 rounded-full bg-glamora-blush/60 text-glamora-rose flex items-center justify-center mx-auto mb-3">
                        <Upload className="w-6 h-6" />
                      </div>
                      <span className="font-bold text-sm text-glamora-charcoal block">
                        Click to Select Multiple QR Image Files
                      </span>
                      <span className="text-xs text-gray-500 block mt-1">
                        Select 2 or more files (PNG, JPG, WEBP) at once
                      </span>
                    </label>
                  </div>

                  {/* Previews of files selected for batch upload */}
                  {selectedBatchFiles.length > 0 && (
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-glamora-charcoal">
                          Selected for Upload: ({selectedBatchFiles.length} QR Codes)
                        </span>
                        <button
                          type="button"
                          onClick={() => setSelectedBatchFiles([])}
                          className="text-xs text-red-600 hover:underline font-semibold"
                        >
                          Clear All Selected
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {selectedBatchFiles.map((item, idx) => (
                          <div key={idx} className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200 relative text-xs flex gap-3">
                            <img
                              src={item.image}
                              alt="Batch QR Preview"
                              className="w-16 h-16 object-contain rounded-xl bg-white border border-gray-200 p-1 flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <label className="text-[10px] font-bold text-gray-500 uppercase block mb-0.5">Label / Title:</label>
                              <input
                                type="text"
                                value={item.title}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setSelectedBatchFiles(prev => prev.map((q, i) => i === idx ? { ...q, title: val } : q));
                                }}
                                className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs font-semibold"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemovePendingBatchItem(idx)}
                              className="text-gray-400 hover:text-red-600 p-1 self-start"
                              title="Remove"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={handleUploadBatchQrs}
                        disabled={isBatchUploading}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
                      >
                        {isBatchUploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        <span>Save & Add All {selectedBatchFiles.length} QRs to Store Pool</span>
                      </button>
                    </div>
                  )}

                  {/* 3. Existing QR Codes Pool Grid */}
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-sm text-glamora-charcoal flex items-center gap-2">
                        <span>Current Store QR Pool ({safeQrPool.length})</span>
                        <span className="text-xs font-normal text-gray-500">
                          ({safeQrPool.filter(q => q && q.isActive).length} Active)
                        </span>
                      </h4>
                    </div>

                    {safeQrPool.length === 0 ? (
                      <div className="p-8 text-center text-xs text-gray-500 bg-gray-50 rounded-2xl border border-gray-100">
                        No additional QR codes in the pool. Use the batch upload above to add multiple QRs.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {safeQrPool.map((qr) => {
                          if (!qr) return null;
                          const isCurrentlyPrimary = Boolean(qr.image && qrPreviewUrl === qr.image);
                          return (
                            <div
                              key={qr.id}
                              className={`p-4 rounded-2xl border text-xs flex flex-col justify-between transition ${
                                isCurrentlyPrimary
                                  ? 'bg-glamora-blush/20 border-glamora-rose shadow-sm'
                                  : qr.isActive
                                  ? 'bg-white border-gray-200 shadow-sm'
                                  : 'bg-gray-100/70 border-gray-200 opacity-60'
                              }`}
                            >
                              <div>
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                    qr.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'
                                  }`}>
                                    {qr.isActive ? 'Active' : 'Paused'}
                                  </span>

                                  {isCurrentlyPrimary && (
                                    <span className="bg-glamora-rose text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                      Primary
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-3 mb-3">
                                  <img
                                    src={qr.image}
                                    alt={qr.title}
                                    className="w-16 h-16 object-contain rounded-xl bg-white border border-gray-200 p-1 flex-shrink-0"
                                  />
                                  <div className="min-w-0 flex-1">
                                    <h5 className="font-bold text-glamora-charcoal text-xs truncate" title={qr.title}>
                                      {qr.title}
                                    </h5>
                                    <p className="font-mono text-[11px] text-gray-600 truncate mt-0.5">
                                      {qr.upiId || qrUpiId}
                                    </p>
                                    <span className="text-[10px] text-gray-400 block truncate">
                                      {qr.upiName || qrUpiName}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                                {!isCurrentlyPrimary && (
                                  <button
                                    type="button"
                                    onClick={() => handleSetPrimaryQr(qr)}
                                    className="text-[11px] font-bold text-glamora-rose hover:underline flex items-center gap-1 cursor-pointer"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Set as Primary</span>
                                  </button>
                                )}

                                <div className="flex items-center gap-2 ml-auto">
                                  <button
                                    type="button"
                                    onClick={() => handleToggleQr(qr.id)}
                                    className={`p-1.5 rounded-lg border text-xs transition cursor-pointer ${
                                      qr.isActive
                                        ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                                        : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                    }`}
                                    title={qr.isActive ? 'Pause QR' : 'Activate QR'}
                                  >
                                    <Power className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleDeleteQr(qr.id)}
                                    className="p-1.5 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition cursor-pointer"
                                    title="Delete QR"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* 4. Admin Security & Strong Credentials Card */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Key className="w-5 h-5 text-glamora-rose" />
                    <h3 className="font-serif text-xl font-bold text-glamora-charcoal">
                      Admin Security & Password Manager
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 mb-6">
                    Yahan se aap apne Glamora Admin panel ka Password aur Username change karke strong rakh sakte hain taaki unauthorized access na ho.
                  </p>

                  {passwordSuccess && (
                    <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      <span>{passwordSuccess}</span>
                    </div>
                  )}

                  {passwordError && (
                    <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      <span>{passwordError}</span>
                    </div>
                  )}

                  <form onSubmit={handleChangePassword} className="space-y-4 text-xs max-w-xl">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        Current Master Password *
                      </label>
                      <input
                        type="password"
                        required
                        value={currentPass}
                        onChange={(e) => setCurrentPass(e.target.value)}
                        placeholder="Enter current password"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-glamora-rose"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        New Admin Username / Email (Optional)
                      </label>
                      <input
                        type="text"
                        value={newAdminUser}
                        onChange={(e) => setNewAdminUser(e.target.value)}
                        placeholder="e.g. admin@glamora.site"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-glamora-rose"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">
                          New Strong Password *
                        </label>
                        <input
                          type="password"
                          required
                          value={newPass}
                          onChange={(e) => setNewPass(e.target.value)}
                          placeholder="Min 6 characters"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-glamora-rose"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">
                          Confirm New Password *
                        </label>
                        <input
                          type="password"
                          required
                          value={confirmPass}
                          onChange={(e) => setConfirmPass(e.target.value)}
                          placeholder="Re-enter new password"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-glamora-rose"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="bg-glamora-charcoal hover:bg-glamora-rose text-white text-xs font-bold px-6 py-3 rounded-xl transition flex items-center gap-2 shadow-sm cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Update Admin Password</span>
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

            {/* TAB: META PIXEL & META ADS HUB */}
            {activeTab === 'meta-ads' && (
              <div className="space-y-6 max-w-5xl">
                
                {/* 1. Meta Pixel Setup & Verification Card */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#1877F2]/10 text-[#1877F2] flex items-center justify-center font-bold flex-shrink-0">
                        <Target className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-serif text-xl font-bold text-glamora-charcoal">
                          Meta (Facebook) Pixel Configuration
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Meta Pixel aapki website par customers ke har action (Product View, Add to Cart, Checkout, Purchase) ko track karta hai.
                        </p>
                      </div>
                    </div>

                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 self-start sm:self-auto ${
                      metaPixelId.trim()
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${metaPixelId.trim() ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                      <span>{metaPixelId.trim() ? 'Pixel Active & Firing Events' : 'Pixel Not Configured'}</span>
                    </span>
                  </div>

                  <form onSubmit={handleSaveSettings} className="space-y-4 text-xs max-w-2xl">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        Meta Pixel ID (Dataset ID from Meta Events Manager) *
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={metaPixelId}
                          onChange={(e) => setMetaPixelId(e.target.value)}
                          placeholder="e.g. 192837465019283"
                          className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-3 font-mono text-xs font-bold text-glamora-charcoal focus:ring-1 focus:ring-glamora-rose"
                        />
                        <button
                          type="submit"
                          className="bg-[#1877F2] hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap"
                        >
                          <Save className="w-4 h-4" />
                          <span>Save Pixel ID</span>
                        </button>
                      </div>
                      <span className="text-[11px] text-gray-500 block mt-1.5">
                        Pixel ID save karte hi poori website par Meta tracking code auto-activate ho jayega.
                      </span>
                    </div>
                  </form>

                  {/* Auto-Tracked E-Commerce Events List */}
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <span className="text-xs font-bold text-gray-700 block mb-3">
                      Standard Events Automatically Tracked by Glamora:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-center">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">Active</span>
                        <span className="font-mono font-bold text-xs text-glamora-charcoal mt-1 block">PageView</span>
                        <span className="text-[10px] text-gray-400 block mt-0.5">Every Page Visit</span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-center">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">Active</span>
                        <span className="font-mono font-bold text-xs text-glamora-charcoal mt-1 block">ViewContent</span>
                        <span className="text-[10px] text-gray-400 block mt-0.5">Product & Combo Open</span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-center">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">Active</span>
                        <span className="font-mono font-bold text-xs text-glamora-charcoal mt-1 block">AddToCart</span>
                        <span className="text-[10px] text-gray-400 block mt-0.5">Item Added to Bag</span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-center">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">Active</span>
                        <span className="font-mono font-bold text-xs text-glamora-charcoal mt-1 block">InitiateCheckout</span>
                        <span className="text-[10px] text-gray-400 block mt-0.5">Address Filled</span>
                      </div>
                      <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200 text-center">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">Primary KPI</span>
                        <span className="font-mono font-bold text-xs text-emerald-900 mt-1 block">Purchase</span>
                        <span className="text-[10px] text-emerald-700 block mt-0.5">Order Placed (₹ Total)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Download Ready-To-Run Meta Video Ad (1080x1920 9:16 Vertical) */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <Video className="w-5 h-5 text-glamora-rose" />
                        <h3 className="font-serif text-xl font-bold text-glamora-charcoal">
                          Ready-to-Run Video Ad (Instagram Reels & Stories)
                        </h3>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        High-Converting 9:16 Vertical Full HD Video Ad (1080x1920) featuring Jaipur Kurtis, Flat ₹499 Dhamaka Sale & Combos.
                      </p>
                    </div>

                    <a
                      href="/ads/glamora_ad_video.mp4"
                      download="glamora_jaipur_kurti_ad_9x16.mp4"
                      className="bg-glamora-charcoal hover:bg-glamora-rose text-white text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow-sm cursor-pointer self-start sm:self-auto"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Video Ad (.mp4)</span>
                    </a>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    {/* Video Player Preview */}
                    <div className="md:col-span-5 bg-black rounded-2xl overflow-hidden shadow-md max-w-[280px] mx-auto border border-gray-200">
                      <video
                        src="/ads/glamora_ad_video.mp4"
                        controls
                        playsInline
                        className="w-full h-auto object-cover aspect-[9/16]"
                        poster="/ads/glamora_ad_story_1080x1920.jpg"
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>

                    {/* Video Specifications & Features */}
                    <div className="md:col-span-7 space-y-4 text-xs">
                      <div className="bg-glamora-cream/60 p-4 rounded-2xl border border-glamora-blush space-y-2">
                        <span className="text-[11px] font-bold text-glamora-charcoal block">Ad Creative Specifications:</span>
                        <ul className="space-y-1.5 text-gray-600 list-disc list-inside">
                          <li><b>Format:</b> MP4 Video (H.264 / AAC)</li>
                          <li><b>Resolution:</b> 1080 × 1920 Full HD (9:16 Vertical Ratio)</li>
                          <li><b>Placement:</b> Instagram Reels, Instagram Stories, Facebook Reels, Mobile Feed</li>
                          <li><b>Offer Highlighted:</b> Jaipuri Kurtis Flat ₹499 | Kurti + Baggy Jeans Combos ₹699</li>
                          <li><b>Target Domain:</b> <code className="bg-white px-1.5 py-0.5 rounded border border-gray-200 font-bold text-glamora-rose">glamora.living</code></li>
                        </ul>
                      </div>

                      <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80 text-blue-900 space-y-1">
                        <span className="font-bold text-xs block">💡 Pro Meta Ads Tip:</span>
                        <p className="text-[11px] leading-relaxed">
                          Instagram Reels Ads par vertical video ads chalane se Cost Per Purchase (CPA) 40% sasta padta hai kyunki users fullscreen experience me instant click karke website par aate hain.
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2">
                        <a
                          href="/ads/glamora_ad_feed_1080x1080.jpg"
                          download="glamora_feed_ad_1080x1080.jpg"
                          className="bg-white hover:bg-gray-100 text-gray-800 border border-gray-200 font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 text-xs shadow-xs"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download 1:1 Feed Image Ad</span>
                        </a>
                        <a
                          href="/ads/glamora_ad_story_1080x1920.jpg"
                          download="glamora_story_ad_1080x1920.jpg"
                          className="bg-white hover:bg-gray-100 text-gray-800 border border-gray-200 font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 text-xs shadow-xs"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download 9:16 Story Image Ad</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Ready-To-Paste Ad Copy (Primary Text, Headline, Description) */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Copy className="w-5 h-5 text-glamora-rose" />
                    <h3 className="font-serif text-xl font-bold text-glamora-charcoal">
                      High-Converting Meta Ad Copy (Ready to Paste)
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 mb-6">
                    Meta Ads Manager me jab aap Ad create karenge to niche diye gaye fields ko direct copy karke paste karein:
                  </p>

                  <div className="space-y-4 text-xs">
                    {/* Primary Text */}
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-gray-700">1. Primary Text (Caption):</span>
                        <button
                          type="button"
                          onClick={() => {
                            const txt = `🔥 JAIPUR KURTI DHAMAKA SALE IS LIVE! 🔥\n\nPure Cotton Mulmul & Sanganeri Handblock Kurtis starting at just ₹499! 🌸\n✨ Exclusive Kurti + Baggy Jeans Combos at ₹699\n✨ 100% Breathable Jaipuri Fabrics\n✨ Free Delivery on Orders Above ₹799\n✨ Fast 2-3 Days Dispatch with Live Tracking\n\n👉 Limited Stock Only! Tap "Shop Now" & Claim Your Combo!`;
                            navigator.clipboard.writeText(txt);
                            setCopiedAdField('primary');
                            setTimeout(() => setCopiedAdField(''), 2000);
                          }}
                          className="bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 font-bold px-2.5 py-1 rounded-lg transition flex items-center gap-1"
                        >
                          {copiedAdField === 'primary' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedAdField === 'primary' ? 'Copied!' : 'Copy Text'}</span>
                        </button>
                      </div>
                      <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed bg-white p-3 rounded-xl border border-gray-100 text-[11px]">
{`🔥 JAIPUR KURTI DHAMAKA SALE IS LIVE! 🔥

Pure Cotton Mulmul & Sanganeri Handblock Kurtis starting at just ₹499! 🌸
✨ Exclusive Kurti + Baggy Jeans Combos at ₹699
✨ 100% Breathable Jaipuri Fabrics
✨ Free Delivery on Orders Above ₹799
✨ Fast 2-3 Days Dispatch with Live Tracking

👉 Limited Stock Only! Tap "Shop Now" & Claim Your Combo!`}
                      </pre>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Headline */}
                      <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-gray-700">2. Headline:</span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText('Jaipuri Kurtis & Combos - Flat ₹499 Dhamaka Sale');
                              setCopiedAdField('headline');
                              setTimeout(() => setCopiedAdField(''), 2000);
                            }}
                            className="bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 font-bold px-2.5 py-1 rounded-lg transition flex items-center gap-1"
                          >
                            {copiedAdField === 'headline' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedAdField === 'headline' ? 'Copied!' : 'Copy'}</span>
                          </button>
                        </div>
                        <div className="bg-white p-2.5 rounded-xl border border-gray-100 font-bold text-glamora-charcoal">
                          Jaipuri Kurtis & Combos - Flat ₹499 Dhamaka Sale
                        </div>
                      </div>

                      {/* Description */}
                      <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-gray-700">3. Description:</span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText('Free Shipping Above ₹799 • 24hr Dispatch Guarantee');
                              setCopiedAdField('desc');
                              setTimeout(() => setCopiedAdField(''), 2000);
                            }}
                            className="bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 font-bold px-2.5 py-1 rounded-lg transition flex items-center gap-1"
                          >
                            {copiedAdField === 'desc' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedAdField === 'desc' ? 'Copied!' : 'Copy'}</span>
                          </button>
                        </div>
                        <div className="bg-white p-2.5 rounded-xl border border-gray-100 font-medium text-gray-600">
                          Free Shipping Above ₹799 • 24hr Dispatch Guarantee
                        </div>
                      </div>
                    </div>

                    {/* Website URL & CTA */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-gray-700">4. Website URL (Destination):</span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText('https://glamora.living');
                              setCopiedAdField('url');
                              setTimeout(() => setCopiedAdField(''), 2000);
                            }}
                            className="bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 font-bold px-2.5 py-1 rounded-lg transition flex items-center gap-1"
                          >
                            {copiedAdField === 'url' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedAdField === 'url' ? 'Copied!' : 'Copy'}</span>
                          </button>
                        </div>
                        <div className="bg-white p-2.5 rounded-xl border border-gray-100 font-mono font-bold text-glamora-rose truncate">
                          https://glamora.living
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                        <span className="font-bold text-gray-700 block mb-2">5. Call to Action (Button):</span>
                        <div className="bg-white p-2.5 rounded-xl border border-gray-100 font-bold text-glamora-charcoal">
                          Shop Now (ऑर्डर करें)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Complete Meta Ads Setup & Campaign Step-by-Step Guide */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <ExternalLink className="w-5 h-5 text-glamora-rose" />
                    <h3 className="font-serif text-xl font-bold text-glamora-charcoal">
                      Step-by-Step Guide: Meta Par Ads Kaise Chalayein
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 mb-6">
                    Agar aap pehli baar Meta (Facebook / Instagram) ads chala rahe hain, to niche diye 5 simple steps follow karein:
                  </p>

                  <div className="space-y-4 text-xs">
                    <div className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-200">
                      <div className="w-7 h-7 rounded-full bg-glamora-charcoal text-white flex items-center justify-center font-bold flex-shrink-0 text-xs">
                        1
                      </div>
                      <div>
                        <h4 className="font-bold text-glamora-charcoal text-sm">Meta Ads Manager Open Karein</h4>
                        <p className="text-gray-600 text-xs mt-1 leading-relaxed">
                          Apne computer browser me <a href="https://adsmanager.facebook.com" target="_blank" rel="noreferrer" className="text-glamora-rose font-bold underline">adsmanager.facebook.com</a> kholein aur apne Facebook Page / Instagram business account se login karein.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-200">
                      <div className="w-7 h-7 rounded-full bg-glamora-charcoal text-white flex items-center justify-center font-bold flex-shrink-0 text-xs">
                        2
                      </div>
                      <div>
                        <h4 className="font-bold text-glamora-charcoal text-sm">Campaign Objective: "Sales" Select Karein</h4>
                        <p className="text-gray-600 text-xs mt-1 leading-relaxed">
                          Green <b>+ Create</b> button par click karein aur campaign objective me <b>Sales</b> (Conversions) chunein. Isse Meta unhi logo ko ad dikhayega jo khareedne ke chances sabse jyada rakhte hain.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-200">
                      <div className="w-7 h-7 rounded-full bg-glamora-charcoal text-white flex items-center justify-center font-bold flex-shrink-0 text-xs">
                        3
                      </div>
                      <div>
                        <h4 className="font-bold text-glamora-charcoal text-sm">Pixel & Conversion Event Select Karein</h4>
                        <p className="text-gray-600 text-xs mt-1 leading-relaxed">
                          Conversion Location me <b>Website</b> chunein, apna <b>Meta Pixel</b> select karein aur Conversion Event me <b>Purchase</b> select karein.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-200">
                      <div className="w-7 h-7 rounded-full bg-glamora-charcoal text-white flex items-center justify-center font-bold flex-shrink-0 text-xs">
                        4
                      </div>
                      <div>
                        <h4 className="font-bold text-glamora-charcoal text-sm">Budget & Audience Targeting Set Karein</h4>
                        <div className="text-gray-600 text-xs mt-1 space-y-1">
                          <div>• <b>Daily Budget:</b> ₹300 se ₹500 se shuru karein.</div>
                          <div>• <b>Location:</b> India</div>
                          <div>• <b>Age:</b> 18 – 45 Years</div>
                          <div>• <b>Gender:</b> Women (Mahilayein)</div>
                          <div>• <b>Interests:</b> Kurtis, Ethnic wear, Jaipur textiles, Online shopping, Fashion accessories</div>
                          <div>• <b>Placements:</b> Advantage+ Placements (Reels & Feed recommended)</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-200">
                      <div className="w-7 h-7 rounded-full bg-glamora-charcoal text-white flex items-center justify-center font-bold flex-shrink-0 text-xs">
                        5
                      </div>
                      <div>
                        <h4 className="font-bold text-glamora-charcoal text-sm">Creative Upload Karein & Publish Karein!</h4>
                        <p className="text-gray-600 text-xs mt-1 leading-relaxed">
                          Upar di gayi <b>Video Ad (.mp4)</b> upload karein, <b>Primary Text</b> aur <b>Headline</b> paste karein, Destination URL me <code className="bg-gray-100 px-1 py-0.5 rounded font-bold">https://glamora.living</code> dalein, aur niche <b>Publish</b> button daba dein! 1-2 ghante me aapka ad live ho jayega aur orders aane shuru ho jayenge.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB: STORE SETTINGS & FULL ACCESS */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm max-w-2xl">
                <h3 className="font-serif text-lg font-bold text-glamora-charcoal mb-4">
                  Full Store Settings, Domain & Meta Pixel
                </h3>

                <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Official Store Domain</label>
                    <input
                      type="text"
                      value={siteDomain}
                      onChange={(e) => setSiteDomain(e.target.value)}
                      placeholder="e.g. glamora.living"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-bold font-mono text-glamora-rose"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Meta Pixel ID</label>
                    <input
                      type="text"
                      value={metaPixelId}
                      onChange={(e) => setMetaPixelId(e.target.value)}
                      placeholder="e.g. 192837465019283"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-mono text-xs"
                    />
                  </div>

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
                      className="bg-glamora-charcoal hover:bg-glamora-rose text-white text-xs font-bold px-6 py-3 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-sm"
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
