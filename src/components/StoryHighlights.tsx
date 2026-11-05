import React from 'react';

interface StoryHighlightsProps {
  onSelectCategory: (cat: string) => void;
}

export const StoryHighlights: React.FC<StoryHighlightsProps> = ({ onSelectCategory }) => {
  const stories = [
    { id: 'combos', label: '8 Combos ✨', img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80', badge: 'Hot' },
    { id: 'college', label: 'College Under ₹999', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=300&q=80', badge: 'Viral' },
    { id: 'indian', label: 'Cotton Kurtis', img: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=300&q=80' },
    { id: 'festive', label: 'Festive Sarees', img: 'https://images.unsplash.com/photo-1610030469668-932d0c64c781?auto=format&fit=crop&w=300&q=80' },
    { id: 'western', label: 'Midi Dresses', img: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=300&q=80' },
    { id: 'accessories', label: '18K Jhumkas', img: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=300&q=80' },
    { id: 'footwear', label: 'Cushion Juttis', img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=300&q=80' },
  ];

  return (
    <section className="py-6 sm:py-8 bg-white border-b border-glamora-blush/40 overflow-x-auto scrollbar-none">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-start sm:justify-center gap-4 sm:gap-8 min-w-max">
        {stories.map((story) => (
          <button
            key={story.id}
            onClick={() => onSelectCategory(story.id)}
            className="flex flex-col items-center group cursor-pointer"
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
            <span className="mt-2 text-[11px] sm:text-xs font-medium text-glamora-charcoal group-hover:text-glamora-rose transition tracking-tight">
              {story.label}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};

