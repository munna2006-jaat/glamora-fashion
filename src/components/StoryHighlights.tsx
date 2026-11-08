import React from 'react';

interface StoryHighlightsProps {
  onSelectCategory: (cat: string) => void;
}

export const StoryHighlights: React.FC<StoryHighlightsProps> = ({ onSelectCategory }) => {
  const stories = [
    { id: 'combos', label: '🔥 ₹499 Combos', img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80', badge: 'Hot' },
    { id: 'kurti_jeans', label: '👖 Kurti + Jeans', img: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=300&q=80', badge: '₹699' },
    { id: 'indian', label: '🌸 Sanganeri Kurti', img: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=300&q=80', badge: '₹499' },
    { id: 'accessories', label: '✨ Minakari Jhumkas', img: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=300&q=80' },
    { id: 'indian', label: '👑 Leheriya Flared', img: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=300&q=80' },
    { id: 'accessories', label: '🪩 Oxidised Silver', img: 'https://images.unsplash.com/photo-1611591475155-426ea7b18fc9?auto=format&fit=crop&w=300&q=80' },
  ];

  return (
    <section className="py-5 sm:py-8 bg-white border-b border-glamora-blush/40 w-full max-w-full overflow-hidden">
      <div className="w-full overflow-x-auto scrollbar-none px-4">
        <div className="flex items-center justify-start sm:justify-center gap-4 sm:gap-8 w-max sm:w-auto mx-auto pb-1">
          {stories.map((story) => (
            <button
              key={story.id}
              onClick={() => onSelectCategory(story.id)}
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
              <span className="mt-2 text-[11px] sm:text-xs font-medium text-glamora-charcoal group-hover:text-glamora-rose transition tracking-tight">
                {story.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

