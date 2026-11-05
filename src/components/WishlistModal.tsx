import React from 'react';
import { Product, CartItem } from '../types';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistedProducts: Product[];
  onRemoveFromWishlist: (p: Product) => void;
  onMoveToCart: (p: Product) => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  wishlistedProducts,
  onRemoveFromWishlist,
  onMoveToCart,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-luxury border border-glamora-blush flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-glamora-blush/60 flex items-center justify-between bg-glamora-cream/40">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-glamora-rose fill-current" />
            <h2 className="font-serif text-lg font-bold text-glamora-charcoal">
              My Saved Wishlist ({wishlistedProducts.length})
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-glamora-charcoal rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 flex-1 space-y-4">
          {wishlistedProducts.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Heart className="w-12 h-12 text-glamora-blush mx-auto" />
              <h3 className="font-serif text-lg font-bold text-glamora-charcoal">Your wishlist is empty</h3>
              <p className="text-xs text-gray-500">Tap the heart on any product or combo to save your favorites here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {wishlistedProducts.map(p => (
                <div key={p.id} className="p-3 rounded-2xl bg-glamora-cream/30 border border-glamora-blush/40 flex gap-3">
                  <img src={p.images[0]} alt={p.name} className="w-16 h-20 object-cover rounded-xl" />
                  <div className="flex-1 min-w-0 flex flex-col justify-between text-xs">
                    <div>
                      <h4 className="font-serif font-bold text-glamora-charcoal truncate">{p.name}</h4>
                      <div className="font-serif font-bold text-glamora-rose mt-0.5">₹{p.price.toLocaleString('en-IN')}</div>
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={() => {
                          onMoveToCart(p);
                          onRemoveFromWishlist(p);
                        }}
                        className="bg-glamora-charcoal hover:bg-glamora-rose text-white text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Move to Bag</span>
                      </button>
                      <button
                        onClick={() => onRemoveFromWishlist(p)}
                        className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

