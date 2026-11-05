import React, { useState } from 'react';
import { ArrowLeft, MapPin, Truck, ShieldCheck, Check, Sparkles, Building2, Home as HomeIcon, AlertCircle, ShoppingBag } from 'lucide-react';
import { CartItem, Coupon, Address, AppSettings, User } from '../types';

interface AddressPageProps {
  currentUser: User | null;
  cartItems: CartItem[];
  appliedCoupon: Coupon | null;
  giftWrap: boolean;
  settings: AppSettings;
  savedAddress: Address;
  savedEmail: string;
  onSaveAddressAndProceed: (address: Address, email: string) => void;
  onBackToCart: () => void;
}

export const AddressPage: React.FC<AddressPageProps> = ({
  currentUser,
  cartItems,
  appliedCoupon,
  giftWrap,
  settings,
  savedAddress,
  savedEmail,
  onSaveAddressAndProceed,
  onBackToCart,
}) => {
  const [name, setName] = useState(savedAddress.name || currentUser?.name || '');
  const [phone, setPhone] = useState(savedAddress.phone || currentUser?.phone || '');
  const [email, setEmail] = useState(savedEmail || currentUser?.email || '');
  const [street, setStreet] = useState(savedAddress.street || '');
  const [city, setCity] = useState(savedAddress.city || 'Jaipur');
  const [state, setState] = useState(savedAddress.state || 'Rajasthan');
  const [pincode, setPincode] = useState(savedAddress.pincode || '302001');
  const [addressType, setAddressType] = useState<'home' | 'office'>('home');
  const [alternatePhone, setAlternatePhone] = useState('');
  const [landmark, setLandmark] = useState('');
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (cartItems.length === 0) {
      setFormError('Your shopping bag is empty. Please select products first.');
      return;
    }

    if (!name.trim()) {
      setFormError('Please enter full customer name.');
      return;
    }

    const cleanPhone = phone.trim().replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setFormError('Please enter a valid 10-digit mobile number for courier SMS updates.');
      return;
    }

    if (!street.trim()) {
      setFormError('Please enter complete house/flat no., building and street address.');
      return;
    }

    const cleanPin = pincode.trim().replace(/\D/g, '');
    if (cleanPin.length !== 6) {
      setFormError('Please enter a valid 6-digit Indian PIN code.');
      return;
    }

    const fullStreetAddress = landmark.trim() 
      ? `${street.trim()} (Near ${landmark.trim()}) [${addressType.toUpperCase()}]`
      : `${street.trim()} [${addressType.toUpperCase()}]`;

    const finalAddress: Address = {
      id: savedAddress.id || `addr-${Date.now()}`,
      name: name.trim(),
      phone: cleanPhone,
      street: fullStreetAddress,
      city: city.trim(),
      state: state.trim(),
      pincode: cleanPin,
      isDefault: true,
    };

    onSaveAddressAndProceed(finalAddress, email.trim());
  };

  return (
    <div className="min-h-screen bg-[#FFF9F6] text-glamora-charcoal pt-6 pb-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      
      {/* Checkout Breadcrumb Navigation */}
      <div className="pb-6 border-b border-glamora-blush/60">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBackToCart}
            className="w-10 h-10 rounded-full bg-white border border-glamora-blush flex items-center justify-center hover:bg-glamora-blush/30 transition shadow-sm cursor-pointer"
            title="Back to Bag"
          >
            <ArrowLeft className="w-5 h-5 text-glamora-charcoal" />
          </button>
          
          {/* Step Badges */}
          <div className="flex items-center gap-2 sm:gap-4 text-xs font-semibold">
            <span className="text-gray-400 hidden sm:inline">1. Bag</span>
            <span className="text-gray-300 hidden sm:inline">→</span>
            <span className="bg-glamora-charcoal text-white px-3 py-1 rounded-full font-bold shadow-sm">
              2. Delivery Address
            </span>
            <span className="text-gray-300">→</span>
            <span className="text-gray-400">3. Payment</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Buyer Protected</span>
          </div>
        </div>

        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-glamora-charcoal flex items-center gap-2">
            <MapPin className="w-7 h-7 text-glamora-rose" />
            <span>Where Should We Deliver Your Package?</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-sans mt-0.5">
            Dispatched directly from Jaipur Artisan Studio • Fast Express Courier
          </p>
        </div>
      </div>

      {formError && (
        <div className="mt-4 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-fade-in">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* 2-Column Layout */}
      <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Address Input Form (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-glamora-blush/80 shadow-luxury space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h2 className="font-serif text-lg font-bold text-glamora-charcoal flex items-center gap-2">
                <HomeIcon className="w-5 h-5 text-glamora-rose" />
                <span>Contact & Shipping Details</span>
              </h2>
              {currentUser && (
                <span className="text-[11px] bg-glamora-blush/50 text-glamora-rose-dark font-bold px-2.5 py-0.5 rounded-full">
                  Logged in as {currentUser.name}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Customer Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 font-medium focus:bg-white focus:ring-2 focus:ring-glamora-rose focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">10-Digit Mobile Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 font-medium focus:bg-white focus:ring-2 focus:ring-glamora-rose focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Alternate Contact (Optional)</label>
                <input
                  type="tel"
                  placeholder="Family or friend number"
                  value={alternatePhone}
                  onChange={(e) => setAlternatePhone(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 font-medium focus:bg-white focus:ring-2 focus:ring-glamora-rose focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Email (For Tracking & Invoice)</label>
                <input
                  type="email"
                  placeholder="e.g. priya@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 font-medium focus:bg-white focus:ring-2 focus:ring-glamora-rose focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-gray-700 mb-1">
                  Flat No., Building Name, Street / Colony *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flat 402, Shivam Enclave, Main Tonk Road"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 font-medium focus:bg-white focus:ring-2 focus:ring-glamora-rose focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Nearby Landmark (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Behind Metro Pillar 84"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 font-medium focus:bg-white focus:ring-2 focus:ring-glamora-rose focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">6-Digit PIN Code *</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="e.g. 302001"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 font-bold text-glamora-charcoal focus:bg-white focus:ring-2 focus:ring-glamora-rose focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">City / District *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 font-medium focus:bg-white focus:ring-2 focus:ring-glamora-rose focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">State *</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 font-medium focus:bg-white focus:ring-2 focus:ring-glamora-rose focus:outline-none"
                />
              </div>
            </div>

            {/* Address Type Selector */}
            <div className="pt-2">
              <label className="block font-semibold text-gray-700 text-xs mb-2">Address Type</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setAddressType('home')}
                  className={`flex-1 py-2.5 px-4 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                    addressType === 'home'
                      ? 'border-glamora-rose bg-glamora-cream text-glamora-rose-dark shadow-sm'
                      : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <HomeIcon className="w-4 h-4" />
                  <span>Home (All Day Delivery)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAddressType('office')}
                  className={`flex-1 py-2.5 px-4 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                    addressType === 'office'
                      ? 'border-glamora-rose bg-glamora-cream text-glamora-rose-dark shadow-sm'
                      : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Office / College (10 AM – 6 PM)</span>
                </button>
              </div>
            </div>

            {/* Delivery Guarantee Note */}
            <div className="bg-glamora-cream/60 p-4 rounded-2xl border border-glamora-blush/60 flex items-center gap-3 text-xs text-gray-600">
              <Truck className="w-5 h-5 text-glamora-rose flex-shrink-0" />
              <span>
                <strong>Jaipur Artisan Workshop Dispatch:</strong> Orders are verified and handed to express couriers within 24 hours.
              </span>
            </div>
          </div>
        </div>

        {/* Right: Order Summary & Proceed Button (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-glamora-blush/80 shadow-luxury space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h2 className="font-serif text-lg font-bold text-glamora-charcoal flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-glamora-rose" />
                <span>Package Summary ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} Items)</span>
              </h2>
              <button
                type="button"
                onClick={onBackToCart}
                className="text-xs font-bold text-glamora-rose hover:underline"
              >
                Edit
              </button>
            </div>

            {/* Items mini list */}
            <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto pr-1">
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
                      {item.isCombo ? 'Special Combo' : `Size: ${item.size || 'Free Size'}`} • Qty: {item.quantity}
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
              <div className="flex justify-between text-base font-bold text-glamora-charcoal pt-3 border-t border-gray-100">
                <span>Payable Amount:</span>
                <span className="font-serif text-lg text-glamora-rose">₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Action Continue Button */}
            <button
              type="submit"
              className="w-full bg-glamora-rose hover:bg-glamora-rose-dark text-white font-sans font-bold text-xs uppercase tracking-widest py-4 rounded-full shadow-elevated transition duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Continue to Payment →</span>
            </button>

            <p className="text-[10px] text-center text-gray-400">
              Next step: Scan UPI QR Code or Enter UPI ID to complete your order
            </p>
          </div>
        </div>

      </form>

    </div>
  );
};
