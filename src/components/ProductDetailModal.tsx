import React, { useState } from 'react';
import { Product, CartItem } from '../types';
import { X, Heart, Star, ShoppingBag, Truck, RotateCcw, ShieldCheck, Check, Sparkles, MapPin } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  isWishlisted: boolean;
  onToggleWishlist: (p: Product) => void;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
  onBuyNow: (item: CartItem) => void;
  allProducts: Product[];
  onSelectProduct: (p: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onClose,
  onAddToCart,
  onBuyNow,
  allProducts,
  onSelectProduct,
}) => {
  if (!product) return null;

  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'Free Size');
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || 'Standard');
  const [pincode, setPincode] = useState('');
  const [deliveryResult, setDeliveryResult] = useState<string | null>(null);

  const checkPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode || pincode.length < 6) {
      setDeliveryResult('Please enter a valid 6-digit Indian PIN code.');
      return;
    }
    const days = Math.floor(Math.random() * 2) + 2; // 2 to 3 days
    setDeliveryResult(`✓ Delivers to ${pincode} in ${days} days. Free Express Delivery applied!`);
  };

  const getCartItem = (): CartItem => ({
    id: `${product.id}-${selectedSize}-${Date.now()}`,
    productId: product.id,
    name: product.name,
    price: product.price,
    originalPrice: product.originalPrice,
    image: product.images[0],
    size: selectedSize,
    color: selectedColor,
    quantity: 1,
    isCombo: false,
  });

  const handleAdd = () => {
    onAddToCart(getCartItem());
    onClose();
  };

  const handleBuy = () => {
    onBuyNow(getCartItem());
    onClose();
  };

  // Find matching accessories or related
  const matchingItems = product.matchingAccessories
    ? allProducts.filter(p => product.matchingAccessories?.includes(p.id))
    : allProducts.filter(p => p.category === 'accessories').slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-luxury border border-glamora-blush my-6 max-h-[92vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-white/90 hover:bg-white text-glamora-charcoal p-2 rounded-full shadow-md transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2">
          
          {/* Left Column: Gallery */}
          <div className="p-6 bg-glamora-cream/40 flex flex-col justify-between border-b md:border-b-0 md:border-r border-glamora-blush/60">
            <div>
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-white shadow-soft mb-3">
                <img
                  src={activeImage}
                  alt={product.name}
                  className="w-full h-full object-cover object-center transition-all duration-300"
                />
                
                {/* Wishlist Button */}
                <button
                  onClick={() => onToggleWishlist(product)}
                  className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md shadow-sm transition ${
                    isWishlisted ? 'bg-glamora-rose text-white' : 'bg-white/80 hover:bg-white text-glamora-charcoal'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-2">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(img)}
                      className={`w-16 h-20 rounded-xl overflow-hidden border-2 transition ${
                        activeImage === img ? 'border-glamora-rose shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Trust Badges */}
            <div className="mt-6 pt-4 border-t border-glamora-blush/60 grid grid-cols-3 gap-2 text-center text-[10px] text-gray-500 font-medium">
              <div className="p-2 rounded-xl bg-white border border-glamora-blush/30">
                <Truck className="w-4 h-4 text-glamora-rose mx-auto mb-1" />
                <span>Pan-India 3-5d Delivery</span>
              </div>
              <div className="p-2 rounded-xl bg-white border border-glamora-blush/30">
                <RotateCcw className="w-4 h-4 text-glamora-rose mx-auto mb-1" />
                <span>7-Day Easy Exchange</span>
              </div>
              <div className="p-2 rounded-xl bg-white border border-glamora-blush/30">
                <ShieldCheck className="w-4 h-4 text-glamora-rose mx-auto mb-1" />
                <span>100% Verified Quality</span>
              </div>
            </div>
          </div>

          {/* Right Column: Details & Selection */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-glamora-rose mb-1">
                GLAMORA • {product.subcategory}
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-glamora-charcoal">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full text-xs font-bold text-amber-600">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{product.rating}</span>
                </div>
                <span className="text-xs text-gray-400">({product.reviewsCount} verified student & stylist reviews)</span>
              </div>

              {/* Pricing */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-3xl font-serif font-bold text-glamora-charcoal">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-base text-gray-400 line-through">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
                    </span>
                  </>
                )}
              </div>
              <div className="text-[11px] text-gray-400 mt-0.5">Inclusive of all taxes & duty</div>

              {/* Description */}
              <p className="mt-4 text-xs sm:text-sm text-glamora-charcoal/80 leading-relaxed font-sans">
                {product.description}
              </p>

              {/* Size Selector */}
              <div className="mt-6">
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-glamora-charcoal mb-2">
                  <span>Select Size:</span>
                  <span className="text-glamora-rose font-medium lowercase text-[11px] underline cursor-pointer">
                    View Size Chart (XS: 32", S: 34", M: 36", L: 38", XL: 40")
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                        selectedSize === size
                          ? 'bg-glamora-charcoal text-white shadow-sm'
                          : 'bg-glamora-cream text-glamora-charcoal border border-glamora-blush hover:border-glamora-rose'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div className="mt-5">
                  <div className="text-xs font-bold uppercase tracking-wider text-glamora-charcoal mb-2">
                    Shade: <span className="font-medium text-gray-600 capitalize">{selectedColor}</span>
                  </div>
                  <div className="flex gap-2">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setSelectedColor(c.name)}
                        className={`w-7 h-7 rounded-full border-2 transition cursor-pointer ${
                          selectedColor === c.name ? 'border-glamora-charcoal scale-110 shadow-sm' : 'border-gray-200'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Fabric & Care Specs */}
              <div className="mt-5 p-3.5 rounded-2xl bg-glamora-cream/60 border border-glamora-blush/60 space-y-1 text-xs">
                <div><span className="font-semibold text-glamora-charcoal">Fabric:</span> <span className="text-gray-600">{product.fabric}</span></div>
                <div><span className="font-semibold text-glamora-charcoal">Care:</span> <span className="text-gray-600">{product.care}</span></div>
                <div><span className="font-semibold text-glamora-charcoal">SKU:</span> <span className="text-gray-400 font-mono">{product.sku}</span></div>
              </div>

              {/* Pincode Estimator */}
              <div className="mt-5">
                <form onSubmit={checkPincode} className="flex gap-2">
                  <div className="relative flex-1">
                    <MapPin className="w-4 h-4 text-glamora-rose absolute left-3 top-3" />
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="Enter 6-digit Pincode"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-white border border-gray-200 rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-glamora-rose"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-glamora-cream hover:bg-glamora-blush text-glamora-charcoal text-xs font-semibold px-4 py-2 rounded-xl border border-glamora-blush transition cursor-pointer"
                  >
                    Check
                  </button>
                </form>
                {deliveryResult && (
                  <p className="text-[11px] mt-1.5 text-emerald-700 font-medium">
                    {deliveryResult}
                  </p>
                )}
              </div>

              {/* Complete The Look Accessories */}
              {matchingItems.length > 0 && (
                <div className="mt-6 pt-4 border-t border-glamora-blush/40">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                    Complete The Look:
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {matchingItems.map(m => (
                      <div
                        key={m.id}
                        onClick={() => onSelectProduct(m)}
                        className="flex items-center gap-2 p-2 rounded-xl bg-white border border-glamora-blush/40 hover:bg-glamora-cream cursor-pointer transition"
                      >
                        <img src={m.images[0]} alt={m.name} className="w-10 h-10 object-cover rounded-lg" />
                        <div className="min-w-0 flex-1">
                          <div className="text-[11px] font-semibold text-glamora-charcoal truncate">{m.name}</div>
                          <div className="text-[10px] text-glamora-rose font-bold">₹{m.price}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Sticky Action Bar */}
            <div className="mt-8 pt-4 border-t border-glamora-blush/60 flex items-center gap-3">
              <button
                type="button"
                onClick={handleAdd}
                className="flex-1 bg-glamora-cream hover:bg-glamora-blush text-glamora-charcoal font-sans font-semibold text-xs sm:text-sm py-3.5 rounded-2xl border border-glamora-blush transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-glamora-rose" />
                <span>Add to Bag</span>
              </button>

              <button
                type="button"
                onClick={handleBuy}
                className="flex-1 bg-glamora-charcoal hover:bg-glamora-rose text-white font-sans font-bold text-xs sm:text-sm py-3.5 rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer shadow-elevated"
              >
                <span>Instant Checkout</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
