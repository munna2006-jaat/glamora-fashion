import React from 'react';
import { Product, CartItem } from '../types';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (p: Product) => void;
  onSelectProduct: (p: Product) => void;
  onQuickAdd: (p: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onSelectProduct,
  onQuickAdd,
}) => {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-glamora-blush/40 shadow-soft hover:shadow-elevated transition-all duration-300 flex flex-col">
      {/* Product Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-glamora-cream cursor-pointer" onClick={() => onSelectProduct(product)}>
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
        />

        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={product.name}
            className="w-full h-full object-cover object-center absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />
        )}

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.isNewArrival && (
            <span className="bg-glamora-charcoal text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
              New
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-glamora-rose text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
              Best Seller
            </span>
          )}
          {product.isCollegeGirlEdit && (
            <span className="bg-glamora-gold text-glamora-charcoal text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
              Campus Pick
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition z-10 ${
            isWishlisted
              ? 'bg-glamora-rose text-white shadow-sm'
              : 'bg-white/80 hover:bg-white text-glamora-charcoal'
          }`}
          aria-label="Save to wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current text-white' : ''}`} />
        </button>

        {/* Quick View Button on Hover */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectProduct(product);
            }}
            className="w-full bg-white/95 hover:bg-white text-glamora-charcoal font-sans text-xs font-semibold py-2.5 rounded-xl shadow-lg flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-glamora-rose" />
            <span>Quick View & Sizes</span>
          </button>
        </div>
      </div>

      {/* Info Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1">
            <span className="uppercase tracking-wider font-semibold">{product.subcategory}</span>
            <span className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3 h-3 fill-current" />
              <span>{product.rating}</span>
              <span className="text-gray-400 font-normal">({product.reviewsCount})</span>
            </span>
          </div>

          <h3
            onClick={() => onSelectProduct(product)}
            className="font-serif text-sm font-semibold text-glamora-charcoal group-hover:text-glamora-rose transition cursor-pointer line-clamp-1"
          >
            {product.name}
          </h3>

          <p className="text-[11px] text-gray-500 font-sans mt-1 line-clamp-1">
            {product.fabric}
          </p>

          {/* Sizes preview */}
          <div className="flex items-center gap-1 mt-2">
            {product.sizes.slice(0, 4).map((s) => (
              <span key={s} className="text-[10px] bg-glamora-cream text-gray-600 px-1.5 py-0.5 rounded border border-glamora-blush/40 font-mono">
                {s}
              </span>
            ))}
            {product.sizes.length > 4 && (
              <span className="text-[10px] text-gray-400">+{product.sizes.length - 4}</span>
            )}
          </div>
        </div>

        {/* Pricing and Action */}
        <div className="mt-4 pt-2 border-t border-glamora-blush/40 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-base font-bold text-glamora-charcoal">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-[11px] text-gray-400 line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onQuickAdd(product)}
            className="bg-glamora-charcoal hover:bg-glamora-rose text-white text-xs font-semibold p-2 sm:px-3 sm:py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            title="Add to cart"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
