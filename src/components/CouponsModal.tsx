import React, { useState } from 'react';
import { Coupon } from '../types';
import { X, Tag, Sparkles, Check, Copy } from 'lucide-react';

interface CouponsModalProps {
  isOpen: boolean;
  onClose: () => void;
  coupons: Coupon[];
  onApplyCoupon?: (code: string) => void;
}

export const CouponsModal: React.FC<CouponsModalProps> = ({
  isOpen,
  onClose,
  coupons,
  onApplyCoupon,
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    if (onApplyCoupon) onApplyCoupon(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-luxury border border-glamora-blush flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-glamora-blush/60 flex items-center justify-between bg-glamora-cream/40">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-glamora-gold" />
            <h2 className="font-serif text-lg font-bold text-glamora-charcoal">
              Exclusive GLAMORA Offers
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-glamora-charcoal rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="p-6 space-y-3">
          {coupons.map((c) => (
            <div key={c.code} className="p-4 rounded-2xl bg-glamora-cream/60 border border-glamora-blush/60 relative">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-bold text-glamora-charcoal bg-white px-2.5 py-1 rounded-lg border border-glamora-blush/60">
                  {c.code}
                </span>
                <button
                  onClick={() => copyCode(c.code)}
                  className="bg-glamora-charcoal hover:bg-glamora-rose text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 transition cursor-pointer"
                >
                  {copiedCode === c.code ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-glamora-charcoal/80 font-medium mt-2">{c.description}</p>
              <div className="text-[10px] text-gray-400 mt-1">
                Valid on all orders above ₹{c.minOrder}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
