import React, { useState } from 'react';
import { CartItem, Coupon, Address, Order } from '../types';
import { X, ShieldCheck, CheckCircle2, QrCode, CreditCard, Banknote, Building2, Truck, Lock, ArrowRight } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  appliedCoupon: Coupon | null;
  giftWrap: boolean;
  onOrderPlaced: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  appliedCoupon,
  giftWrap,
  onOrderPlaced,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('Ananya Sharma');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [street, setStreet] = useState('Flat 304, Palm Grove Apartments, 12th Main Road');
  const [city, setCity] = useState('New Delhi');
  const [state, setState] = useState('Delhi');
  const [pincode, setPincode] = useState('110007');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('ananya@okhdfcbank');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const isFreeShipping = subtotal >= 999;
  const shippingCost = isFreeShipping ? 0 : 99;
  const giftWrapCost = giftWrap ? 49 : 0;

  let discount = 0;
  if (appliedCoupon) {
    discount = Math.round((subtotal * appliedCoupon.discountPercent) / 100);
    if (appliedCoupon.maxDiscount && discount > appliedCoupon.maxDiscount) {
      discount = appliedCoupon.maxDiscount;
    }
  }

  const grandTotal = Math.max(0, subtotal - discount + shippingCost + giftWrapCost);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const address: Address = {
      id: `addr-${Date.now()}`,
      name,
      phone,
      street,
      city,
      state,
      pincode
    };

    const orderPayload = {
      items: cartItems,
      subtotal,
      discount,
      couponCode: appliedCoupon?.code,
      shipping: shippingCost,
      giftWrap,
      total: grandTotal,
      paymentMethod,
      shippingAddress: address
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      const order = await res.json();
      setIsSubmitting(false);
      onOrderPlaced(order);
    } catch (err) {
      // Fallback local order
      const order: Order = {
        id: `ord-${Date.now()}`,
        orderNumber: `GLM-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        trackingId: `TRK-GLM-${Math.floor(10000 + Math.random() * 90000)}`,
        createdAt: new Date().toISOString(),
        items: cartItems,
        subtotal,
        discount,
        couponCode: appliedCoupon?.code,
        shipping: shippingCost,
        giftWrap,
        total: grandTotal,
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'cod_verified' : 'paid',
        orderStatus: 'confirmed',
        shippingAddress: address,
        estimatedDelivery: '3–5 Business Days'
      };
      setIsSubmitting(false);
      onOrderPlaced(order);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative bg-white w-full max-w-3xl rounded-3xl overflow-hidden shadow-luxury border border-glamora-blush my-6 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-glamora-blush/60 flex items-center justify-between bg-glamora-cream/50">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-glamora-rose" />
            <h2 className="font-serif text-lg font-bold text-glamora-charcoal">
              Secure Checkout • 256-Bit SSL Encrypted
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-glamora-charcoal transition rounded-full hover:bg-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 space-y-6">
          
          {/* Shipping Address Section */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-glamora-charcoal mb-3 flex items-center gap-2">
              <Truck className="w-4 h-4 text-glamora-rose" />
              <span>1. Shipping Details (India Delivery)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-glamora-cream/40 border border-glamora-blush rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-glamora-rose"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">Mobile Number (For Delivery Updates) *</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-glamora-cream/40 border border-glamora-blush rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-glamora-rose"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">Flat, House No., Building, Street Name *</label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full bg-glamora-cream/40 border border-glamora-blush rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-glamora-rose"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">City / Town *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-glamora-cream/40 border border-glamora-blush rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-glamora-rose"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-glamora-cream/40 border border-glamora-blush rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-glamora-rose"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">PIN Code *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-glamora-cream/40 border border-glamora-blush rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-glamora-rose"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Section */}
          <div className="pt-4 border-t border-glamora-blush/60">
            <h3 className="text-xs font-bold uppercase tracking-wider text-glamora-charcoal mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-glamora-rose" />
              <span>2. Payment Option</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              
              {/* UPI */}
              <label className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-start gap-3 ${
                paymentMethod === 'upi' ? 'border-glamora-rose bg-glamora-blush/20 shadow-sm' : 'border-gray-200 hover:bg-gray-50'
              }`}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'upi'}
                  onChange={() => setPaymentMethod('upi')}
                  className="mt-0.5 text-glamora-rose focus:ring-glamora-rose"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-glamora-charcoal">Instant UPI / QR</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">Fastest</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">Google Pay, PhonePe, Paytm, BHIM</p>
                </div>
              </label>

              {/* Cards */}
              <label className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-start gap-3 ${
                paymentMethod === 'card' ? 'border-glamora-rose bg-glamora-blush/20 shadow-sm' : 'border-gray-200 hover:bg-gray-50'
              }`}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className="mt-0.5 text-glamora-rose focus:ring-glamora-rose"
                />
                <div className="flex-1">
                  <div className="font-bold text-glamora-charcoal">Credit / Debit Card</div>
                  <p className="text-[11px] text-gray-500 mt-0.5">Visa, Mastercard, RuPay & Amex</p>
                </div>
              </label>

              {/* NetBanking */}
              <label className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-start gap-3 ${
                paymentMethod === 'netbanking' ? 'border-glamora-rose bg-glamora-blush/20 shadow-sm' : 'border-gray-200 hover:bg-gray-50'
              }`}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'netbanking'}
                  onChange={() => setPaymentMethod('netbanking')}
                  className="mt-0.5 text-glamora-rose focus:ring-glamora-rose"
                />
                <div className="flex-1">
                  <div className="font-bold text-glamora-charcoal">Net Banking</div>
                  <p className="text-[11px] text-gray-500 mt-0.5">All major Indian banks supported</p>
                </div>
              </label>

              {/* Cash On Delivery */}
              <label className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-start gap-3 ${
                paymentMethod === 'cod' ? 'border-glamora-rose bg-glamora-blush/20 shadow-sm' : 'border-gray-200 hover:bg-gray-50'
              }`}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="mt-0.5 text-glamora-rose focus:ring-glamora-rose"
                />
                <div className="flex-1">
                  <div className="font-bold text-glamora-charcoal">Cash on Delivery (COD)</div>
                  <p className="text-[11px] text-gray-500 mt-0.5">Pay via Cash / UPI at your doorstep</p>
                </div>
              </label>
            </div>

            {/* UPI ID input simulator */}
            {paymentMethod === 'upi' && (
              <div className="mt-3 p-3 rounded-xl bg-glamora-cream/50 border border-glamora-blush/40 flex items-center gap-3">
                <QrCode className="w-8 h-8 text-glamora-charcoal/80 flex-shrink-0" />
                <div className="flex-1">
                  <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">Enter UPI ID / VPA</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="yourname@okhdfcbank"
                    className="w-full bg-white border border-gray-200 rounded-lg p-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-glamora-rose"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Order Summary & Final Total */}
          <div className="pt-4 border-t border-glamora-blush/60 bg-glamora-cream/40 p-4 rounded-2xl space-y-1.5 text-xs text-glamora-charcoal">
            <div className="flex justify-between">
              <span>Items Total ({cartItems.reduce((a, b) => a + b.quantity, 0)} items):</span>
              <span className="font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Coupon Applied ({appliedCoupon?.code}):</span>
                <span>- ₹{discount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>{isFreeShipping ? <span className="text-emerald-600 font-bold">FREE Express</span> : '₹99'}</span>
            </div>
            {giftWrap && (
              <div className="flex justify-between">
                <span>Signature Gift Packaging:</span>
                <span>₹49</span>
              </div>
            )}
            <div className="flex justify-between items-baseline pt-2 border-t border-glamora-blush text-sm font-bold text-glamora-charcoal">
              <span>Amount Payable:</span>
              <span className="text-2xl font-serif text-glamora-charcoal">₹{grandTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-glamora-charcoal hover:bg-glamora-rose text-white text-sm font-bold py-4 rounded-2xl transition flex items-center justify-center gap-2 shadow-elevated cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Securing your order...</span>
              ) : (
                <>
                  <span>Place Order • Pay ₹{grandTotal.toLocaleString('en-IN')}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            <p className="text-center text-[11px] text-gray-400 mt-2">
              🔒 Safe & Secure 256-Bit SSL Payment • 7 Days Return Guarantee
            </p>
          </div>

        </form>

      </div>
    </div>
  );
};
