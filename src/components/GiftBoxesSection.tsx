import React from 'react';
import { Combo } from '../types';
import { Gift, Sparkles, Heart, ArrowRight } from 'lucide-react';

interface GiftBoxesSectionProps {
  combos: Combo[];
  onOpenComboModal: (combo: Combo) => void;
}

export const GiftBoxesSection: React.FC<GiftBoxesSectionProps> = ({
  combos,
  onOpenComboModal,
}) => {
  const giftCombos = combos.filter(c => c.title.includes('GIFT') || c.title.includes('LUXE'));

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-r from-glamora-blush/40 via-glamora-cream to-glamora-blush/40 border-y border-glamora-blush/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          
          {/* Left Text */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-1.5 bg-white text-glamora-rose-dark px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm">
              <Gift className="w-4 h-4 text-glamora-rose" />
              <span>The Art of Gifting</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-glamora-charcoal leading-tight">
              The GLAMORA Unboxing Experience
            </h2>

            <p className="text-sm sm:text-base text-glamora-charcoal/80 font-sans leading-relaxed font-light">
              Whether you’re celebrating your best friend’s 21st birthday, graduation day, or sending festive cheer to your sister, our curated keepsake gift boxes make every moment unforgettable.
            </p>

            <div className="space-y-3 pt-2 text-xs sm:text-sm text-glamora-charcoal/90">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-glamora-rose text-white flex items-center justify-center text-xs font-bold">1</span>
                <span>Signature rigid blush keepsake chest with magnetic closure</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-glamora-rose text-white flex items-center justify-center text-xs font-bold">2</span>
                <span>Hand-tied rose gold double-faced satin ribbon</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-glamora-rose text-white flex items-center justify-center text-xs font-bold">3</span>
                <span>Personalized handwritten calligraphy note with your custom message</span>
              </div>
            </div>
          </div>

          {/* Right Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {giftCombos.map(combo => (
              <div
                key={combo.id}
                onClick={() => onOpenComboModal(combo)}
                className="bg-white rounded-3xl p-5 border border-glamora-blush shadow-soft hover:shadow-elevated transition duration-300 cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-[4/4] rounded-2xl overflow-hidden bg-glamora-cream mb-4">
                    <img
                      src={combo.image}
                      alt={combo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <span className="absolute top-2.5 left-2.5 bg-glamora-charcoal text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                      {combo.badge}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-base text-glamora-charcoal group-hover:text-glamora-rose transition">
                    {combo.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {combo.tagline}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-glamora-blush/40 flex items-center justify-between">
                  <div>
                    <span className="font-serif font-bold text-base text-glamora-charcoal">
                      ₹{combo.comboPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[11px] text-gray-400 line-through ml-2">
                      ₹{combo.originalTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <span className="text-xs text-glamora-rose font-bold group-hover:translate-x-1 transition flex items-center gap-1">
                    <span>View Box</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
