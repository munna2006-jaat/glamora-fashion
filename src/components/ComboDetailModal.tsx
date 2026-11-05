import React, { useState } from 'react';
import { Combo, CartItem } from '../types';
import { X, Sparkles, Check, ShoppingBag, ShieldCheck, Truck, ArrowRight } from 'lucide-react';

interface ComboDetailModalProps {
  combo: Combo | null;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
  onBuyNow: (item: CartItem) => void;
}

export const ComboDetailModal: React.FC<ComboDetailModalProps> = ({
  combo,
  onClose,
  onAddToCart,
  onBuyNow,
}) => {
  if (!combo) return null;

  // Selected size for each item in the combo that has sizes
  const [selectedSizes, setSelectedSizes] = useState<{ [itemName: string]: string }>(() => {
    const initial: { [key: string]: string } = {};
    combo.items.forEach(item => {
      if (item.availableSizes && item.availableSizes.length > 0) {
        initial[item.name] = item.availableSizes[0];
      }
    });
    return initial;
  });

  const handleSizeChange = (itemName: string, size: string) => {
    setSelectedSizes(prev => ({ ...prev, [itemName]: size }));
  };

  const createCartItem = (): CartItem => {
    return {
      id: `${combo.id}-${Date.now()}`,
      comboId: combo.id,
      name: combo.title,
      price: combo.comboPrice,
      originalPrice: combo.originalTotal,
      image: combo.image,
      selectedComboSizes: selectedSizes,
      quantity: 1,
      isCombo: true,
      comboItems: combo.items
    };
  };

  const handleAdd = () => {
    onAddToCart(createCartItem());
    onClose();
  };

  const handleBuy = () => {
    onBuyNow(createCartItem());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-luxury border border-glamora-blush my-6 max-h-[90vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-white/80 hover:bg-white text-glamora-charcoal p-2 rounded-full shadow-md transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2">
          
          {/* Left Column: Big Combo Image & Included Items Gallery */}
          <div className="bg-glamora-cream/60 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-glamora-blush/60">
            <div>
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-soft mb-4">
                <img
                  src={combo.image}
                  alt={combo.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-glamora-charcoal text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                  {combo.badge}
                </span>
                <span className="absolute bottom-3 right-3 bg-glamora-rose text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  You Save ₹{combo.savings}
                </span>
              </div>

              {/* Thumbnails of included items */}
              <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                All Included In This Box:
              </div>
              <div className="grid grid-cols-3 gap-2">
                {combo.items.map((item, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-2 border border-glamora-blush/40 flex flex-col items-center text-center">
                    <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-lg mb-1" />
                    <span className="text-[10px] font-semibold text-glamora-charcoal line-clamp-1">{item.name}</span>
                    <span className="text-[10px] text-gray-400">₹{item.individualPrice}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery & Trust */}
            <div className="mt-6 pt-4 border-t border-glamora-blush/50 space-y-2 text-xs text-glamora-charcoal/80">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-glamora-rose" />
                <span>Estimated dispatch in 24 hours (Free Express Delivery)</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-glamora-rose" />
                <span>Signature GLAMORA blush box with satin gift ribbon included</span>
              </div>
            </div>
          </div>

          {/* Right Column: Configuration & Sizes */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-glamora-blush/60 text-glamora-rose-dark px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-glamora-gold" />
                <span>Curated Head-To-Toe Look</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-glamora-charcoal">
                {combo.title}
              </h2>

              <p className="text-xs sm:text-sm text-glamora-charcoal/70 mt-2 font-sans leading-relaxed">
                {combo.description}
              </p>

              {/* Price Calculation Box */}
              <div className="mt-5 p-4 rounded-2xl bg-glamora-cream border border-glamora-blush/60">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Combined Retail Price:</span>
                  <span className="line-through font-medium">₹{combo.originalTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-xs text-emerald-600 font-semibold mb-2">
                  <span>Exclusive Combo Saving:</span>
                  <span>- ₹{combo.savings.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-glamora-blush/60">
                  <span className="text-sm font-bold text-glamora-charcoal">Combo Bundle Price:</span>
                  <span className="text-2xl font-serif font-bold text-glamora-charcoal">
                    ₹{combo.comboPrice.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Size Selectors For Apparel/Footwear inside combo */}
              <div className="mt-6 space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-glamora-charcoal">
                  Configure Your Sizes:
                </div>

                {combo.items.map((item, idx) => (
                  <div key={idx} className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                    <div className="flex justify-between text-xs font-semibold text-glamora-charcoal mb-2">
                      <span className="truncate pr-2">{item.name}</span>
                      <span className="text-glamora-rose text-[11px] uppercase tracking-wider">{item.category}</span>
                    </div>

                    {item.availableSizes && item.availableSizes.length > 1 ? (
                      <div className="flex flex-wrap gap-2">
                        {item.availableSizes.map(size => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => handleSizeChange(item.name, size)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                              selectedSizes[item.name] === size
                                ? 'bg-glamora-charcoal text-white font-bold shadow-sm'
                                : 'bg-white text-gray-700 border border-gray-200 hover:border-glamora-rose'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-[11px] text-gray-500 font-medium">
                        Standard / Free Size (Fits all comfortably)
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-8 pt-4 border-t border-glamora-blush/40 flex items-center gap-3">
              <button
                onClick={handleAdd}
                className="flex-1 bg-glamora-cream hover:bg-glamora-blush text-glamora-charcoal font-sans font-semibold text-xs sm:text-sm py-3.5 rounded-2xl border border-glamora-blush transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-glamora-rose" />
                <span>Add Combo to Cart</span>
              </button>

              <button
                onClick={handleBuy}
                className="flex-1 bg-glamora-charcoal hover:bg-glamora-rose text-white font-sans font-bold text-xs sm:text-sm py-3.5 rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer shadow-elevated"
              >
                <span>Buy Combo Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
