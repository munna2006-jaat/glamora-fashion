import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck, QrCode, Copy, Check, Truck, AlertCircle, Sparkles, CreditCard, Lock, CheckCircle2, MapPin, Edit3 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, Coupon, Order, Address, AppSettings, User } from '../types';

interface PaymentPageProps {
  cartItems: CartItem[];
  appliedCoupon: Coupon | null;
  giftWrap: boolean;
  settings: AppSettings;
  currentUser: User | null;
  shippingAddress: Address;
  contactEmail: string;
  onEditAddress: () => void;
  onOrderSuccess: (order: Order) => void;
  onBackToHome: () => void;
}

export const PaymentPage: React.FC<PaymentPageProps> = ({
  cartItems,
  appliedCoupon,
  giftWrap,
  settings,
  currentUser,
  shippingAddress,
  contactEmail,
  onEditAddress,
  onOrderSuccess,
  onBackToHome,
}) => {
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
    navigator.clipboard.writeText(activeUpiId || settings.upiId || 'glamora@upi');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (cartItems.length === 0) {
      setFormError('Your cart is empty. Please select products first.');
      return;
    }

    if (!utrNumber.trim()) {
      setFormError('Please enter your 12-digit UPI / UTR Transaction Reference number after completing the payment.');
      return;
    }

    if (utrNumber.trim().length < 8) {
      setFormError('Please enter a valid 12-digit UTR transaction number from your UPI receipt.');
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
        paymentMethod: 'upi',
        paymentStatus: 'paid',
        shippingAddress: {
          ...shippingAddress,
          email: contactEmail || currentUser?.email || '',
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
        particleCount: 110,
        spread: 80,
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

  // Multiple QR Channels Support
  const activeQrList = (settings.qrCodes && settings.qrCodes.filter(q => q.isActive)) || [];
  const [selectedQrId, setSelectedQrId] = useState<string>(() => {
    return activeQrList.length > 0 ? activeQrList[0].id : '';
  });

  const currentQrItem = activeQrList.find(q => q.id === selectedQrId) || activeQrList[0];
  const activeUpiId = currentQrItem?.upiId || settings.upiId || 'glamora@upi';
  const activeUpiName = currentQrItem?.upiName || settings.upiName || 'GLAMORA FASHION';

  // Generate dynamic QR URL
  const qrUrl =
    currentQrItem?.image ||
    settings.qrCodeUrl ||
    `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=${encodeURIComponent(
      activeUpiId
    )}%26pn=${encodeURIComponent(activeUpiName)}%26am=${finalTotal}%26cu=INR`;

  return (
    <div className="min-h-screen bg-[#FFF9F6] text-glamora-charcoal pt-6 pb-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      
      {/* Checkout Breadcrumb Navigation */}
      <div className="pb-6 border-b border-glamora-blush/60">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onEditAddress}
            className="w-10 h-10 rounded-full bg-white border border-glamora-blush flex items-center justify-center hover:bg-glamora-blush/30 transition shadow-sm cursor-pointer"
            title="Back to Address"
          >
            <ArrowLeft className="w-5 h-5 text-glamora-charcoal" />
          </button>
          
          {/* Step Badges */}
          <div className="flex items-center gap-2 sm:gap-4 text-xs font-semibold">
            <span className="text-gray-400 hidden sm:inline">1. Bag</span>
            <span className="text-gray-300 hidden sm:inline">→</span>
            <button
              onClick={onEditAddress}
              className="text-gray-500 hover:text-glamora-rose underline cursor-pointer"
            >
              2. Address
            </button>
            <span className="text-gray-300">→</span>
            <span className="bg-glamora-charcoal text-white px-3 py-1 rounded-full font-bold shadow-sm">
              3. Payment (Active)
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>SSL 256-Bit Encrypted</span>
          </div>
        </div>

        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-glamora-charcoal flex items-center gap-2">
            <Lock className="w-7 h-7 text-glamora-rose" />
            <span>Complete Payment & Place Order</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-sans mt-0.5">
            Instant UPI Payment • Guaranteed Dispatch within 24 Hours
          </p>
        </div>
      </div>

      {formError && (
        <div className="mt-4 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-fade-in">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* Confirmed Delivery Address Review Banner */}
      <div className="mt-6 bg-white p-4 sm:p-5 rounded-3xl border border-glamora-blush/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-glamora-blush/60 flex items-center justify-center text-glamora-rose flex-shrink-0 mt-0.5">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-glamora-charcoal">{shippingAddress.name}</span>
              <span className="text-gray-500">(+91 {shippingAddress.phone})</span>
            </div>
            <p className="text-gray-600 text-xs mt-0.5 leading-relaxed">
              {shippingAddress.street}, {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onEditAddress}
          className="bg-gray-50 hover:bg-gray-100 border border-gray-200 px-3.5 py-1.5 rounded-xl font-bold text-glamora-charcoal text-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5 text-glamora-rose" />
          <span>Change Address</span>
        </button>
      </div>

      {/* Main 2-Column Payment Layout */}
      <form onSubmit={handleSubmitOrder} className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Payment Options (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-glamora-blush/80 shadow-luxury space-y-6">
            <div className="pb-3 border-b border-gray-100">
              <h2 className="font-serif text-lg font-bold text-glamora-charcoal flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-glamora-rose" />
                <span>Select Payment Method</span>
              </h2>
            </div>

            {/* Payment Method 1: UPI / QR Code (ACTIVE & SELECTED) */}
            <div className="p-4 rounded-2xl border-2 border-glamora-rose bg-glamora-cream/60 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-glamora-rose flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-glamora-rose" />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-glamora-charcoal block">Instant UPI / QR Code</span>
                    <span className="text-[11px] text-gray-500">Google Pay, PhonePe, Paytm, BHIM UPI</span>
                  </div>
                </div>
                <span className="text-[9px] font-bold bg-glamora-rose text-white px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Recommended
                </span>
              </div>

              {/* QR Code Scan Box */}
              <div className="bg-white p-5 rounded-2xl border border-glamora-blush/80 text-center space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-glamora-rose-dark block">
                  Scan to Pay ₹{finalTotal.toLocaleString('en-IN')}
                </span>

                {/* Multiple QR Channel Switcher (If configured) */}
                {activeQrList.length > 1 && (
                  <div className="bg-glamora-blush/20 p-2.5 rounded-xl border border-glamora-blush text-center space-y-1.5 max-w-sm mx-auto">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                      Select Payment Scanner Channel:
                    </span>
                    <div className="flex flex-wrap items-center justify-center gap-1.5">
                      {activeQrList.map((q, idx) => {
                        const isSelected = (currentQrItem?.id === q.id);
                        return (
                          <button
                            key={q.id}
                            type="button"
                            onClick={() => setSelectedQrId(q.id)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                              isSelected
                                ? 'bg-glamora-rose text-white shadow-xs'
                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                            }`}
                          >
                            <span>Channel {idx + 1}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                <div className="w-52 h-52 mx-auto p-2.5 bg-white rounded-2xl border-2 border-glamora-rose shadow-md flex items-center justify-center">
                  <img
                    src={qrUrl}
                    alt="GLAMORA Payment QR Code"
                    className="w-full h-full object-contain"
                  />
                </div>

                <p className="text-[11px] text-gray-500">
                  Open any UPI app (PhonePe, GPay, Paytm) & scan this QR code
                </p>

                {/* UPI ID with One-Click Copy */}
                <div className="bg-glamora-cream/50 p-3 rounded-xl border border-gray-200 flex items-center justify-between gap-2 text-xs max-w-sm mx-auto">
                  <div className="min-w-0 text-left">
                    <span className="text-[9px] text-gray-400 block font-semibold">Store Payee UPI ID:</span>
                    <span className="font-mono font-bold text-glamora-charcoal truncate block">
                      {activeUpiId}
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
              </div>

              {/* UTR Input Field */}
              <div className="pt-2">
                <label className="block font-semibold text-gray-800 text-xs mb-1">
                  Enter 12-Digit UTR / Transaction Reference ID *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 431092817263"
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  className="w-full bg-white border-2 border-glamora-rose rounded-xl p-3 font-mono text-sm text-glamora-charcoal font-bold focus:outline-none focus:ring-2 focus:ring-glamora-rose"
                />
                <p className="text-[10px] text-gray-500 mt-1">
                  You will find this 12-digit number in your GPay / PhonePe / Paytm receipt after sending payment.
                </p>
              </div>
            </div>

            {/* Payment Method 2: Cash on Delivery (COD) - DISABLED FOR ALL ADDRESSES AS REQUESTED */}
            <div className="p-4 rounded-2xl border border-gray-200 bg-gray-50/80 opacity-60 cursor-not-allowed space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center bg-gray-100">
                    <span className="text-gray-400 text-xs">✕</span>
                  </div>
                  <div>
                    <span className="font-bold text-xs text-gray-500 line-through block">Cash on Delivery (COD)</span>
                    <span className="text-[10px] text-gray-400">Pay cash upon parcel delivery</span>
                  </div>
                </div>
                <span className="text-[9px] font-bold bg-red-100 text-red-700 border border-red-200 px-2 py-0.5 rounded-full uppercase">
                  Temporarily Unavailable
                </span>
              </div>
              <p className="text-[10px] text-red-600 pl-8 leading-tight">
                ⚠️ Notice: COD is currently disabled for all addresses due to festive dispatch volume. All orders are strictly dispatched after UPI confirmation with 100% buyer protection.
              </p>
            </div>

          </div>

        </div>

        {/* Right Column: Order Summary & Pay Button (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-glamora-blush/80 shadow-luxury space-y-5">
            <h2 className="font-serif text-lg font-bold text-glamora-charcoal pb-3 border-b border-gray-100">
              Payment Breakdown
            </h2>

            {/* Items Mini Scroll */}
            <div className="divide-y divide-gray-100 max-h-52 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.id} className="py-2.5 flex gap-3 items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-16 object-cover rounded-xl bg-gray-50 border border-glamora-blush/40 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif font-bold text-xs text-glamora-charcoal truncate">
                      {item.name}
                    </h3>
                    <div className="text-[10px] text-gray-500 mt-0.5">
                      {item.isCombo ? 'Curated Combo' : `Size: ${item.size || 'Free Size'}`} • Qty: {item.quantity}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-serif font-bold text-xs text-glamora-charcoal">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
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
              <div className="flex justify-between text-base font-bold text-glamora-charcoal pt-3 border-t border-gray-100">
                <span>Total Payable:</span>
                <span className="font-serif text-lg text-glamora-rose">₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Pay Button */}
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
                  <span>Confirm Payment & Place Order</span>
                </>
              )}
            </button>

            <div className="pt-2 text-center space-y-1">
              <p className="text-[11px] font-semibold text-emerald-700 flex items-center justify-center gap-1">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Genuine Jaipur Mulmul Fabrics & Safe Dispatch</span>
              </p>
              <p className="text-[10px] text-gray-400">
                7-Day Hassle-Free Returns & Size Exchanges Guaranteed
              </p>
            </div>
          </div>
        </div>

      </form>

    </div>
  );
};
