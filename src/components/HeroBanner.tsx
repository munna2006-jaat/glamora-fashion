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
      imagePosition: 'object-top sm:object-center',
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
      imagePosition: 'object-top sm:object-center',
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
      imagePosition: 'object-top sm:object-center',
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
      {/* Background Hero Image - Full height, model clearly visible */}
      <div className="relative h-[620px] sm:h-[660px] lg:h-[720px] w-full flex flex-col justify-end transition-all duration-700 ease-out">
        <img
          src={slide.image}
          alt={slide.headline}
          className={`absolute inset-0 w-full h-full object-cover ${slide.imagePosition} filter brightness-[0.98] transition-transform duration-1000 scale-100`}
        />

        {/* Clean Scrim Gradient: Completely transparent at top so the model is 100% visible, smoothly dark at bottom for text */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent via-45% to-glamora-charcoal/95" />
        <div className="absolute bottom-0 left-0 right-0 h-[65%] bg-gradient-to-t from-glamora-charcoal via-glamora-charcoal/80 to-transparent" />

        {/* Content Container - Positioned at the bottom third */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-8 sm:pb-12">
          <div className="max-w-2xl text-white space-y-2.5 sm:space-y-4 animate-fade-in">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/20 text-white text-[10px] sm:text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-glamora-gold animate-spin" style={{ animationDuration: '6s' }} />
              <span>{slide.badge}</span>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.2] text-glamora-cream text-shadow">
              {slide.headline}
            </h1>

            {/* Subtitle */}
            <p className="font-sans text-xs sm:text-sm text-white/90 font-light leading-relaxed max-w-xl line-clamp-2 sm:line-clamp-none">
              {slide.subline}
            </p>

            {/* CTAs */}
            <div className="pt-1 flex flex-wrap items-center gap-2.5 sm:gap-4">
              <button
                onClick={slide.action}
                className="bg-glamora-rose hover:bg-glamora-rose-dark text-white font-sans font-semibold text-xs sm:text-sm tracking-wider uppercase px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-full shadow-elevated transition duration-200 flex items-center gap-2 cursor-pointer group"
              >
                <span>{slide.ctaText}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={slide.secondaryAction}
                className="bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/30 text-white font-sans font-medium text-xs sm:text-sm tracking-wider uppercase px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-full transition duration-200 cursor-pointer"
              >
                {slide.secondaryCta}
              </button>
            </div>

            {/* Value Props Row */}
            <div className="pt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] sm:text-xs text-glamora-blush/90 font-medium tracking-wide">
              <span>✓ Pure Breathable Fabrics</span>
              <span>✓ Modest & Elegant Fits</span>
              <span>✓ Verified Student Combos</span>
            </div>
          </div>
        </div>

        {/* Carousel Controls - Neatly placed at bottom right */}
        <div className="absolute bottom-4 sm:bottom-8 right-4 sm:right-8 flex items-center space-x-2 z-20">
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
            className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md flex items-center justify-center transition cursor-pointer border border-white/20"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div className="flex space-x-1">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentSlide === i ? 'w-6 bg-glamora-rose' : 'w-2 bg-white/40'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
            className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md flex items-center justify-center transition cursor-pointer border border-white/20"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
