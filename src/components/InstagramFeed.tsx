import React from 'react';
import { Instagram, Sparkles, Heart } from 'lucide-react';
import { Product } from '../types';

interface InstagramFeedProps {
  products?: Product[];
  onSelectProduct?: (p: Product) => void;
  onShopLook: () => void;
}

export const InstagramFeed: React.FC<InstagramFeedProps> = ({
  products = [],
  onSelectProduct,
  onShopLook,
}) => {
  const displayed = products.filter(p => p.images && p.images[0]).slice(0, 6);

  if (displayed.length === 0) return null;

  return (
    <section className="py-16 sm:py-20 bg-glamora-cream/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-glamora-rose mb-1">
            <Instagram className="w-4 h-4" />
            <span>#GlamoraCommunity Lookbook</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-glamora-charcoal">
            Trending Customer Styles
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Real customer fits and viral looks. Tap any photo to shop the style directly!
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {displayed.map((p, idx) => (
            <div
              key={p.id || idx}
              onClick={() => {
                if (onSelectProduct) onSelectProduct(p);
                else onShopLook();
              }}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-glamora-blush/20 cursor-pointer shadow-soft"
            >
              <img
                src={p.images[0]}
                alt={p.name}
                className="w-full h-full object-cover object-center group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3 flex flex-col justify-end text-white text-xs">
                <div className="font-semibold truncate text-[11px]">{p.name}</div>
                <div className="text-[10px] text-glamora-blush font-bold mt-0.5">₹{p.price.toLocaleString('en-IN')} • Tap to View</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

