import React from 'react';
import { Home, Sparkles, ShoppingBag, Heart, Layers } from 'lucide-react';

interface MobileBottomNavProps {
  cartCount: number;
  wishlistCount: number;
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  cartCount,
  wishlistCount,
  activeCategory,
  onSelectCategory,
  onOpenCart,
  onOpenWishlist,
}) => {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-glamora-blush/60 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] px-2 py-1.5 safe-area-pb">
      <div className="grid grid-cols-5 items-center justify-around text-center">
        
        {/* Home */}
        <button
          onClick={() => {
            onSelectCategory('all');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center py-1 transition ${
            activeCategory === 'all' ? 'text-glamora-rose font-bold' : 'text-gray-500 hover:text-glamora-charcoal'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Home</span>
        </button>

        {/* Combos */}
        <button
          onClick={() => onSelectCategory('combos')}
          className={`flex flex-col items-center py-1 transition relative ${
            activeCategory === 'combos' ? 'text-glamora-rose font-bold' : 'text-gray-500 hover:text-glamora-charcoal'
          }`}
        >
          <Sparkles className="w-5 h-5 mb-0.5 text-glamora-gold animate-pulse" />
          <span className="text-[10px] tracking-tight font-semibold">Combos</span>
          <span className="absolute -top-1 right-2 bg-glamora-rose text-white text-[8px] font-bold px-1 rounded-full uppercase">
            ₹499+
          </span>
        </button>

        {/* Kurtis */}
        <button
          onClick={() => onSelectCategory('indian')}
          className={`flex flex-col items-center py-1 transition ${
            activeCategory === 'indian' ? 'text-glamora-rose font-bold' : 'text-gray-500 hover:text-glamora-charcoal'
          }`}
        >
          <Layers className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Kurtis</span>
        </button>

        {/* Wishlist */}
        <button
          onClick={onOpenWishlist}
          className="flex flex-col items-center py-1 text-gray-500 hover:text-glamora-rose transition relative"
        >
          <Heart className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Wishlist</span>
          {wishlistCount > 0 && (
            <span className="absolute top-0 right-3 bg-glamora-rose text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {wishlistCount}
            </span>
          )}
        </button>

        {/* Bag */}
        <button
          onClick={onOpenCart}
          className="flex flex-col items-center py-1 text-glamora-charcoal hover:text-glamora-rose transition relative"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 mb-0.5 text-glamora-charcoal" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-glamora-rose text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight font-bold">Bag</span>
        </button>

      </div>
    </div>
  );
};

