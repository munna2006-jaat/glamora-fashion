import React, { useState } from 'react';
import { Order } from '../types';
import { X, Search, CheckCircle2, Clock, Truck, Package, ShieldCheck, MapPin } from 'lucide-react';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTrackingId?: string;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  initialTrackingId = '',
}) => {
  const [trackingQuery, setTrackingQuery] = useState(initialTrackingId || 'TRK-GLM-88902');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingQuery.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/orders/track/${encodeURIComponent(trackingQuery.trim())}`);
      if (!res.ok) {
        throw new Error('Order not found with this Tracking Code or Order ID.');
      }
      const data = await res.json();
      setOrder(data);
    } catch (err: any) {
      setError(err.message || 'Unable to track order. Please verify your code.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { key: 'placed', label: 'Order Verified', desc: 'Received at fulfillment center' },
    { key: 'confirmed', label: 'Packed & Inspected', desc: 'Artisan quality check & blush gift box' },
    { key: 'dispatched', label: 'Dispatched', desc: 'Handed to BlueDart Express' },
    { key: 'out_for_delivery', label: 'Out for Delivery', desc: 'Arriving at your doorstep' },
    { key: 'delivered', label: 'Delivered', desc: 'Delivered with care' },
  ];

  const getStepStatus = (stepKey: string, currentStatus: string) => {
    const orderHierarchy = ['placed', 'confirmed', 'dispatched', 'out_for_delivery', 'delivered'];
    const currentIdx = orderHierarchy.indexOf(currentStatus);
    const stepIdx = orderHierarchy.indexOf(stepKey);

    if (stepIdx < currentIdx) return 'completed';
    if (stepIdx === currentIdx) return 'current';
    return 'upcoming';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-luxury border border-glamora-blush my-6 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-glamora-blush/60 flex items-center justify-between bg-glamora-cream/50">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-glamora-rose" />
            <h2 className="font-serif text-lg font-bold text-glamora-charcoal">
              Live Order Tracker
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-glamora-charcoal transition rounded-full hover:bg-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          
          {/* Tracking Form */}
          <form onSubmit={handleTrack} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-glamora-rose absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Enter Tracking ID (e.g. TRK-GLM-88902) or Order No."
                value={trackingQuery}
                onChange={(e) => setTrackingQuery(e.target.value)}
                className="w-full bg-glamora-cream/40 border border-glamora-blush rounded-xl py-2.5 pl-10 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-glamora-rose font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-glamora-charcoal hover:bg-glamora-rose text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition cursor-pointer"
            >
              {loading ? 'Tracking...' : 'Track'}
            </button>
          </form>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-600 text-xs border border-red-200">
              {error}
            </div>
          )}

          {/* Result Card */}
          {order && (
            <div className="space-y-6 animate-fade-in">
              {/* Order Info Strip */}
              <div className="p-4 rounded-2xl bg-glamora-cream/70 border border-glamora-blush/60 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Order ID</span>
                  <span className="font-mono font-bold text-glamora-charcoal">{order.orderNumber}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Carrier</span>
                  <span className="font-semibold text-glamora-charcoal">BlueDart Express</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Est. Delivery</span>
                  <span className="font-bold text-glamora-rose">{order.estimatedDelivery}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Destination</span>
                  <span className="font-semibold text-glamora-charcoal truncate block">{order.shippingAddress.city}</span>
                </div>
              </div>

              {/* Timeline Stepper */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-glamora-charcoal mb-4">
                  Shipment Progress
                </h4>

                <div className="space-y-4">
                  {steps.map((st, idx) => {
                    const status = getStepStatus(st.key, order.orderStatus);
                    return (
                      <div key={st.key} className="flex items-start gap-3 relative">
                        {/* Connecting Line */}
                        {idx !== steps.length - 1 && (
                          <div className={`absolute left-3.5 top-7 w-0.5 h-8 -ml-[1px] ${
                            status === 'completed' ? 'bg-emerald-500' : 'bg-gray-200'
                          }`} />
                        )}

                        {/* Dot / Icon */}
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                          status === 'completed'
                            ? 'bg-emerald-500 text-white'
                            : status === 'current'
                            ? 'bg-glamora-rose text-white ring-4 ring-glamora-blush'
                            : 'bg-gray-100 text-gray-400 border border-gray-200'
                        }`}>
                          {status === 'completed' ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <span className="text-[10px] font-bold">{idx + 1}</span>
                          )}
                        </div>

                        {/* Text */}
                        <div className="flex-1 text-xs">
                          <div className={`font-bold ${
                            status === 'current' ? 'text-glamora-rose font-bold' : 'text-glamora-charcoal'
                          }`}>
                            {st.label}
                          </div>
                          <div className="text-[11px] text-gray-500">{st.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Items in this order */}
              <div className="pt-4 border-t border-glamora-blush/60">
                <h4 className="text-xs font-bold uppercase tracking-wider text-glamora-charcoal mb-2">
                  Items in this parcel ({order.items.length})
                </h4>
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2 rounded-xl bg-gray-50 border border-gray-100 text-xs">
                      <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg" />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-glamora-charcoal truncate">{item.name}</div>
                        <div className="text-[10px] text-gray-400">Qty: {item.quantity} • ₹{item.price}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

