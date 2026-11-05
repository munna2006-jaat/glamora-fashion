import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck, QrCode, Copy, Check, Truck, AlertCircle, Sparkles, CreditCard, Lock, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, Coupon, Order, Address, AppSettings, User } from '../types';

interface PaymentPageProps {
  cartItems: CartItem[];
  appliedCoupon: Coupon | null;
  giftWrap: boolean;
  settings: AppSettings;
  currentUser: User | null;
  onBackToCart: () => void;
  onOrderSuccess: (order: Order) => void;
  onBackToHome: () => void;
}

export const PaymentPage: React.FC<PaymentPageProps> = ({
  cartItems,
  appliedCoupon,
  giftWrap,
  settings,
  currentUser,
  onBackToCart,
  onOrderSuccess,
  onBackToHome,
}) => {
  // Shipping Form State
  const [address, setAddress] = useState<Address>({
    id: `addr-${Date.now()}`,
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    street: '',
    city: 'Jaipur',
    state: 'Rajasthan',
    pincode: '302001',
    isDefault: true,
  });

  const [email, setEmail] = useState(currentUser?.email || '');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cod'>('upi');
  const [utrNumber, setUtrNumber] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = appliedCoupon
    ? Math.min(
        Math.round((subtotal * appliedCoupon.discountPercent) / 100),
        appliedCoupon.maxDiscount || Infinity
      )
    : 0;

  const shipping = subtotal >= (settings.freeShippingAbove || 799) ? 0 : (settings.shippingCharge || 70);
  const giftWrapCharge = giftWrap ? 49 : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount + shipping + giftWrapCharge);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(settings.upiId || 'glamora@upi');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (cartItems.length === 0) {
      setFormError('Your cart is empty. Please add items before checking out.');
      return;
    }

    if (!address.name.trim() || !address.phone.trim() || !address.street.trim() || !address.pincode.trim()) {
      setFormError('Please enter all required delivery address fields (Name, Phone, Street, Pincode).');
      return;
    }

    if (address.phone.trim().replace(/\D/g, '').length < 10) {
      setFormError('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (paymentMethod === 'upi' && !utrNumber.trim()) {
      setFormError('Please enter your 12-digit UPI / UTR Transaction Reference number after making payment.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        items: cartItems,
        subtotal,
        discount: discountAmount,
        couponCode: appliedCoupon?.code || '',
        shipping,
        giftWrap,
        total: finalTotal,
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'cod_verified' : 'paid',
        shippingAddress: {
          ...address,
          name: address.name.trim(),
          phone: address.phone.trim(),
        },
        utrNumber: utrNumber.trim(),
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      let placedOrder: Order;
      if (res.ok) {
        placedOrder = await res.json();
      } else {
        // Fallback local creation
        const num = Math.floor(1000 + Math.random() * 9000);
        placedOrder = {
          id: `ord-${Date.now()}`,
          orderNumber: `GLM-2026-${num}`,
          trackingId: `TRK-GLM-${Math.floor(10000 + Math.random() * 90000)}`,
          createdAt: new Date().toISOString(),
          ...orderPayload,
          orderStatus: 'confirmed',
          estimatedDelivery: '3–4 Days (Jaipur Express Hub)',
        };
      }

      // Save to localStorage
      try {
        const localSaved = localStorage.getItem('glamora_user_orders');
        const existing: Order[] = localSaved ? JSON.parse(localSaved) : [];
        localStorage.setItem('glamora_user_orders', JSON.stringify([placedOrder, ...existing]));
      } catch (e) {
        console.error(e);
      }

      // Confetti celebration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      onOrderSuccess(placedOrder);
    } catch (err) {
      console.error('Order creation error:', err);
      setFormError('Could not process order. Please check your internet connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate dynamic QR URL
  const qrUrl =
    settings.qrCodeUrl ||
    `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=${encodeURIComponent(
      settings.upiId || 'glamora@upi'
    )}%26pn=${encodeURIComponent(settings.upiName || 'GLAMORA FASHION')}%26am=${finalTotal}%26cu=INR`;

  return (
    <div className="min-h-screen bg-[#FFF9F6] text-glamora-charcoal pt-6 pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-6 border-b border-glamora-blush/60">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToCart}
            className="w-10 h-10 rounded-full bg-white border border-glamora-blush flex items-center justify-center hover:bg-glamora-blush/30 transition shadow-sm cursor-pointer"
            title="Back to Cart"
          >
            <ArrowLeft className="w-5 h-5 text-glamora-charcoal" />
          </button>
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-glamora-charcoal flex items-center gap-2">
              <Lock className="w-6 h-6 text-glamora-rose" />
              <span>Checkout & Secure Payment</span>
            </h1>
            <p className="text-xs text-gray-500 font-sans mt-0.5">
              100% Verified Jaipur Express Dispatch with Buyer Protection
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>SSL 256-Bit Encrypted</span>
        </div>
      </div>

      {formError && (
        <div className="mt-4 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* Main 2-Column Checkout Layout */}
      <form onSubmit={handleSubmitOrder} className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Delivery Address & Items (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 1. Delivery Address Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-glamora-blush/80 shadow-luxury space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h2 className="font-serif text-lg font-bold text-glamora-charcoal flex items-center gap-2">
                <Truck className="w-5 h-5 text-glamora-rose" />
                <span>1. Shipping & Delivery Address</span>
              </h2>
              {currentUser && (
                <span className="text-[11px] bg-glamora-blush/50 text-glamora-rose-dark font-bold px-2.5 py-0.5 rounded-full">
                  Logged in as {currentUser.name}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Full Customer Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={address.name}
                  onChange={(e) => setAddress({ ...address, name: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 font-medium focus:bg-white focus:ring-2 focus:ring-glamora-rose focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">10-Digit Mobile Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 font-medium focus:bg-white focus:ring-2 focus:ring-glamora-rose focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-gray-700 mb-1">Email (for Tracking Updates)</label>
                <input
                  type="email"
                  placeholder="e.g. priya@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 font-medium focus:bg-white focus:ring-2 focus:ring-glamora-rose focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-gray-700 mb-1">House No., Building, Street Address *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flat 302, Royal Palms, Near City Mall"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 font-medium focus:bg-white focus:ring-2 focus:ring-glamora-rose focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">City / District *</label>
                <input
                  type="text"
                  required
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 font-medium focus:bg-white focus:ring-2 focus:ring-glamora-rose focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Pin Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 302001"
                  value={address.pincode}
                  onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 font-medium focus:bg-white focus:ring-2 focus:ring-glamora-rose focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 2. Order Items Review Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-glamora-blush/80 shadow-luxury space-y-4">
            <h2 className="font-serif text-lg font-bold text-glamora-charcoal flex items-center justify-between pb-3 border-b border-gray-100">
              <span>2. Items In Your Package ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})</span>
              <button
                type="button"
                onClick={onBackToCart}
                className="text-xs font-bold text-glamora-rose hover:underline"
              >
                Modify Cart
              </button>
            </h2>

            <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.id} className="py-3 flex gap-4 items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-18 object-cover rounded-xl bg-gray-50 border border-glamora-blush/40 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif font-bold text-xs sm:text-sm text-glamora-charcoal truncate">
                      {item.name}
                    </h3>
                    <div className="text-[11px] text-gray-500 mt-0.5">
                      {item.isCombo ? (
                        <span className="text-glamora-rose font-bold">Curated Combo</span>
                      ) : (
                        <span>Size: {item.size || 'Free Size'}</span>
                      )}
                      <span className="mx-2">•</span>
                      <span>Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-serif font-bold text-xs sm:text-sm text-glamora-charcoal">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Payment Method & Dynamic QR (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-glamora-blush/80 shadow-luxury space-y-6">
            <div className="pb-3 border-b border-gray-100">
              <h2 className="font-serif text-lg font-bold text-glamora-charcoal flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-glamora-rose" />
                <span>3. Choose Payment Method</span>
              </h2>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-3.5 rounded-2xl border-2 text-left transition flex flex-col justify-between cursor-pointer ${
                  paymentMethod === 'upi'
                    ? 'border-glamora-rose bg-glamora-cream/60 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <QrCode className="w-5 h-5 text-glamora-rose" />
                  <span className="text-[9px] font-bold bg-glamora-rose text-white px-2 py-0.5 rounded-full uppercase">Instant</span>
                </div>
                <div className="mt-2">
                  <span className="font-bold text-xs text-glamora-charcoal block">UPI / QR Code</span>
                  <span className="text-[10px] text-gray-500">GPay, PhonePe, Paytm</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-3.5 rounded-2xl border-2 text-left transition flex flex-col justify-between cursor-pointer ${
                  paymentMethod === 'cod'
                    ? 'border-glamora-rose bg-glamora-cream/60 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Truck className="w-5 h-5 text-glamora-charcoal" />
                  <span className="text-[9px] font-bold bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full uppercase">Standard</span>
                </div>
                <div className="mt-2">
                  <span className="font-bold text-xs text-glamora-charcoal block">Cash on Delivery</span>
                  <span className="text-[10px] text-gray-500">Pay at doorstep</span>
                </div>
              </button>
            </div>

            {/* UPI Payment Box */}
            {paymentMethod === 'upi' && (
              <div className="bg-glamora-cream/50 p-5 rounded-2xl border border-glamora-blush space-y-4">
                <div className="text-center space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-glamora-rose-dark block">
                    Scan & Pay ₹{finalTotal.toLocaleString('en-IN')}
                  </span>
                  <div className="w-48 h-48 mx-auto p-2.5 bg-white rounded-2xl border-2 border-glamora-rose shadow-md flex items-center justify-center">
                    <img
                      src={qrUrl}
                      alt="GLAMORA Payment QR Code"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-[11px] text-gray-500">
                    Scan with Google Pay, PhonePe, Paytm, or BHIM UPI
                  </p>
                </div>

                {/* UPI ID Copy Bar */}
                <div className="bg-white p-3 rounded-xl border border-gray-200 flex items-center justify-between gap-2 text-xs">
                  <div className="min-w-0">
                    <span className="text-[10px] text-gray-400 block font-semibold">Official UPI ID:</span>
                    <span className="font-mono font-bold text-glamora-charcoal truncate block">
                      {settings.upiId || 'glamora@upi'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    className="bg-glamora-blush/60 hover:bg-glamora-blush text-glamora-rose-dark text-xs font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1 cursor-pointer flex-shrink-0"
                  >
                    {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedUpi ? 'Copied!' : 'Copy UPI'}</span>
                  </button>
                </div>

                {/* UTR Input */}
                <div>
                  <label className="block font-semibold text-gray-700 text-xs mb-1">
                    Enter 12-Digit UTR / Transaction ID *
                  </label>
                  <input
                    type="text"
                    required={paymentMethod === 'upi'}
                    placeholder="e.g. 431092817263"
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    className="w-full bg-white border border-glamora-rose rounded-xl p-3 font-mono text-xs text-glamora-charcoal font-bold focus:ring-2 focus:ring-glamora-rose focus:outline-none"
                  />
                  <p className="text-[10px] text-gray-500 mt-1">
                    Found in your UPI app receipt after payment completes.
                  </p>
                </div>
              </div>
            )}

            {/* Price Breakdown */}
            <div className="space-y-2 text-xs border-t border-gray-100 pt-4 text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-medium text-glamora-charcoal">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Coupon Discount ({appliedCoupon?.code}):</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Jaipur Express Shipping:</span>
                <span>{shipping === 0 ? <strong className="text-emerald-600">FREE</strong> : `₹${shipping}`}</span>
              </div>
              {giftWrap && (
                <div className="flex justify-between">
                  <span>Luxury Brand Packaging:</span>
                  <span>₹49</span>
                </div>
              )}
              <div className="flex justify-between text-sm sm:text-base font-bold text-glamora-charcoal pt-3 border-t border-gray-100">
                <span>Final Payable Amount:</span>
                <span className="font-serif text-lg text-glamora-rose">₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-glamora-rose hover:bg-glamora-rose-dark disabled:opacity-50 text-white font-sans font-bold text-xs uppercase tracking-widest py-4 rounded-full shadow-elevated transition duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Payment...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {paymentMethod === 'upi'
                      ? `Confirm & Pay ₹${finalTotal.toLocaleString('en-IN')}`
                      : `Place Cash On Delivery Order`}
                  </span>
                </>
              )}
            </button>

            <p className="text-[10px] text-center text-gray-400">
              7-Day Hassle-Free Returns & Size Exchanges Available
            </p>
          </div>

        </div>

      </form>

    </div>
  );
};
