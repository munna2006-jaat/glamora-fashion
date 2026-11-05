import React, { useState } from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { Sparkles, ArrowRight } from 'lucide-react';

interface IndianWearSectionProps {
  products: Product[];
  wishlistIds: string[];
  onToggleWishlist: (p: Product) => void;
  onSelectProduct: (p: Product) => void;
  onQuickAdd: (p: Product) => void;
}

export const IndianWearSection: React.FC<IndianWearSectionProps> = ({
  products,
  wishlistIds,
  onToggleWishlist,
  onSelectProduct,
  onQuickAdd,
}) => {
  const [selectedSub, setSelectedSub] = useState<string>('all');

  const indianProducts = products.filter(p => p.category === 'indian');
  const subcategories = ['all', 'Kurtis', 'Kurti sets', 'Sarees', 'Ethnic co-ord sets', 'Festive wear'];

  const displayed = selectedSub === 'all'
    ? indianProducts
    : indianProducts.filter(p => p.subcategory.toLowerCase() === selectedSub.toLowerCase());

  return (
    <section id="indian-section" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-glamora-rose mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Timeless Craft & Contemporary Cuts</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-glamora-charcoal">
              Indian Ethnic Collection
            </h2>
            <p className="mt-2 text-sm text-gray-500 font-sans font-light">
              From pure mulmul handblock daily kurtis to luminous Chanderi sets and tissue sarees.
            </p>
          </div>

          {/* Subcategory Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {subcategories.map(sub => (
              <button
                key={sub}
                onClick={() => setSelectedSub(sub)}
                className={`text-xs px-3.5 py-1.5 rounded-full font-medium whitespace-nowrap transition cursor-pointer ${
                  selectedSub === sub
                    ? 'bg-glamora-charcoal text-white font-bold'
                    : 'bg-glamora-cream text-glamora-charcoal border border-glamora-blush/60 hover:bg-glamora-blush/40'
                }`}
              >
                {sub === 'all' ? 'All Indian Wear' : sub}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayed.map(p => (
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
