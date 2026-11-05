import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Truck, CheckCircle2, Clock, MapPin, Package, ShieldCheck, MessageCircle, AlertCircle } from 'lucide-react';
import { Order } from '../types';

interface OrderTrackPageProps {
  initialTrackingId?: string;
  onBackToHome: () => void;
  onViewAllOrders: () => void;
}

export const OrderTrackPage: React.FC<OrderTrackPageProps> = ({
  initialTrackingId = '',
  onBackToHome,
  onViewAllOrders,
}) => {
  const [query, setQuery] = useState(initialTrackingId);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchOrder = async (searchId: string) => {
    if (!searchId.trim()) return;
    setLoading(true);
    setError('');

    try {
      // 1. Try API
      const res = await fetch(`/api/orders/track/${encodeURIComponent(searchId.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data);
        setLoading(false);
        return;
      }

      // 2. Fallback to localStorage orders
      const localSaved = localStorage.getItem('glamora_user_orders');
      if (localSaved) {
        const list: Order[] = JSON.parse(localSaved);
        const q = searchId.trim().toLowerCase();
        const found = list.find(
          (o) =>
            o.trackingId.toLowerCase() === q ||
            o.orderNumber.toLowerCase() === q ||
            o.shippingAddress?.phone?.includes(q)
        );
        if (found) {
          setOrder(found);
          setLoading(false);
          return;
        }
      }

      // 3. Fallback to all orders
      const allRes = await fetch('/api/orders');
      if (allRes.ok) {
        const all: Order[] = await allRes.json();
        const q = searchId.trim().toLowerCase();
        const found = all.find(
          (o) =>
            o.trackingId.toLowerCase() === q ||
            o.orderNumber.toLowerCase() === q ||
            o.shippingAddress?.phone?.includes(q)
        );
        if (found) {
          setOrder(found);
          setLoading(false);
          return;
        }
      }

      setError(`No package found for "${searchId}". Please verify your Order Number or 10-digit mobile number.`);
      setOrder(null);
    } catch (e) {
      console.error(e);
      setError('Network connection error while fetching tracking status.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialTrackingId) {
      searchOrder(initialTrackingId);
    }
  }, [initialTrackingId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchOrder(query);
  };

  // Tracking steps definition
  const steps = [
    { key: 'placed', label: 'Order Placed & Verified', desc: 'Received at Jaipur Production Studio', time: 'Day 1' },
    { key: 'confirmed', label: 'Quality Check & Packed', desc: 'Folded with care in luxury pink box', time: 'Day 1' },
    { key: 'dispatched', label: 'Handed to BlueDart Express', desc: 'Dispatched from Jaipur Central Hub', time: 'Day 2' },
    { key: 'out_for_delivery', label: 'Out for Delivery', desc: 'Courier agent assigned in your city', time: 'Day 3' },
    { key: 'delivered', label: 'Delivered Successfully', desc: 'Delivered to your doorstep with OTP', time: 'Day 3–4' },
  ];

  const getStepProgressIndex = (status: Order['orderStatus']) => {
    switch (status) {
      case 'placed': return 0;
      case 'confirmed': return 1;
      case 'dispatched': return 2;
      case 'out_for_delivery': return 3;
      case 'delivered': return 4;
      default: return 1;
    }
  };

  const activeIndex = order ? getStepProgressIndex(order.orderStatus) : 1;

  return (
    <div className="min-h-screen bg-[#FFF9F6] text-glamora-charcoal pt-6 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      
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
              <Truck className="w-7 h-7 text-glamora-rose" />
              <span>Track Your Package</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-sans mt-0.5">
              Live GPS courier tracking direct from Jaipur Textile Workshop
            </p>
          </div>
        </div>

        <button
          onClick={onViewAllOrders}
          className="text-xs font-bold text-glamora-rose hover:text-glamora-rose-dark hover:underline flex items-center gap-1 self-start sm:self-auto"
        >
          <span>View My Order History →</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="mt-8 bg-white p-6 sm:p-8 rounded-3xl border border-glamora-blush/80 shadow-luxury">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              placeholder="Enter Order ID (e.g. GLM-2026-9812) or 10-Digit Mobile..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-4 py-3.5 text-xs sm:text-sm text-glamora-charcoal font-medium placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-glamora-rose"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-glamora-charcoal hover:bg-glamora-rose text-white text-xs uppercase tracking-wider font-bold px-8 py-3.5 rounded-2xl transition shadow-sm cursor-pointer flex items-center justify-center gap-2 flex-shrink-0"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Truck className="w-4 h-4" />
            )}
            <span>Track Order</span>
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Tracking Results Card */}
      {order && (
        <div className="mt-8 space-y-6 animate-fade-in">
          
          {/* Status Header Banner */}
          <div className="bg-gradient-to-r from-glamora-charcoal to-[#3D2C38] text-white p-6 sm:p-8 rounded-3xl shadow-luxury space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-glamora-blush tracking-widest block">
                  Live Courier Tracking
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-glamora-cream">
                  {order.orderNumber}
                </h2>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-gray-400 block font-semibold">Estimated Delivery Date</span>
                <span className="text-xs sm:text-sm font-bold text-glamora-rose">
                  {order.estimatedDelivery || 'Within 3 Business Days'}
                </span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-white/80 border-t border-white/10">
              <span>Courier Partner: <strong className="text-white">BlueDart Express Air</strong></span>
              <span className="hidden sm:inline">•</span>
              <span>AWB: <strong className="text-white font-mono">{order.trackingId}</strong></span>
              <span className="hidden sm:inline">•</span>
              <span>Status: <strong className="text-emerald-400 uppercase">{order.orderStatus.replace(/_/g, ' ')}</strong></span>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-glamora-blush/80 shadow-luxury space-y-8">
            <h3 className="font-serif text-lg font-bold text-glamora-charcoal">
              Package Transit Milestones
            </h3>

            <div className="relative pl-6 sm:pl-8 space-y-8 border-l-2 border-gray-200">
              {steps.map((st, idx) => {
                const isPassed = idx <= activeIndex;
                const isCurrent = idx === activeIndex;

                return (
                  <div key={st.key} className="relative group">
                    {/* Step Circle Indicator */}
                    <div
                      className={`absolute -left-[31px] sm:-left-[39px] top-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center border-2 transition ${
                        isPassed
                          ? 'bg-glamora-rose border-glamora-rose text-white shadow-md'
                          : 'bg-white border-gray-300 text-gray-300'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Clock className="w-3.5 h-3.5" />}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-3">
                        <h4
                          className={`font-serif text-sm sm:text-base font-bold ${
                            isPassed ? 'text-glamora-charcoal' : 'text-gray-400'
                          }`}
                        >
                          {st.label}
                        </h4>
                        {isCurrent && (
                          <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                            Current Stage
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">{st.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Recipient Details & Items */}
            <div className="pt-6 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="bg-glamora-cream/50 p-5 rounded-2xl border border-glamora-blush/60 space-y-2">
                <div className="flex items-center gap-2 font-bold text-glamora-charcoal text-sm mb-1">
                  <MapPin className="w-4 h-4 text-glamora-rose" />
                  <span>Delivering To</span>
                </div>
                <p className="font-semibold text-glamora-charcoal">{order.shippingAddress.name}</p>
                <p className="text-gray-600 leading-relaxed">
                  {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                </p>
                <p className="text-gray-500">Contact: +91 {order.shippingAddress.phone}</p>
              </div>

              <div className="bg-glamora-cream/50 p-5 rounded-2xl border border-glamora-blush/60 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 font-bold text-glamora-charcoal text-sm mb-2">
                    <Package className="w-4 h-4 text-glamora-rose" />
                    <span>Package Contents ({order.items.length} items)</span>
                  </div>
                  <div className="space-y-1 text-gray-600 max-h-24 overflow-y-auto pr-1">
                    {order.items.map((it, i) => (
                      <div key={i} className="flex justify-between truncate">
                        <span>• {it.name} (x{it.quantity})</span>
                        <span className="font-bold text-glamora-charcoal">₹{it.price * it.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-glamora-blush/40 flex justify-between items-center text-xs">
                  <span className="text-gray-500">Total Invoice Amount:</span>
                  <span className="font-serif font-bold text-base text-glamora-rose">₹{order.total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Support Action */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-glamora-blush/30 p-4 rounded-2xl border border-glamora-blush">
              <div className="flex items-center gap-2.5">
                <MessageCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span className="text-gray-700">
                  Have questions about this package? Our Jaipur team is active on WhatsApp.
                </span>
              </div>
              <a
                href={`https://wa.me/919876543210?text=Hi%20GLAMORA%20Team,%20please%20update%20me%20on%20my%20order%20${order.orderNumber}`}
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl transition flex items-center justify-center gap-1.5 flex-shrink-0"
              >
                <span>WhatsApp Support</span>
              </a>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};

