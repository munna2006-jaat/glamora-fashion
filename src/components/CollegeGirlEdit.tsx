import React from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { GraduationCap, Sparkles, ArrowRight } from 'lucide-react';

interface CollegeGirlEditProps {
  products: Product[];
  wishlistIds: string[];
  onToggleWishlist: (p: Product) => void;
  onSelectProduct: (p: Product) => void;
  onQuickAdd: (p: Product) => void;
  onViewAllCollege: () => void;
}

export const CollegeGirlEdit: React.FC<CollegeGirlEditProps> = ({
  products,
  wishlistIds,
  onToggleWishlist,
  onSelectProduct,
  onQuickAdd,
  onViewAllCollege,
}) => {
  const collegeProducts = products.filter(p => p.isCollegeGirlEdit || p.price <= 1499).slice(0, 4);

  return (
    <section className="py-16 sm:py-20 bg-glamora-cream/50 border-y border-glamora-blush/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-white text-glamora-rose-dark px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-3 border border-glamora-blush">
              <GraduationCap className="w-4 h-4 text-glamora-rose" />
              <span>Campus & Everyday Chic</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-glamora-charcoal tracking-tight">
              The College Girl Edit • ₹499 - ₹699
            </h2>
            <p className="mt-2 text-sm text-glamora-charcoal/70 font-sans font-light">
              Budget-friendly high-waist baggy jeans, mirror-work short peplum kurtis, and durable canvas tote bags for campus life.
            </p>
          </div>

          <button
            onClick={onViewAllCollege}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-glamora-charcoal hover:text-glamora-rose transition group"
          >
            <span>View All College Wear</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {collegeProducts.map(p => (
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
    </section>
  );
};

