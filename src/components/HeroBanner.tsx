import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroBannerProps {
  onShopCombos: () => void;
  onShopIndian: () => void;
  onShopCollege: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onShopCombos,
  onShopIndian,
  onShopCollege,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      badge: '🔥 DHAMAKA SALE • KURTI + EARRINGS FROM ₹499',
      headline: 'Authentic Rajasthani Kurtis & Matching Minakari Jhumkas',
      subline: 'Pure Jaipur mulmul handblock floral kurtis matched with 18K gold plated Minakari Chandbali jhumkis. Complete set starting at just ₹499!',
      ctaText: 'Shop Kurti Combos (₹499)',
      action: onShopCombos,
      secondaryCta: 'Explore Jaipuri Kurtis',
      secondaryAction: onShopIndian,
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=85',
      imagePosition: 'object-[center_top] sm:object-center',
    },
    {
      id: 2,
      badge: '👖 VIRAL GEN-Z HIT • FLAT ₹699 COMBO',
      headline: 'Short Kurti + High-Waist Baggy Denim Jeans Combo',
      subline: 'The ultimate viral campus outfit! Pair authentic mirror-work Rajasthani short kurti with relaxed wide-leg denim jeans for only ₹699.',
      ctaText: 'Get Kurti + Jeans @ ₹699',
      action: onShopCollege,
      secondaryCta: 'View All Combos',
      secondaryAction: onShopCombos,
      image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1600&q=85',
      imagePosition: 'object-[center_top] sm:object-center',
    },
    {
      id: 3,
      badge: '🌸 JAIPUR SPECIAL • PURE COTTON AT ₹499',
      headline: 'Sanganeri, Bagru & Leheriya Flared Anarkalis',
      subline: 'Breathable summer-ready Rajasthani handblock kurtis crafted for college girls. Zero shoe-bite and 100% skin-friendly cotton.',
      ctaText: 'Shop Kurtis @ ₹499',
      action: onShopIndian,
      secondaryCta: 'Shop Combos',
      secondaryAction: onShopCombos,
      image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1600&q=85',
      imagePosition: 'object-[center_top] sm:object-center',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[currentSlide];

  return (
    <section className="relative overflow-hidden bg-glamora-charcoal">
      {/* Background Hero Image - Full height, model 100% clearly visible */}
      <div className="relative h-[560px] sm:h-[660px] lg:h-[720px] w-full flex flex-col justify-end transition-all duration-700 ease-out">
        <img
          src={slide.image}
          alt={slide.headline}
          className={`absolute inset-0 w-full h-full object-cover ${slide.imagePosition} filter brightness-[1.0] transition-transform duration-1000 scale-100`}
        />

        {/* Clean Scrim Gradient: Completely transparent on the top 60% of the screen so the model face & jewellery are 100% visible, smoothly darkening ONLY at the bottom 40% for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent via-50% to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-[48%] sm:h-[55%] bg-gradient-to-t from-glamora-charcoal via-glamora-charcoal/85 to-transparent pointer-events-none" />

        {/* Content Container - Compact and positioned strictly at the bottom */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-4 sm:pb-10">
          <div className="max-w-2xl text-white space-y-2 sm:space-y-3.5 animate-fade-in">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 bg-black/60 backdrop-blur-md border border-white/25 text-white text-[9px] sm:text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm">
              <Sparkles className="w-3 h-3 text-glamora-gold animate-spin" style={{ animationDuration: '6s' }} />
              <span>{slide.badge}</span>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-snug sm:leading-[1.2] text-glamora-cream text-shadow line-clamp-2 sm:line-clamp-none">
              {slide.headline}
            </h1>

            {/* Subtitle - Hidden on mobile screen so it doesn't push text up into the model's face */}
            <p className="hidden sm:block font-sans text-xs sm:text-sm text-white/90 font-light leading-relaxed max-w-xl">
              {slide.subline}
            </p>

            {/* CTAs */}
            <div className="pt-0.5 flex items-center gap-2 sm:gap-4">
              <button
                onClick={slide.action}
                className="flex-1 sm:flex-initial justify-center bg-glamora-rose hover:bg-glamora-rose-dark text-white font-sans font-semibold text-xs sm:text-sm tracking-wider uppercase px-4 sm:px-7 py-2.5 sm:py-3.5 rounded-full shadow-elevated transition duration-200 flex items-center gap-2 cursor-pointer group"
              >
                <span>{slide.ctaText}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={slide.secondaryAction}
                className="hidden sm:inline-flex bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/30 text-white font-sans font-medium text-xs sm:text-sm tracking-wider uppercase px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-full transition duration-200 cursor-pointer"
              >
                {slide.secondaryCta}
              </button>
            </div>

            {/* Value Props Row - Hidden on mobile to keep model visible, shown on sm+ */}
            <div className="hidden sm:flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] sm:text-xs text-glamora-blush/90 font-medium tracking-wide">
              <span>✓ Pure Breathable Fabrics</span>
              <span>✓ Modest & Elegant Fits</span>
              <span>✓ Verified Student Combos</span>
            </div>
          </div>
        </div>

        {/* Carousel Controls - Neatly placed at bottom right */}
        <div className="absolute bottom-4 sm:bottom-8 right-4 sm:right-8 flex items-center space-x-1.5 sm:space-x-2 z-20">
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center transition cursor-pointer border border-white/20"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          
          <div className="flex space-x-1">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentSlide === i ? 'w-5 sm:w-6 bg-glamora-rose' : 'w-1.5 sm:w-2 bg-white/40'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center transition cursor-pointer border border-white/20"
            aria-label="Next slide"
          >
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
