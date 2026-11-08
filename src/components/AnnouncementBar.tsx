import React, { useState } from 'react';
import { Sparkles, Truck, ShieldCheck, ChevronRight } from 'lucide-react';

export const AnnouncementBar: React.FC<{ onOpenCoupons?: () => void }> = ({ onOpenCoupons }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const announcements = [
    { text: 'USE CODE: GLAMFIRST FOR FLAT 10% OFF YOUR FIRST ORDER', highlight: 'GLAMFIRST' },
    { text: 'FREE EXPRESS SHIPPING ON ALL ORDERS ABOVE ₹999 ACROSS INDIA', highlight: 'FREE SHIPPING' },
    { text: 'COLLEGE SPECIAL: FLAT 15% OFF ON ALL CURATED COMBOS WITH CODE COLLEGE15', highlight: 'COLLEGE15' },
    { text: '100% PURE ARTISAN FABRICS & 7-DAY HASSLE-FREE RETURNS', highlight: 'LUXURY ASSURED' },
  ];

  return (
    <div className="bg-glamora-charcoal text-glamora-cream text-xs tracking-wider py-2 px-3 sm:py-2.5 sm:px-4 font-medium transition-all w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between min-w-0">
        <div className="hidden md:flex items-center space-x-6 text-[11px] uppercase tracking-widest text-glamora-blush flex-shrink-0">
          <span className="flex items-center gap-1.5"><Truck className="w-3.5 h-3.5 text-glamora-rose" /> Pan-India 3–5 Day Delivery</span>
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-glamora-rose" /> 100% Verified Quality</span>
        </div>

        <div className="w-full md:w-auto text-center flex items-center justify-center gap-1.5 sm:gap-2 min-w-0 px-1">
          <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-glamora-gold animate-pulse flex-shrink-0" />
          <span className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold text-white truncate max-w-[240px] sm:max-w-none">
            {announcements[currentSlide].text}
          </span>
          {onOpenCoupons && (
            <button 
              onClick={onOpenCoupons}
              className="text-[10px] sm:text-[11px] underline underline-offset-2 hover:text-glamora-rose transition ml-1 text-glamora-blush cursor-pointer flex items-center flex-shrink-0 whitespace-nowrap"
            >
              <span>Offers</span> <ChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 inline" />
            </button>
          )}
        </div>

        <div className="hidden md:flex items-center space-x-4 text-[11px] tracking-widest text-gray-300">
          <span>₹ INR (Inclusive of all taxes)</span>
          <span className="text-glamora-rose font-bold">•</span>
          <span>Delhi • Mumbai • Bengaluru</span>
        </div>
      </div>
    </div>
  );
};

