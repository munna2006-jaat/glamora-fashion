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
      accentColor: 'from-[#D98BA5]/80 via-[#292329]/60 to-black/80',
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
      accentColor: 'from-[#292329]/80 via-[#B86A85]/50 to-black/80',
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
      accentColor: 'from-[#4A3E4A]/80 via-[#D98BA5]/50 to-black/80',
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
      {/* Background Hero Image */}
      <div className="relative min-h-[580px] sm:min-h-[580px] lg:h-[640px] w-full flex items-center transition-all duration-700 ease-out py-10 sm:py-0">
        <img
          src={slide.image}
          alt={slide.headline}
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.80] transition-transform duration-1000 scale-105"
        />

        {/* Brand Editorial Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-r ${slide.accentColor} mix-blend-multiply opacity-85`} />
        <div className="absolute inset-0 bg-gradient-to-t from-glamora-charcoal/90 via-black/40 to-black/30" />

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl text-white space-y-3 sm:space-y-5 animate-fade-in pb-12 sm:pb-0">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] sm:text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-glamora-gold animate-spin" style={{ animationDuration: '6s' }} />
              <span>{slide.badge}</span>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.2] text-glamora-cream">
              {slide.headline}
            </h1>

            {/* Subtitle */}
            <p className="font-sans text-xs sm:text-base text-white/90 font-light leading-relaxed max-w-xl">
              {slide.subline}
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-2.5 sm:gap-4">
              <button
                onClick={slide.action}
                className="bg-glamora-rose hover:bg-glamora-rose-dark text-white font-sans font-semibold text-xs sm:text-sm tracking-wider uppercase px-5 sm:px-8 py-3 sm:py-3.5 rounded-full shadow-elevated transition duration-200 flex items-center gap-2 cursor-pointer group"
              >
                <span>{slide.ctaText}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={slide.secondaryAction}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/40 text-white font-sans font-medium text-xs sm:text-sm tracking-wider uppercase px-4 sm:px-7 py-3 sm:py-3.5 rounded-full transition duration-200 cursor-pointer"
              >
                {slide.secondaryCta}
              </button>
            </div>

            {/* Value Props Row */}
            <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10px] sm:text-xs text-glamora-blush font-medium tracking-wide">
              <span>✓ Pure Breathable Fabrics</span>
              <span>✓ Modest & Elegant Fits</span>
              <span>✓ Verified Student Combos</span>
            </div>
          </div>
        </div>

        {/* Carousel Controls */}
        <div className="absolute bottom-3 sm:bottom-6 right-4 sm:right-12 flex items-center space-x-2 sm:space-x-3 z-20">
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md flex items-center justify-center transition cursor-pointer"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          
          <div className="flex space-x-1 sm:space-x-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                  currentSlide === i ? 'w-6 sm:w-8 bg-glamora-rose' : 'w-2 bg-white/40'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md flex items-center justify-center transition cursor-pointer"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};
