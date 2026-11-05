import React from 'react';
import { Review } from '../types';
import { Star, ShieldCheck, Quote, Heart } from 'lucide-react';

interface ReviewsWallProps {
  reviews: Review[];
}

export const ReviewsWall: React.FC<ReviewsWallProps> = ({ reviews }) => {
  return (
    <section className="py-16 sm:py-24 bg-white border-b border-glamora-blush/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-glamora-rose mb-2">
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>Community Love</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-glamora-charcoal">
            Loved By 25,000+ Girls Across India
          </h2>
          <p className="mt-2 text-sm text-gray-500 font-sans font-light">
            Real stories, unboxings, and college fest memories from our wonderful Glamora community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-glamora-cream/40 rounded-3xl p-6 border border-glamora-blush/60 flex flex-col justify-between shadow-soft hover:shadow-elevated transition duration-300"
            >
              <div>
                {/* Rating */}
                <div className="flex items-center gap-1 text-amber-500 mb-3">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-xs sm:text-sm text-glamora-charcoal/80 font-sans leading-relaxed italic mb-4">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-glamora-blush/40">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif font-bold text-xs sm:text-sm text-glamora-charcoal">
                      {rev.userName}
                    </h4>
                    <p className="text-[11px] text-gray-400">{rev.city}</p>
                  </div>
                  <span className="flex items-center gap-1 text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verified</span>
                  </span>
                </div>
                <div className="text-[10px] text-glamora-rose font-medium mt-1 truncate">
                  Ordered: {rev.productName}
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
