import React from 'react';
import { Combo, CartItem } from '../types';
import { Sparkles, Check, ArrowRight, ShoppingBag, Eye, Heart } from 'lucide-react';

interface CombosSectionProps {
  combos: Combo[];
  onOpenComboModal: (combo: Combo) => void;
  onAddToCart: (item: CartItem) => void;
  onQuickBuy: (combo: Combo) => void;
}

export const CombosSection: React.FC<CombosSectionProps> = ({
  combos,
  onOpenComboModal,
  onAddToCart,
  onQuickBuy,
}) => {
  return (
    <section id="combos-section" className="py-16 sm:py-24 bg-gradient-to-b from-glamora-cream via-white to-glamora-cream/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-glamora-blush/70 text-glamora-rose-dark px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-glamora-gold" />
            <span>The Signature Differentiator</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-glamora-charcoal tracking-tight">
            Curated GLAMORA Combos
          </h2>
          <p className="mt-4 text-sm sm:text-base text-glamora-charcoal/70 font-sans font-light leading-relaxed">
            Every outfit needs the right accents. We style complete head-to-toe looks with hand-matched jewelry, bags & footwear — giving you effortlessly cohesive styling with up to ₹1,598 in bundled savings.
          </p>
        </div>

        {/* Combos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {combos.map((combo) => (
            <div
              key={combo.id}
              className="group bg-white rounded-3xl overflow-hidden border border-glamora-blush/60 shadow-soft hover:shadow-elevated transition-all duration-300 flex flex-col"
            >
              {/* Image & Badges */}
              <div className="relative aspect-[4/5] overflow-hidden bg-glamora-cream">
                <img
                  src={combo.image}
                  alt={combo.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />

                {/* Badge Tag */}
                <div className="absolute top-3 left-3 bg-glamora-charcoal/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                  {combo.badge}
                </div>

                {/* Savings Pill */}
                <div className="absolute top-3 right-3 bg-glamora-rose text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm animate-pulse-subtle">
                  Save ₹{combo.savings}
                </div>

                {/* Quick View Button on Hover */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                  <button
                    onClick={() => onOpenComboModal(combo)}
                    className="bg-white/95 hover:bg-white text-glamora-charcoal text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition duration-200 cursor-pointer"
                  >
                    <Eye className="w-4 h-4 text-glamora-rose" />
                    <span>Explore Breakdown</span>
                  </button>
                </div>
              </div>

              {/* Details Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 
                    onClick={() => onOpenComboModal(combo)}
                    className="font-serif text-lg font-bold text-glamora-charcoal group-hover:text-glamora-rose transition cursor-pointer"
                  >
                    {combo.title}
                  </h3>

                  <p className="text-xs text-glamora-charcoal/70 font-sans mt-1 line-clamp-1">
                    {combo.tagline}
                  </p>

                  {/* Included Items Checklist */}
                  <div className="mt-4 pt-3 border-t border-glamora-blush/40 space-y-1.5">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      What's Inside ({combo.items.length} Curated Items):
                    </div>
                    {combo.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs text-glamora-charcoal/90">
                        <span className="flex items-center gap-1.5 truncate pr-2">
                          <Check className="w-3.5 h-3.5 text-glamora-rose flex-shrink-0" />
                          <span className="truncate">{item.name}</span>
                        </span>
                        <span className="text-[11px] text-gray-400 flex-shrink-0">
                          ₹{item.individualPrice}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price & Actions */}
                <div className="mt-5 pt-3 border-t border-glamora-blush/40">
                  <div className="flex items-baseline justify-between mb-3">
                    <div>
                      <span className="text-xl font-bold font-serif text-glamora-charcoal">
                        ₹{combo.comboPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="ml-2 text-xs text-gray-400 line-through">
                        ₹{combo.originalTotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                      {Math.round((combo.savings / combo.originalTotal) * 100)}% Bundle OFF
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onOpenComboModal(combo)}
                      className="w-full bg-glamora-cream hover:bg-glamora-blush text-glamora-charcoal text-xs font-semibold py-2.5 rounded-xl transition border border-glamora-blush cursor-pointer"
                    >
                      Choose Sizes
                    </button>
                    <button
                      onClick={() => onQuickBuy(combo)}
                      className="w-full bg-glamora-charcoal hover:bg-glamora-rose text-white text-xs font-semibold py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-soft"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Instant Buy</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

