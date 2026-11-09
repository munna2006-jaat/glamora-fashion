import React, { useState, useEffect, useMemo } from 'react';
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product, Combo } from '../types';

interface HeroBannerProps {
  products?: Product[];
  combos?: Combo[];
  onSelectProduct?: (p: Product) => void;
  onSelectCombo?: (c: Combo) => void;
  onShopCombos: () => void;
  onShopIndian?: () => void;
  onShopCollege?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  products = [],
  combos = [],
  onSelectProduct,
  onSelectCombo,
  onShopCombos,
  onShopIndian,
  onShopCollege,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Generate slides dynamically from user's active products & combos
  const slides = useMemo(() => {
    const list: Array<{
      id: string;
      badge: string;
      headline: string;
      subline: string;
      ctaText: string;
      action: () => void;
      secondaryCta?: string;
      secondaryAction?: () => void;
      image: string;
      imagePosition?: string;
    }> = [];

    // 1. Featured Combos from user's store
    (combos || []).forEach((c) => {
      if (c.image) {
        list.push({
          id: c.id,
          badge: `🔥 EXCLUSIVE COMBO DEAL • ₹${c.comboPrice.toLocaleString('en-IN')}`,
          headline: c.title,
          subline: c.tagline || c.description || 'Exclusive curated outfit combo. Verified student pricing & premium fabrics.',
          ctaText: `Get Combo @ ₹${c.comboPrice}`,
          action: () => {
            if (onSelectCombo) onSelectCombo(c);
            else onShopCombos();
          },
          secondaryCta: 'Explore Catalog',
          secondaryAction: onShopCombos,
          image: c.image,
          imagePosition: 'object-center',
        });
      }
    });

    // 2. Featured Products from user's store
    (products || []).forEach((p) => {
      if (p.images && p.images[0]) {
        list.push({
          id: p.id,
          badge: `✨ VIRAL HIT • ₹${p.price.toLocaleString('en-IN')}`,
          headline: p.name,
          subline: p.description || p.fabric || 'Crafted with premium breathable fabrics for effortless everyday & campus styling.',
          ctaText: `Shop Now @ ₹${p.price}`,
          action: () => {
            if (onSelectProduct) onSelectProduct(p);
            else onShopCombos();
          },
          secondaryCta: 'View Details',
          secondaryAction: () => {
            if (onSelectProduct) onSelectProduct(p);
            else onShopCombos();
          },
          image: p.images[0],
          imagePosition: 'object-center',
        });
      }
    });

    // Fallback if completely empty
    if (list.length === 0) {
      list.push({
        id: 'hero-empty',
        badge: '🌸 GLAMORA LUXURY COLLECTION',
        headline: 'Affordable Luxury Fashion',
        subline: 'Curated outfits and styling designed for young women.',
        ctaText: 'Explore Collection',
        action: onShopCombos,
        image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><rect width="100%" height="100%" fill="%23292329"/><text x="50%" y="50%" fill="%23D98BA5" font-size="44" font-family="serif" text-anchor="middle">GLAMORA FASHION</text></svg>',
        imagePosition: 'object-center',
      });
    }

    return list.slice(0, 5);
  }, [combos, products, onSelectCombo, onSelectProduct, onShopCombos]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[currentSlide];

  return (
    <section className="relative overflow-hidden bg-glamora-charcoal w-full max-w-full">
      {/* Background Hero Image - Full height, model 100% clearly visible */}
      <div className="relative h-[560px] sm:h-[660px] lg:h-[720px] w-full flex flex-col justify-end transition-all duration-700 ease-out">
        <img
          src={slide.image}
          alt={slide.headline}
          className={`absolute inset-0 w-full h-full object-cover ${slide.imagePosition} filter brightness-[1.0] transition-transform duration-1000 scale-100`}
        />

        {/* Clean Scrim Gradient: Completely transparent on top so model face is visible, darkening smoothly towards bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent via-50% to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-[52%] sm:h-[55%] bg-gradient-to-t from-glamora-charcoal via-glamora-charcoal/85 to-transparent pointer-events-none" />

        {/* Content Container - Compact and positioned strictly at the bottom */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-4 sm:pb-8">
          <div className="max-w-2xl text-white space-y-2 sm:space-y-3.5 animate-fade-in">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 bg-black/60 backdrop-blur-md border border-white/25 text-white text-[9px] sm:text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm max-w-full">
              <Sparkles className="w-3 h-3 text-glamora-gold animate-spin flex-shrink-0" style={{ animationDuration: '6s' }} />
              <span className="truncate">{slide.badge}</span>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-snug sm:leading-[1.2] text-glamora-cream text-shadow line-clamp-2 sm:line-clamp-none break-words">
              {slide.headline}
            </h1>

            {/* Subtitle - Hidden on mobile screen so it doesn't push text up into the model's face */}
            <p className="hidden sm:block font-sans text-xs sm:text-sm text-white/90 font-light leading-relaxed max-w-xl">
              {slide.subline}
            </p>

            {/* CTAs & Controls Container */}
            <div className="pt-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
                <button
                  onClick={slide.action}
                  className="flex-1 sm:flex-initial justify-center bg-glamora-rose hover:bg-glamora-rose-dark text-white font-sans font-semibold text-xs sm:text-sm tracking-wider uppercase px-4 sm:px-7 py-2.5 sm:py-3.5 rounded-full shadow-elevated transition duration-200 flex items-center gap-2 cursor-pointer group whitespace-nowrap"
                >
                  <span className="truncate">{slide.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 flex-shrink-0" />
                </button>

                <button
                  onClick={slide.secondaryAction}
                  className="hidden sm:inline-flex bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/30 text-white font-sans font-medium text-xs sm:text-sm tracking-wider uppercase px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-full transition duration-200 cursor-pointer"
                >
                  {slide.secondaryCta}
                </button>
              </div>

              {/* Mobile Carousel Indicators & Buttons Row (Separated from CTA to avoid any collision) */}
              <div className="flex items-center justify-between sm:hidden pt-0.5">
                <div className="flex space-x-1.5">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentSlide(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        currentSlide === i ? 'w-5 bg-glamora-rose' : 'w-2 bg-white/40'
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>

                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                    className="w-7 h-7 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center transition cursor-pointer border border-white/20"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                    className="w-7 h-7 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center transition cursor-pointer border border-white/20"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Value Props Row - Hidden on mobile to keep model visible, shown on sm+ */}
            <div className="hidden sm:flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] sm:text-xs text-glamora-blush/90 font-medium tracking-wide">
              <span>✓ Pure Breathable Fabrics</span>
              <span>✓ Modest & Elegant Fits</span>
              <span>✓ Verified Student Combos</span>
            </div>
          </div>
        </div>

        {/* Desktop Carousel Controls - Neatly placed at bottom right on sm+ */}
        <div className="hidden sm:flex absolute bottom-8 right-8 items-center space-x-2 z-20">
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
            className="w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center transition cursor-pointer border border-white/20"
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
            className="w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center transition cursor-pointer border border-white/20"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
