import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Order } from '../types';
import { CheckCircle2, Sparkles, MapPin, Package, ArrowRight, X } from 'lucide-react';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
  onTrackOrder: (trackingId: string) => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  onClose,
  onTrackOrder,
}) => {
  if (!order) return null;

  useEffect(() => {
    // Trigger festive pink & gold confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D98BA5', '#F7DDE5', '#D4AF37', '#FFF9F6']
      });
    } catch (e) {
      // safe fallback
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-luxury border border-glamora-blush p-6 sm:p-8 text-center">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-glamora-charcoal rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Celebration Icon */}
        <div className="w-20 h-20 rounded-full bg-glamora-cream border-2 border-glamora-rose mx-auto flex items-center justify-center mb-4">
          <CheckCircle2 className="w-10 h-10 text-glamora-rose" />
        </div>

        <div className="inline-flex items-center gap-1.5 bg-glamora-blush/60 text-glamora-rose-dark px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-glamora-gold" />
          <span>Order Confirmed</span>
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-glamora-charcoal">
          Thank you, {order.shippingAddress.name}!
        </h2>

        <p className="text-xs sm:text-sm text-glamora-charcoal/70 mt-2 font-sans max-w-md mx-auto">
          Your order has been placed. Our team is handcrafting your blush package with our signature satin bow.
        </p>

        {/* Order Details Card */}
        <div className="mt-6 p-4 rounded-2xl bg-glamora-cream/60 border border-glamora-blush/60 text-left text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-500">Order ID:</span>
            <span className="font-mono font-bold text-glamora-charcoal">{order.orderNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Tracking Code:</span>
            <span className="font-mono font-bold text-glamora-rose">{order.trackingId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Delivering To:</span>
            <span className="font-medium text-glamora-charcoal text-right">{order.shippingAddress.city}, {order.shippingAddress.state}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Total Paid:</span>
            <span className="font-serif font-bold text-sm text-glamora-charcoal">₹{order.total.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 space-y-2">
          <button
            onClick={() => {
              onClose();
              onTrackOrder(order.trackingId);
            }}
            className="w-full bg-glamora-charcoal hover:bg-glamora-rose text-white text-xs sm:text-sm font-bold py-3.5 rounded-2xl transition flex items-center justify-center gap-2 shadow-elevated cursor-pointer"
          >
            <MapPin className="w-4 h-4 text-glamora-blush" />
            <span>Track Order Status</span>
          </button>

          <button
            onClick={onClose}
            className="w-full bg-glamora-cream hover:bg-glamora-blush text-glamora-charcoal text-xs font-semibold py-3 rounded-2xl border border-glamora-blush transition cursor-pointer"
          >
            Continue Shopping
          </button>
        </div>

      </div>
    </div>
  );
};

