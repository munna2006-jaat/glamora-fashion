import React, { useMemo } from 'react';
import { Product, Combo } from '../types';

interface StoryHighlightsProps {
  products?: Product[];
  combos?: Combo[];
  onSelectProduct?: (p: Product) => void;
  onSelectCombo?: (c: Combo) => void;
  onSelectCategory?: (cat: string) => void;
}

export const StoryHighlights: React.FC<StoryHighlightsProps> = ({
  products = [],
  combos = [],
  onSelectProduct,
  onSelectCombo,
  onSelectCategory,
}) => {
  const stories = useMemo(() => {
    const list: Array<{
      id: string;
      label: string;
      img: string;
      badge?: string;
      onClick: () => void;
    }> = [];

    // Combos first
    combos.forEach((c) => {
      if (c.image) {
        list.push({
          id: c.id,
          label: c.title.length > 18 ? c.title.slice(0, 16) + '...' : c.title,
          img: c.image,
          badge: `₹${c.comboPrice}`,
          onClick: () => {
            if (onSelectCombo) onSelectCombo(c);
            else if (onSelectCategory) onSelectCategory('combos');
          },
        });
      }
    });

    // Products next
    products.forEach((p) => {
      if (p.images && p.images[0]) {
        list.push({
          id: p.id,
          label: p.name.length > 18 ? p.name.slice(0, 16) + '...' : p.name,
          img: p.images[0],
          badge: `₹${p.price}`,
          onClick: () => {
            if (onSelectProduct) onSelectProduct(p);
            else if (onSelectCategory) onSelectCategory('all');
          },
        });
      }
    });

    return list;
  }, [combos, products, onSelectCombo, onSelectProduct, onSelectCategory]);

  if (stories.length === 0) return null;

  return (
    <section className="py-5 sm:py-8 bg-white border-b border-glamora-blush/40 w-full max-w-full overflow-hidden">
      <div className="w-full overflow-x-auto scrollbar-none px-4">
        <div className="flex items-center justify-start sm:justify-center gap-4 sm:gap-8 w-max sm:w-auto mx-auto pb-1">
          {stories.map((story) => (
            <button
              key={story.id}
              onClick={story.onClick}
              className="flex flex-col items-center group cursor-pointer flex-shrink-0"
            >
              <div className="relative p-1 rounded-full bg-gradient-to-tr from-glamora-gold via-glamora-rose to-glamora-blush group-hover:scale-105 transition-transform duration-300">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-white bg-glamora-cream">
                  <img
                    src={story.img}
                    alt={story.label}
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition duration-500"
                  />
                </div>
                {story.badge && (
                  <span className="absolute -top-1 -right-1 bg-glamora-charcoal text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-tighter shadow-sm border border-white">
                    {story.badge}
                  </span>
                )}
              </div>
              <span className="mt-2 text-[11px] sm:text-xs font-medium text-glamora-charcoal group-hover:text-glamora-rose transition tracking-tight max-w-[80px] sm:max-w-[100px] truncate">
                {story.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

