import React from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { Gem, ShoppingBag } from 'lucide-react';
import { isJewelryProduct, isBagProduct } from '../utils/productUtils';

interface AccessoriesSectionProps {
  products: Product[];
  wishlistIds: string[];
  onToggleWishlist: (p: Product) => void;
  onSelectProduct: (p: Product) => void;
  onQuickAdd: (p: Product) => void;
}

export const AccessoriesSection: React.FC<AccessoriesSectionProps> = ({
  products,
  wishlistIds,
  onToggleWishlist,
  onSelectProduct,
  onQuickAdd,
}) => {
  // Only 100% REAL JEWELRY belongs in the Jaipur Jewelry section
  const jewelryProducts = products.filter(isJewelryProduct);
  const bagProducts = products.filter(isBagProduct);

  if (jewelryProducts.length === 0 && bagProducts.length === 0) return null;

  return (
    <section id="accessories-section" className="py-16 sm:py-20 bg-white border-t border-glamora-blush/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* 1. 100% REAL HANDMADE JEWELRY SECTION (NO CLOTHES / NO BAGS) */}
        {jewelryProducts.length > 0 && (
          <div>
            <div className="text-center max-w-2xl mx-auto mb-10">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-glamora-rose mb-2">
                <Gem className="w-3.5 h-3.5 text-glamora-gold" />
                <span>Handmade Jaipur Jewelry</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-glamora-charcoal">
                Rajasthani 18K Minakari & Kundan Jhumkas
              </h2>
              <p className="mt-2 text-sm text-gray-500 font-sans font-light">
                Lotus motif Meenakari chandbalis, jingling ghungroo silver jhumkis, and royal solitaire necklaces.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {jewelryProducts.map(p => (
                <ProductCard
                  key={p.id}
                  product={p}
                  isWishlisted={wishlistIds.includes(p.id)}
                  onToggleWishlist={onToggleWishlist}
                  onSelectProduct={onSelectProduct}
                  onQuickAdd={onQuickAdd}
                />
              ))}
            </div>
          </div>
        )}

        {/* 2. TRENDING HANDBAGS & ACCESSORIES SHOWCASE */}
        {bagProducts.length > 0 && (
          <div className="pt-8 border-t border-glamora-blush/30">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-glamora-rose mb-2">
                <ShoppingBag className="w-3.5 h-3.5 text-glamora-rose" />
                <span>Everyday Luxury Accessories</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-glamora-charcoal">
                Chic Shoulder Bags & Campus Totes
              </h2>
              <p className="mt-2 text-sm text-gray-500 font-sans font-light">
                Elevate your look with our premium buckle shoulder bags and trendy faux fur totes.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {bagProducts.map(p => (
                <ProductCard
                  key={p.id}
                  product={p}
                  isWishlisted={wishlistIds.includes(p.id)}
                  onToggleWishlist={onToggleWishlist}
                  onSelectProduct={onSelectProduct}
                  onQuickAdd={onQuickAdd}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

