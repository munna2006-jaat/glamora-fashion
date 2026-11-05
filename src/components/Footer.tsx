import React, { useState } from 'react';
import { Sparkles, Heart, ShieldCheck, Truck, RotateCcw, Mail, ArrowRight, Instagram, Phone } from 'lucide-react';

interface FooterProps {
  onSelectCategory: (cat: string) => void;
  onOpenTrackOrder: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenTrackOrder,
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
  };

  return (
    <footer className="bg-glamora-charcoal text-glamora-cream">
      
      {/* Brand Value Props Banner */}
      <div className="border-b border-white/10 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
            <Truck className="w-6 h-6 text-glamora-rose mx-auto mb-2" />
            <h4 className="font-serif font-bold text-sm text-white">Free Express Delivery</h4>
            <p className="text-[11px] text-gray-400 mt-1">On all orders above ₹999 across India</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
            <Sparkles className="w-6 h-6 text-glamora-gold mx-auto mb-2" />
            <h4 className="font-serif font-bold text-sm text-white">Curated Head-To-Toe Looks</h4>
            <p className="text-[11px] text-gray-400 mt-1">Exclusive combos saving you up to ₹1,598</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
            <RotateCcw className="w-6 h-6 text-glamora-rose mx-auto mb-2" />
            <h4 className="font-serif font-bold text-sm text-white">7-Day Easy Exchange</h4>
            <p className="text-[11px] text-gray-400 mt-1">Doorstep pickup & hassle-free size swaps</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
            <ShieldCheck className="w-6 h-6 text-glamora-rose mx-auto mb-2" />
            <h4 className="font-serif font-bold text-sm text-white">100% Verified Artisans</h4>
            <p className="text-[11px] text-gray-400 mt-1">Mulmul cotton, pure Chanderi & real Zari</p>
          </div>
        </div>
      </div>

      {/* Main Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <span className="font-serif text-3xl font-extrabold tracking-[0.25em] text-white uppercase">
                GLAMORA
              </span>
              <span className="block text-[10px] tracking-[0.35em] text-glamora-rose font-sans font-medium uppercase mt-1">
                Your Style. Your Story.
              </span>
            </div>

            <p className="text-xs text-gray-300 font-sans leading-relaxed max-w-sm">
              India’s first dedicated affordable luxury fashion label designed specifically for young women aged 15–25. We believe great styling shouldn’t cost a fortune or require endless matching hassle.
            </p>

            <div className="pt-2 flex items-center space-x-3 text-xs text-glamora-blush">
              <span className="flex items-center gap-1.5"><Heart className="w-3.5 h-3.5 fill-current text-glamora-rose" /> Handcrafted with pride in India</span>
            </div>
          </div>

          {/* Quick Collections */}
          <div>
            <h5 className="font-serif font-bold text-sm text-white uppercase tracking-wider mb-4">
              Collections
            </h5>
            <ul className="space-y-2.5 text-xs text-gray-300">
              <li><button onClick={() => onSelectCategory('combos')} className="hover:text-glamora-rose transition text-glamora-rose-dark font-semibold">✨ Curated Combos</button></li>
              <li><button onClick={() => onSelectCategory('indian')} className="hover:text-glamora-rose transition">Indian Wear & Kurtis</button></li>
              <li><button onClick={() => onSelectCategory('western')} className="hover:text-glamora-rose transition">Western Edit & Dresses</button></li>
              <li><button onClick={() => onSelectCategory('college')} className="hover:text-glamora-rose transition">College Edit (Under ₹1,499)</button></li>
              <li><button onClick={() => onSelectCategory('festive')} className="hover:text-glamora-rose transition">Festive Sarees & Silk Sets</button></li>
              <li><button onClick={() => onSelectCategory('accessories')} className="hover:text-glamora-rose transition">18K Jhumkas & Jewelry</button></li>
              <li><button onClick={() => onSelectCategory('footwear')} className="hover:text-glamora-rose transition">Cushion Juttis & Footwear</button></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h5 className="font-serif font-bold text-sm text-white uppercase tracking-wider mb-4">
              Help & Policies
            </h5>
            <ul className="space-y-2.5 text-xs text-gray-300">
              <li><button onClick={onOpenTrackOrder} className="hover:text-glamora-rose transition font-medium">Track Your Order</button></li>
              <li><span className="text-gray-400">Shipping & Delivery (Pan-India)</span></li>
              <li><span className="text-gray-400">7-Day Return & Exchange Policy</span></li>
              <li><span className="text-gray-400">Garment Size Chart & Fit Guide</span></li>
              <li><span className="text-gray-400">Pure Jaipur Cotton Handblock Authenticity</span></li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h5 className="font-serif font-bold text-sm text-white uppercase tracking-wider mb-4">
              Join Glamora Club
            </h5>
            <p className="text-xs text-gray-300 mb-3">
              Subscribe to get secret student drops and an instant 10% coupon code.
            </p>

            {subscribed ? (
              <div className="p-3 bg-white/10 rounded-xl border border-glamora-rose text-xs text-glamora-blush">
                🎉 Welcome to Glamora Club! Use code <span className="font-bold text-white">GLAMFIRST</span> at checkout.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your college email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-glamora-rose"
                />
                <button
                  type="submit"
                  className="w-full bg-glamora-rose hover:bg-glamora-rose-dark text-white text-xs font-semibold py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Get 10% Coupon</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}

            <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-gray-400 space-y-1">
              <div className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-glamora-rose" /> Support: +91 98765 43210 (10am–7pm)</div>
              <div className="flex items-center gap-1.5"><Mail className="w-3 h-3 text-glamora-rose" /> care@glamora.in</div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <div>
            © {new Date().getFullYear()} GLAMORA Fashion Private Limited. All Rights Reserved.
          </div>
          <div className="flex items-center space-x-6 text-[11px]">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Made with ❤️ in New Delhi & Jaipur</span>
          </div>
        </div>
      </div>

    </footer>
  );
};

