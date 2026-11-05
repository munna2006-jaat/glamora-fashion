import React from 'react';
import { Instagram, Sparkles, Heart } from 'lucide-react';

interface InstagramFeedProps {
  onShopLook: () => void;
}

export const InstagramFeed: React.FC<InstagramFeedProps> = ({ onShopLook }) => {
  const posts = [
    {
      img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=500&q=80',
      handle: '@ananya_delhi',
      likes: '1.2k',
      caption: 'Diwali mela fit sorted with @glamora.in Desi Darling combo ✨'
    },
    {
      img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=500&q=80',
      handle: '@tanya_fits',
      likes: '980',
      caption: 'Monday 8am lectures made tolerable with good fits ☕'
    },
    {
      img: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=500&q=80',
      handle: '@rhea_roaming',
      likes: '2.4k',
      caption: 'Birthday dinner in Glamora satin cowl midi 💕'
    },
    {
      img: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=500&q=80',
      handle: '@ishita_festive',
      likes: '1.8k',
      caption: 'Pure Chanderi dream! Sangeet night ready 🪷'
    },
    {
      img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=500&q=80',
      handle: '@sneha_minimal',
      likes: '850',
      caption: 'The croissant bag fits my whole life inside it honestly'
    },
    {
      img: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=500&q=80',
      handle: '@priya_v',
      likes: '3.1k',
      caption: 'Bestie gift box unboxing! The packaging is unreal 🎁'
    }
  ];

  return (
    <section className="py-16 sm:py-20 bg-glamora-cream/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-glamora-rose mb-1">
            <Instagram className="w-4 h-4" />
            <span>#GlamoraGirls On Instagram</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-glamora-charcoal">
            Tag @glamora.in To Get Featured
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Share your unboxings, college day fits, and festive moments with our community.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {posts.map((post, idx) => (
            <div
              key={idx}
              onClick={onShopLook}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-glamora-blush/20 cursor-pointer shadow-soft"
            >
              <img
                src={post.img}
                alt={post.handle}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-glamora-charcoal/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3 text-white text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-glamora-blush">{post.handle}</span>
                  <span className="flex items-center gap-1 text-[10px]">
                    <Heart className="w-3 h-3 fill-current text-glamora-rose" /> {post.likes}
                  </span>
                </div>
                <p className="line-clamp-2 text-[10px] text-gray-200">{post.caption}</p>
                <div className="bg-white/20 backdrop-blur-md rounded-lg py-1 text-center font-bold uppercase tracking-wider text-[9px] hover:bg-white hover:text-glamora-charcoal transition">
                  Shop Look
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
