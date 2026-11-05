import React, { useState } from 'react';
import { Search, ShoppingBag, Heart, User, Menu, X, Shield, Sparkles, MapPin } from 'lucide-react';
import { Product } from '../types';

interface NavbarProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAdmin: () => void;
  onOpenTrackOrder: () => void;
  onSelectCategory: (cat: string) => void;
  activeCategory: string;
  allProducts: Product[];
  onSelectProduct: (p: Product) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenAdmin,
  onOpenTrackOrder,
  onSelectCategory,
  activeCategory,
  allProducts,
  onSelectProduct,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);

  const categories = [
    { id: 'all', label: 'All Creations' },
    { id: 'combos', label: '✨ GLAMORA Combos', highlight: true },
    { id: 'college', label: '🎓 College Edit' },
    { id: 'indian', label: 'Indian Wear' },
    { id: 'western', label: 'Western Edit' },
    { id: 'festive', label: 'Festive & Sarees' },
    { id: 'accessories', label: 'Accessories' },
    { id: 'footwear', label: 'Footwear' },
  ];

  const searchResults = searchQuery.trim() === '' ? [] : allProducts.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.subcategory.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 6);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-glamora-blush/60 transition-all duration-300">
      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-glamora-charcoal hover:text-glamora-rose transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Search Trigger (Mobile) */}
          <button
            onClick={() => setShowSearchModal(true)}
            className="p-2 text-glamora-charcoal hover:text-glamora-rose lg:hidden"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* GLAMORA Wordmark Logo */}
          <div className="flex-1 lg:flex-none text-center lg:text-left cursor-pointer" onClick={() => onSelectCategory('all')}>
            <div className="inline-block group">
              <span className="font-serif text-2xl sm:text-3xl font-extrabold tracking-[0.25em] text-glamora-charcoal uppercase transition-colors group-hover:text-glamora-rose">
                GLAMORA
              </span>
              <span className="block text-[9px] sm:text-[10px] tracking-[0.35em] text-glamora-rose-dark font-sans font-medium uppercase mt-0.5">
                Your Style. Your Story.
              </span>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-8 relative">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search kurtis, satin dresses, combos, jhumkas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSearchModal(true)}
                className="w-full bg-glamora-cream/80 border border-glamora-blush rounded-full py-2.5 pl-11 pr-4 text-xs font-sans placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-glamora-rose focus:bg-white transition"
              />
              <Search className="w-4 h-4 text-glamora-rose absolute left-4 top-3" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-3 text-xs text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick Live Search Popover */}
            {searchQuery.trim() !== '' && (
              <div className="absolute top-12 left-0 right-0 bg-white border border-glamora-blush rounded-2xl shadow-luxury overflow-hidden z-50 p-2 animate-fade-in">
                <div className="text-[11px] font-semibold text-gray-400 px-3 py-1.5 uppercase tracking-wider">
                  Products ({searchResults.length})
                </div>
                {searchResults.length === 0 ? (
                  <div className="p-4 text-center text-xs text-gray-500">
                    No results found for "{searchQuery}". Try "kurti", "combo", or "dress".
                  </div>
                ) : (
                  searchResults.map(p => (
                    <div
                      key={p.id}
                      onClick={() => {
                        onSelectProduct(p);
                        setSearchQuery('');
                      }}
                      className="flex items-center gap-3 p-2 hover:bg-glamora-cream rounded-xl cursor-pointer transition"
                    >
                      <img src={p.images[0]} alt={p.name} className="w-10 h-10 object-cover rounded-lg" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-glamora-charcoal truncate">{p.name}</div>
                        <div className="text-[11px] text-glamora-rose font-bold">₹{p.price.toLocaleString('en-IN')}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Action Icons */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            {/* Track Order */}
            <button
              onClick={onOpenTrackOrder}
              className="hidden md:flex items-center gap-1.5 text-xs text-glamora-charcoal/80 hover:text-glamora-rose font-medium transition cursor-pointer"
              title="Track Your Order"
            >
              <MapPin className="w-4 h-4 text-glamora-rose" />
              <span className="hidden xl:inline">Track Order</span>
            </button>

            {/* Admin Dashboard */}
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-glamora-charcoal bg-glamora-cream border border-glamora-blush rounded-full px-2.5 py-1.5 transition"
              title="Admin Portal"
            >
              <Shield className="w-3.5 h-3.5 text-glamora-rose" />
              <span className="text-[11px] font-semibold">Admin</span>
            </button>

            {/* Wishlist */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2 text-glamora-charcoal hover:text-glamora-rose transition"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-glamora-rose text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Drawer */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 bg-glamora-charcoal hover:bg-glamora-rose-dark text-white rounded-full py-2 px-3.5 sm:px-4 transition shadow-soft cursor-pointer"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 text-glamora-blush" />
              <span className="text-xs font-semibold">Cart</span>
              {cartCount > 0 && (
                <span className="bg-glamora-rose text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full min-w-4 text-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Category Navigation Bar (Desktop) */}
        <nav className="hidden lg:flex items-center justify-center space-x-1 xl:space-x-4 py-2 border-t border-glamora-blush/30 overflow-x-auto text-[13px] font-medium tracking-wide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-glamora-charcoal text-white font-semibold shadow-soft'
                  : cat.highlight
                  ? 'text-glamora-rose-dark font-bold hover:bg-glamora-blush/50'
                  : 'text-glamora-charcoal/80 hover:text-glamora-rose hover:bg-glamora-cream'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-glamora-blush bg-white px-4 pt-4 pb-6 space-y-3 animate-slide-up shadow-luxury">
          <div className="text-xs uppercase font-bold text-gray-400 tracking-wider mb-2">Collections</div>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left text-xs px-3 py-2 rounded-xl transition ${
                  activeCategory === cat.id
                    ? 'bg-glamora-charcoal text-white font-bold'
                    : 'bg-glamora-cream text-glamora-charcoal hover:bg-glamora-blush/50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-glamora-blush/40 flex items-center justify-between text-xs">
            <button
              onClick={() => {
                onOpenTrackOrder();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-1.5 text-glamora-charcoal hover:text-glamora-rose font-medium"
            >
              <MapPin className="w-4 h-4 text-glamora-rose" /> Track My Order
            </button>
            <button
              onClick={() => {
                onOpenAdmin();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-1.5 text-gray-600 font-semibold"
            >
              <Shield className="w-4 h-4 text-glamora-rose" /> Admin Panel
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

