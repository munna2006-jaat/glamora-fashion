import React, { useState } from 'react';
import { Search, ShoppingBag, Heart, User as UserIcon, Menu, X, Shield, Sparkles, MapPin, Package, LogOut } from 'lucide-react';
import { Product, User } from '../types';

interface NavbarProps {
  cartCount: number;
  wishlistCount: number;
  currentUser: User | null;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onNavigate: (view: 'home' | 'orders' | 'payment' | 'track' | 'login') => void;
  onSelectCategory: (cat: string) => void;
  activeCategory: string;
  allProducts: Product[];
  onSelectProduct: (p: Product) => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  wishlistCount,
  currentUser,
  onOpenCart,
  onOpenWishlist,
  onNavigate,
  onSelectCategory,
  activeCategory,
  allProducts,
  onSelectProduct,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);

  const categories = [
    { id: 'combos', label: '🔥 Hot Combos (₹499+)', highlight: true },
    { id: 'kurti_jeans', label: '👖 Kurti + Jeans (₹699)', highlight: true },
    { id: 'indian', label: '🌸 Jaipuri & Rajasthani Kurtis' },
    { id: 'accessories', label: '✨ Minakari Jhumkas' },
    { id: 'all', label: 'All Catalog' },
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
              className="p-2 text-glamora-charcoal hover:text-glamora-rose transition cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Search Trigger (Mobile) */}
          <button
            onClick={() => setShowSearchModal(!showSearchModal)}
            className="p-2 text-glamora-charcoal hover:text-glamora-rose lg:hidden cursor-pointer"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* GLAMORA Wordmark Logo */}
          <div
            className="flex-1 lg:flex-none text-center lg:text-left cursor-pointer"
            onClick={() => onNavigate('home')}
          >
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
                    No results found for "{searchQuery}". Try "kurti", "combo", or "baggy".
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
          <div className="flex items-center space-x-2.5 sm:space-x-4">
            
            {/* My Orders Button */}
            <button
              onClick={() => onNavigate('orders')}
              className="hidden md:flex items-center gap-1.5 text-xs text-glamora-charcoal hover:text-glamora-rose font-semibold transition cursor-pointer px-2.5 py-1.5 rounded-full hover:bg-glamora-cream"
              title="My Orders"
            >
              <Package className="w-4 h-4 text-glamora-rose" />
              <span className="hidden xl:inline">My Orders</span>
            </button>

            {/* Track Order Button */}
            <button
              onClick={() => onNavigate('track')}
              className="hidden md:flex items-center gap-1.5 text-xs text-glamora-charcoal hover:text-glamora-rose font-semibold transition cursor-pointer px-2.5 py-1.5 rounded-full hover:bg-glamora-cream"
              title="Track Your Order"
            >
              <MapPin className="w-4 h-4 text-glamora-rose" />
              <span className="hidden xl:inline">Track Order</span>
            </button>

            {/* Customer Login / Profile */}
            <button
              onClick={() => onNavigate('login')}
              className="flex items-center gap-1.5 text-xs text-glamora-charcoal hover:text-glamora-rose font-semibold transition cursor-pointer p-2 rounded-full hover:bg-glamora-cream"
              title={currentUser ? `Profile (${currentUser.name})` : 'Sign In'}
            >
              <div className="w-7 h-7 rounded-full bg-glamora-blush/60 flex items-center justify-center text-glamora-rose-dark font-bold">
                {currentUser ? currentUser.name.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
              </div>
              <span className="hidden xl:inline truncate max-w-20">
                {currentUser ? currentUser.name.split(' ')[0] : 'Sign In'}
              </span>
            </button>

            {/* Wishlist */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2 text-glamora-charcoal hover:text-glamora-rose transition cursor-pointer"
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

        {/* Mobile Search Input Drawer (When toggled on mobile) */}
        {showSearchModal && (
          <div className="lg:hidden pb-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search kurtis, satin dresses, combos, jhumkas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-glamora-cream/80 border border-glamora-blush rounded-full py-2 pl-10 pr-4 text-xs font-sans placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-glamora-rose focus:bg-white"
              />
              <Search className="w-4 h-4 text-glamora-rose absolute left-3.5 top-2.5" />
            </div>
            {searchQuery.trim() !== '' && (
              <div className="mt-2 bg-white border border-glamora-blush rounded-2xl shadow-luxury overflow-hidden p-2">
                {searchResults.map(p => (
                  <div
                    key={p.id}
                    onClick={() => {
                      onSelectProduct(p);
                      setSearchQuery('');
                      setShowSearchModal(false);
                    }}
                    className="flex items-center gap-3 p-2 hover:bg-glamora-cream rounded-xl cursor-pointer"
                  >
                    <img src={p.images[0]} alt={p.name} className="w-9 h-9 object-cover rounded-lg" />
                    <div className="flex-1 min-w-0 text-xs">
                      <div className="font-medium text-glamora-charcoal truncate">{p.name}</div>
                      <div className="text-glamora-rose font-bold">₹{p.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Category Navigation Bar (Desktop) */}
        <nav className="hidden lg:flex items-center justify-center space-x-1 xl:space-x-4 py-2 border-t border-glamora-blush/30 overflow-x-auto text-[13px] font-medium tracking-wide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                onNavigate('home');
                onSelectCategory(cat.id);
              }}
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
        <div className="lg:hidden border-t border-glamora-blush bg-white px-4 pt-4 pb-6 space-y-4 animate-slide-up shadow-luxury">
          
          {/* User Status / Login */}
          <div className="bg-glamora-cream p-3 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-glamora-rose text-white font-bold flex items-center justify-center text-xs">
                {currentUser ? currentUser.name.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
              </div>
              <div>
                <span className="font-bold text-xs text-glamora-charcoal block">
                  {currentUser ? currentUser.name : 'Welcome, Guest!'}
                </span>
                <span className="text-[10px] text-gray-500">
                  {currentUser ? (currentUser.email || currentUser.phone) : 'Sign in to track orders'}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onNavigate('login');
                setMobileMenuOpen(false);
              }}
              className="text-xs font-bold text-glamora-rose hover:underline"
            >
              {currentUser ? 'Profile' : 'Sign In'}
            </button>
          </div>

          <div className="text-xs uppercase font-bold text-gray-400 tracking-wider">Collections</div>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  onNavigate('home');
                  onSelectCategory(cat.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left text-xs px-3 py-2 rounded-xl transition cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-glamora-charcoal text-white font-bold'
                    : 'bg-glamora-cream text-glamora-charcoal hover:bg-glamora-blush/50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-glamora-blush/40 space-y-2 text-xs">
            <button
              onClick={() => {
                onNavigate('orders');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 text-glamora-charcoal hover:text-glamora-rose font-medium py-1.5"
            >
              <Package className="w-4 h-4 text-glamora-rose" /> My Orders & History
            </button>

            <button
              onClick={() => {
                onNavigate('track');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 text-glamora-charcoal hover:text-glamora-rose font-medium py-1.5"
            >
              <MapPin className="w-4 h-4 text-glamora-rose" /> Track Live Package
            </button>

            {currentUser && (
              <button
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 text-red-600 font-medium py-1.5"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
