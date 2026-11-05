import React, { useState } from 'react';
import { CartItem, Coupon } from '../types';
import { X, ShoppingBag, Trash2, Plus, Minus, Gift, Tag, ArrowRight, Sparkles } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: (appliedCoupon: Coupon | null, giftWrap: boolean) => void;
  coupons: Coupon[];
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  coupons,
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');
  const [giftWrap, setGiftWrap] = useState(false);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const freeShippingThreshold = 999;
  const isFreeShipping = subtotal >= freeShippingThreshold || subtotal === 0;
  const shippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  let discount = 0;
  if (appliedCoupon) {
    discount = Math.round((subtotal * appliedCoupon.discountPercent) / 100);
    if (appliedCoupon.maxDiscount && discount > appliedCoupon.maxDiscount) {
      discount = appliedCoupon.maxDiscount;
    }
  }

  const shippingCost = isFreeShipping ? 0 : 99;
  const giftWrapCost = giftWrap ? 49 : 0;
  const total = Math.max(0, subtotal - discount + shippingCost + giftWrapCost);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const code = couponCode.trim().toUpperCase();
    const found = coupons.find(c => c.code === code);
    if (!found) {
      setCouponError('Invalid coupon code. Try GLAMFIRST or COLLEGE15');
      return;
    }
    if (subtotal < found.minOrder) {
      setCouponError(`Min order of ₹${found.minOrder} required for ${found.code}`);
      return;
    }
    setAppliedCoupon(found);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-5 border-b border-glamora-blush/60 flex items-center justify-between bg-glamora-cream/40">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-glamora-rose" />
              <h2 className="font-serif text-lg font-bold text-glamora-charcoal">
                Your Shopping Bag ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-glamora-charcoal transition rounded-full hover:bg-white"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="bg-glamora-cream/90 px-5 py-3 border-b border-glamora-blush/40 text-xs">
            {isFreeShipping ? (
              <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                <Sparkles className="w-4 h-4 text-glamora-gold animate-bounce" />
                <span>Congratulations! You have unlocked FREE Express Shipping!</span>
              </div>
            ) : (
              <div className="text-gray-700">
                Add <span className="font-bold text-glamora-charcoal">₹{freeShippingThreshold - subtotal}</span> more for <span className="font-bold text-glamora-rose">FREE Express Shipping</span>!
              </div>
            )}
            <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-glamora-rose to-glamora-gold h-full transition-all duration-500 rounded-full"
                style={{ width: `${shippingProgress}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-20 h-20 rounded-full bg-glamora-cream flex items-center justify-center border border-glamora-blush">
                  <ShoppingBag className="w-10 h-10 text-glamora-rose-dark" />
                </div>
                <h3 className="font-serif text-lg font-bold text-glamora-charcoal">Your bag is empty</h3>
                <p className="text-xs text-gray-500 max-w-xs">
                  Discover curated outfits and exclusive combos designed for you.
                </p>
                <button
                  onClick={onClose}
                  className="bg-glamora-charcoal text-white text-xs font-semibold px-6 py-3 rounded-full hover:bg-glamora-rose transition cursor-pointer"
                >
                  Start Exploring
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3.5 p-3 rounded-2xl bg-glamora-cream/30 border border-glamora-blush/40"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-24 object-cover rounded-xl border border-glamora-blush/30 bg-white"
                  />

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-serif text-xs sm:text-sm font-bold text-glamora-charcoal line-clamp-1">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-gray-400 hover:text-red-500 p-1 transition"
                          title="Remove"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {item.isCombo ? (
                        <span className="inline-block bg-glamora-blush text-glamora-rose-dark text-[10px] font-bold px-2 py-0.5 rounded-full mt-1">
                          Curated Combo Bundle
                        </span>
                      ) : (
                        <div className="text-[11px] text-gray-500 mt-0.5">
                          Size: <span className="font-semibold text-glamora-charcoal">{item.size || 'Standard'}</span>
                        </div>
                      )}

                      {/* Combo size tags */}
                      {item.selectedComboSizes && (
                        <div className="mt-1 space-y-0.5">
                          {Object.entries(item.selectedComboSizes).map(([k, v]) => (
                            <div key={k} className="text-[10px] text-gray-500 truncate">
                              • {k}: <span className="font-semibold text-glamora-charcoal">{v}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-glamora-blush/30">
                      <div className="flex items-center border border-gray-200 rounded-lg bg-white">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="p-1 hover:bg-gray-100 text-gray-600 rounded-l"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-semibold text-glamora-charcoal">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="p-1 hover:bg-gray-100 text-gray-600 rounded-r"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="font-serif text-sm font-bold text-glamora-charcoal">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                        {item.originalPrice && (
                          <div className="text-[10px] text-gray-400 line-through">
                            ₹{(item.originalPrice * item.quantity).toLocaleString('en-IN')}
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Breakdown */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t border-glamora-blush/60 bg-white space-y-3">
              
              {/* Gift Wrapping Toggle */}
              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-glamora-cream border border-glamora-blush/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={giftWrap}
                  onChange={(e) => setGiftWrap(e.target.checked)}
                  className="rounded text-glamora-rose focus:ring-glamora-rose"
                />
                <Gift className="w-4 h-4 text-glamora-rose" />
                <span className="text-xs text-glamora-charcoal font-medium flex-1">
                  Luxury Gift Packaging & Handwritten Note (+₹49)
                </span>
              </label>

              {/* Coupon Box */}
              <div>
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Coupon: GLAMFIRST or COLLEGE15"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="w-full bg-glamora-cream/60 border border-glamora-blush/60 rounded-xl py-2 pl-9 pr-3 text-xs uppercase focus:outline-none focus:ring-1 focus:ring-glamora-rose"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-glamora-cream hover:bg-glamora-blush text-glamora-charcoal text-xs font-semibold px-4 py-2 rounded-xl border border-glamora-blush transition cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
                {couponError && <p className="text-[10px] text-red-500 mt-1">{couponError}</p>}
                {appliedCoupon && (
                  <p className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center justify-between">
                    <span>✓ {appliedCoupon.code} applied: -₹{discount}</span>
                    <button onClick={() => setAppliedCoupon(null)} className="text-gray-400 hover:text-red-500 text-[10px]">Remove</button>
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-glamora-charcoal/80 pt-2 border-t border-glamora-blush/40">
                <div className="flex justify-between">
                  <span>Bag Subtotal:</span>
                  <span className="font-semibold text-glamora-charcoal">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Coupon Discount:</span>
                    <span>- ₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Express Shipping:</span>
                  <span>{isFreeShipping ? <span className="text-emerald-600 font-bold">FREE</span> : '₹99'}</span>
                </div>
                {giftWrap && (
                  <div className="flex justify-between">
                    <span>Luxury Gift Wrap:</span>
                    <span>₹49</span>
                  </div>
                )}
                <div className="flex justify-between items-baseline pt-2 border-t border-glamora-blush text-sm font-bold text-glamora-charcoal">
                  <span>Grand Total:</span>
                  <span className="text-xl font-serif text-glamora-charcoal">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => onCheckout(appliedCoupon, giftWrap)}
                className="w-full bg-glamora-charcoal hover:bg-glamora-rose text-white text-xs sm:text-sm font-bold py-3.5 rounded-2xl transition flex items-center justify-center gap-2 shadow-elevated cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

