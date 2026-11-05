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
      badge: 'NEW SEASON EDIT • SPRING/SUMMER 2026',
      headline: 'Effortless Luxury For The Modern Indian Woman',
      subline: 'Hand-block mulmul anarkalis, modern ethnic co-ords, and tissue silk sarees crafted for 15–25 dreamers.',
      ctaText: 'Explore Indian Wear',
      action: onShopIndian,
      secondaryCta: 'Shop GLAMORA Combos',
      secondaryAction: onShopCombos,
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=85',
      accentColor: 'from-[#D98BA5]/80 via-[#292329]/60 to-black/80',
    },
    {
      id: 2,
      badge: '✨ SIGNATURE CURATED COMBOS • SAVE UP TO ₹1,598',
      headline: 'One Outfit. Perfect Matching Accessories. Zero Guesswork.',
      subline: 'Meet our 8 cult-favorite combos: Kurti + Jhumkas + Bangles, complete college looks, and gift boxes.',
      ctaText: 'Shop All 8 Combos',
      action: onShopCombos,
      secondaryCta: 'College Girl Edit',
      secondaryAction: onShopCollege,
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=85',
      accentColor: 'from-[#4A3E4A]/80 via-[#D98BA5]/50 to-black/80',
    },
    {
      id: 3,
      badge: 'CAMPUS APPROVED • UNDER ₹1,499',
      headline: 'The College Girl Capsule You Have Been Waiting For',
      subline: 'Lightweight ribbed tops, wide-leg trousers, organza claws & cloud sneakers made for 8 AM lectures.',
      ctaText: 'Explore College Edit',
      action: onShopCollege,
      secondaryCta: 'Explore Combos',
      secondaryAction: onShopCombos,
      image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1600&q=85',
      accentColor: 'from-[#292329]/80 via-[#B86A85]/50 to-black/80',
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
      <div className="relative h-[540px] sm:h-[600px] lg:h-[660px] w-full transition-all duration-700 ease-out">
        <img
          src={slide.image}
          alt={slide.headline}
          className="w-full h-full object-cover object-center filter brightness-[0.85] transition-transform duration-1000 scale-105"
        />

        {/* Brand Editorial Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-r ${slide.accentColor} mix-blend-multiply opacity-90`} />
        <div className="absolute inset-0 bg-gradient-to-t from-glamora-charcoal via-transparent to-black/30" />

        {/* Content Container */}
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-2xl text-white space-y-4 sm:space-y-6 animate-fade-in">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 text-white text-[11px] sm:text-xs font-semibold uppercase tracking-widest px-3.5 py-1.5 rounded-full shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-glamora-gold animate-spin" style={{ animationDuration: '6s' }} />
                <span>{slide.badge}</span>
              </div>

              {/* Headline */}
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.15] text-glamora-cream">
                {slide.headline}
              </h1>

              {/* Subtitle */}
              <p className="font-sans text-sm sm:text-base lg:text-lg text-white/90 font-light leading-relaxed max-w-xl">
                {slide.subline}
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
                <button
                  onClick={slide.action}
                  className="bg-glamora-rose hover:bg-glamora-rose-dark text-white font-sans font-semibold text-xs sm:text-sm tracking-wider uppercase px-6 sm:px-8 py-3.5 rounded-full shadow-elevated transition duration-200 flex items-center gap-2 cursor-pointer group"
                >
                  <span>{slide.ctaText}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  onClick={slide.secondaryAction}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/40 text-white font-sans font-medium text-xs sm:text-sm tracking-wider uppercase px-5 sm:px-7 py-3.5 rounded-full transition duration-200 cursor-pointer"
                >
                  {slide.secondaryCta}
                </button>
              </div>

              {/* Value Props Row */}
              <div className="pt-4 flex items-center gap-6 text-[11px] sm:text-xs text-glamora-blush font-medium tracking-wide">
                <span>✓ Pure Breathable Fabrics</span>
                <span>✓ Modest & Elegant Fits</span>
                <span>✓ Verified Student Combos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Controls */}
        <div className="absolute bottom-6 right-6 sm:right-12 flex items-center space-x-3 z-10">
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md flex items-center justify-center transition"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex space-x-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide === i ? 'w-8 bg-glamora-rose' : 'w-2 bg-white/40'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md flex items-center justify-center transition"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};
