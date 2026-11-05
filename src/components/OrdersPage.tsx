import React, { useState, useEffect } from 'react';
import { Package, ArrowLeft, Search, Truck, CheckCircle2, Clock, MapPin, ExternalLink, AlertCircle, ShoppingBag } from 'lucide-react';
import { Order } from '../types';

interface OrdersPageProps {
  onBackToHome: () => void;
  onTrackOrder: (trackingId: string) => void;
  onShopNow: () => void;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({
  onBackToHome,
  onTrackOrder,
  onShopNow,
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders');
        if (res.ok) {
          const data = await res.json();
          // Also merge any locally saved orders
          const localSaved = localStorage.getItem('glamora_user_orders');
          const localOrders: Order[] = localSaved ? JSON.parse(localSaved) : [];
          
          const combined = [...localOrders, ...data];
          // deduplicate by orderNumber or id
          const unique = combined.filter((v, i, a) => a.findIndex(t => t.id === v.id || t.orderNumber === v.orderNumber) === i);
          setOrders(unique);
        }
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((o) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      o.orderNumber.toLowerCase().includes(q) ||
      o.trackingId.toLowerCase().includes(q) ||
      o.shippingAddress?.phone?.includes(q) ||
      o.shippingAddress?.name?.toLowerCase().includes(q)
    );
  });

  const getStatusBadge = (status: Order['orderStatus']) => {
    switch (status) {
      case 'delivered':
        return <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Delivered</span>;
      case 'out_for_delivery':
        return <span className="bg-blue-100 text-blue-800 border border-blue-300 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5"><Truck className="w-3.5 h-3.5" /> Out for Delivery</span>;
      case 'dispatched':
        return <span className="bg-indigo-100 text-indigo-800 border border-indigo-300 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5"><Truck className="w-3.5 h-3.5" /> Shipped via Express</span>;
      case 'confirmed':
        return <span className="bg-amber-100 text-amber-800 border border-amber-300 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Confirmed & Packing</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 border border-gray-300 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Order Placed</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F6] text-glamora-charcoal pt-6 pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-glamora-blush/60">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToHome}
            className="w-10 h-10 rounded-full bg-white border border-glamora-blush flex items-center justify-center hover:bg-glamora-blush/30 transition shadow-sm cursor-pointer"
            title="Back to Home"
          >
            <ArrowLeft className="w-5 h-5 text-glamora-charcoal" />
          </button>
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-glamora-charcoal flex items-center gap-2">
              <Package className="w-7 h-7 text-glamora-rose" />
              <span>My Orders & Purchases</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-sans mt-0.5">
              Track status, review items, and manage delivery of your GLAMORA outfits
            </p>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search order no. or mobile..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-glamora-blush rounded-2xl pl-10 pr-4 py-2.5 text-xs text-glamora-charcoal placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-glamora-rose shadow-sm"
          />
        </div>
      </div>

      {/* Orders List */}
      <div className="mt-8 space-y-6">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-glamora-rose border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-gray-500 font-medium">Fetching your orders from Jaipur Hub...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 sm:p-16 text-center border border-glamora-blush shadow-luxury max-w-lg mx-auto space-y-4">
            <div className="w-20 h-20 rounded-full bg-glamora-blush/40 flex items-center justify-center mx-auto text-glamora-rose">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h2 className="font-serif text-xl font-bold text-glamora-charcoal">No Orders Found</h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              {searchQuery
                ? `No orders match "${searchQuery}". Please check the order number or phone number.`
                : "You haven't placed any orders yet. Discover our trending Jaipuri kurtis and viral combos!"}
            </p>
            <button
              onClick={onShopNow}
              className="bg-glamora-rose hover:bg-glamora-rose-dark text-white text-xs uppercase tracking-widest font-bold px-8 py-3.5 rounded-full transition shadow-md cursor-pointer inline-flex items-center gap-2"
            >
              <span>Explore Jaipur Kurtis & Combos</span>
            </button>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl border border-glamora-blush/80 shadow-luxury overflow-hidden transition hover:shadow-elevated"
            >
              {/* Order Card Header */}
              <div className="bg-glamora-cream/60 px-5 sm:px-8 py-4 border-b border-glamora-blush/40 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-4 text-xs">
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">Order No.</span>
                    <span className="font-mono font-bold text-sm text-glamora-charcoal">{order.orderNumber}</span>
                  </div>
                  <div className="border-l border-gray-200 pl-4">
                    <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">Order Date</span>
                    <span className="font-medium text-gray-700">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="border-l border-gray-200 pl-4 hidden sm:block">
                    <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">Tracking AWB</span>
                    <span className="font-mono text-gray-600 font-semibold">{order.trackingId}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {getStatusBadge(order.orderStatus)}
                </div>
              </div>

              {/* Order Items Body */}
              <div className="p-5 sm:p-8 space-y-6">
                <div className="space-y-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-start pb-4 border-b border-gray-100 last:border-none last:pb-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-18 h-22 sm:w-20 sm:h-24 object-cover rounded-2xl border border-glamora-blush/60 bg-glamora-cream flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <h3 className="font-serif font-bold text-sm sm:text-base text-glamora-charcoal line-clamp-1">
                            {item.name}
                          </h3>
                          <span className="font-serif font-bold text-sm sm:text-base text-glamora-rose">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>

                        {item.isCombo ? (
                          <div className="mt-1">
                            <span className="inline-block bg-glamora-rose/10 text-glamora-rose-dark text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                              Special Combo Deal
                            </span>
                            {item.selectedComboSizes && (
                              <div className="text-[11px] text-gray-500 mt-1 space-y-0.5">
                                {Object.entries(item.selectedComboSizes).map(([k, v]) => (
                                  <span key={k} className="inline-block mr-3 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                                    {k}: <strong className="text-glamora-charcoal">{v}</strong>
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-xs text-gray-500 mt-1">
                            Size: <span className="font-semibold text-glamora-charcoal">{item.size || 'Free Size'}</span> • Qty: <span className="font-semibold text-glamora-charcoal">{item.quantity}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shipping & Payment Summary Footer */}
                <div className="pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-glamora-cream/40 p-4 rounded-2xl border border-glamora-blush/40 flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-glamora-rose flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-glamora-charcoal block mb-0.5">
                        Delivery Address ({order.shippingAddress.name})
                      </span>
                      <p className="text-gray-600 leading-relaxed">
                        {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                      </p>
                      <p className="text-gray-500 mt-1">Phone: +91 {order.shippingAddress.phone}</p>
                    </div>
                  </div>

                  <div className="bg-glamora-cream/40 p-4 rounded-2xl border border-glamora-blush/40 flex flex-col justify-between">
                    <div className="space-y-1">
                      <div className="flex justify-between text-gray-500">
                        <span>Payment Method:</span>
                        <span className="font-bold uppercase text-glamora-charcoal">{order.paymentMethod} • {order.paymentStatus}</span>
                      </div>
                      <div className="flex justify-between text-gray-500">
                        <span>Total Paid:</span>
                        <span className="font-serif font-bold text-base text-glamora-charcoal">₹{order.total.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    <div className="pt-3 flex gap-2">
                      <button
                        onClick={() => onTrackOrder(order.trackingId)}
                        className="flex-1 bg-glamora-charcoal hover:bg-glamora-rose text-white text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Track Live Package</span>
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
