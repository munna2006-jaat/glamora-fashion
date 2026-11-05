import React, { useState, useEffect } from 'react';
import { Product, Combo, CartItem, Order, Coupon, Review, AppSettings, User } from './types';
import { MOCK_PRODUCTS, MOCK_COMBOS, MOCK_COUPONS, MOCK_REVIEWS, DEFAULT_SETTINGS } from './data/mockData';

// Components
import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { StoryHighlights } from './components/StoryHighlights';
import { CombosSection } from './components/CombosSection';
import { ComboDetailModal } from './components/ComboDetailModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CollegeGirlEdit } from './components/CollegeGirlEdit';
import { IndianWearSection } from './components/IndianWearSection';
import { AccessoriesSection } from './components/AccessoriesSection';
import { ReviewsWall } from './components/ReviewsWall';
import { InstagramFeed } from './components/InstagramFeed';
import { CartDrawer } from './components/CartDrawer';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { AdminDashboard } from './components/AdminDashboard';
import { WishlistModal } from './components/WishlistModal';
import { CouponsModal } from './components/CouponsModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';

// Dedicated Separate Pages
import { OrdersPage } from './components/OrdersPage';
import { PaymentPage } from './components/PaymentPage';
import { OrderTrackPage } from './components/OrderTrackPage';
import { AuthPage } from './components/AuthPage';

type View = 'home' | 'orders' | 'payment' | 'track' | 'login' | 'admin';

const getViewFromUrl = (): View => {
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  if (path === '/admin' || hash === '#admin') return 'admin';
  if (path === '/orders' || hash === '#orders') return 'orders';
  if (path === '/payment' || hash === '#payment' || path === '/checkout' || hash === '#checkout') return 'payment';
  if (path === '/track' || hash === '#track') return 'track';
  if (path === '/login' || hash === '#login' || path === '/profile' || hash === '#profile') return 'login';
  return 'home';
};

export const App: React.FC = () => {
  // Page Navigation View State
  const [currentView, setCurrentView] = useState<View>(getViewFromUrl);

  // Data State
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [combos, setCombos] = useState<Combo[]>(MOCK_COMBOS);
  const [coupons, setCoupons] = useState<Coupon[]>(MOCK_COUPONS);
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Customer Session
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('glamora_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Cart & Wishlist State
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('glamora_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('glamora_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modal Visibility State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCombo, setSelectedCombo] = useState<Combo | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCouponsOpen, setIsCouponsOpen] = useState(false);
  const [activeTrackingId, setActiveTrackingId] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [appliedCheckoutCoupon, setAppliedCheckoutCoupon] = useState<Coupon | null>(null);
  const [isGiftWrapSelected, setIsGiftWrapSelected] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('glamora_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('glamora_wishlist', JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  // Initial Fetch from API
  const refreshData = async () => {
    try {
      const [resProd, resCombo, resCoup, resRev, resSet] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/combos'),
        fetch('/api/coupons'),
        fetch('/api/reviews'),
        fetch('/api/settings')
      ]);
      if (resProd.ok) setProducts(await resProd.json());
      if (resCombo.ok) setCombos(await resCombo.json());
      if (resCoup.ok) setCoupons(await resCoup.json());
      if (resRev.ok) setReviews(await resRev.json());
      if (resSet.ok) setSettings(await resSet.json());
    } catch (e) {
      console.log('Using local dataset as fallback:', e);
    }
  };

  useEffect(() => {
    refreshData();

    const handlePopState = () => {
      setCurrentView(getViewFromUrl());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (view: View, trackingId?: string) => {
    setCurrentView(view);
    if (trackingId) setActiveTrackingId(trackingId);
    const targetPath = view === 'home' ? '/' : `/${view}`;
    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Cart Operations
  const handleAddToCart = (item: CartItem) => {
    setCartItems(prev => {
      const existingIdx = prev.findIndex(i => 
        i.name === item.name && 
        i.size === item.size && 
        JSON.stringify(i.selectedComboSizes) === JSON.stringify(item.selectedComboSizes)
      );
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx].quantity += item.quantity;
        return updated;
      }
      return [item, ...prev];
    });
    showToast(`Added ${item.name} to your bag ✨`);
    setIsCartOpen(true);
  };

  const handleQuickAddProduct = (product: Product) => {
    const item: CartItem = {
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0],
      size: product.sizes[0] || 'Free Size',
      quantity: 1,
      isCombo: false,
    };
    handleAddToCart(item);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(prev => prev.filter(i => i.id !== id));
  };

  // Wishlist Operations
  const handleToggleWishlist = (product: Product) => {
    setWishlistIds(prev => {
      const exists = prev.includes(product.id);
      if (exists) {
        showToast(`Removed from wishlist`);
        return prev.filter(id => id !== product.id);
      } else {
        showToast(`Saved to wishlist ❤️`);
        return [...prev, product.id];
      }
    });
  };

  // Checkout Triggers
  const handleProceedToCheckout = (coupon: Coupon | null, giftWrap: boolean) => {
    setAppliedCheckoutCoupon(coupon);
    setIsGiftWrapSelected(giftWrap);
    setIsCartOpen(false);
    navigateTo('payment');
  };

  // Category Filtering & Smooth Navigation
  const handleSelectCategory = (cat: string) => {
    setActiveCategory(cat);
    if (currentView !== 'home') {
      navigateTo('home');
      setTimeout(() => {
        scrollToCat(cat);
      }, 100);
    } else {
      scrollToCat(cat);
    }
  };

  const scrollToCat = (cat: string) => {
    if (cat === 'combos' || cat === 'kurti_jeans') {
      const el = document.getElementById('combos-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (cat === 'indian') {
      const el = document.getElementById('indian-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (cat === 'accessories') {
      const el = document.getElementById('accessories-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F6] text-glamora-charcoal font-sans flex flex-col pb-28 lg:pb-0 selection:bg-glamora-blush selection:text-glamora-charcoal">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 lg:bottom-6 right-6 z-50 bg-glamora-charcoal text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-elevated border border-glamora-rose animate-slide-up flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Announcement Bar */}
      <AnnouncementBar onOpenCoupons={() => setIsCouponsOpen(true)} />

      {/* Main Luxury Navigation Bar */}
      <Navbar
        cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        wishlistCount={wishlistIds.length}
        currentUser={currentUser}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onNavigate={navigateTo}
        onSelectCategory={handleSelectCategory}
        activeCategory={activeCategory}
        allProducts={products}
        onSelectProduct={(p) => setSelectedProduct(p)}
        onLogout={() => {
          setCurrentUser(null);
          localStorage.removeItem('glamora_user');
          showToast('Logged out successfully');
        }}
      />

      {/* ================= PAGE ROUTING VIEW ================= */}
      <div className="flex-1">
        
        {/* VIEW 1: DEDICATED ORDERS PAGE */}
        {currentView === 'orders' && (
          <OrdersPage
            onBackToHome={() => navigateTo('home')}
            onTrackOrder={(trackingId) => navigateTo('track', trackingId)}
            onShopNow={() => navigateTo('home')}
          />
        )}

        {/* VIEW 2: DEDICATED PAYMENT & CHECKOUT PAGE */}
        {currentView === 'payment' && (
          <PaymentPage
            cartItems={cartItems}
            appliedCoupon={appliedCheckoutCoupon}
            giftWrap={isGiftWrapSelected}
            settings={settings}
            currentUser={currentUser}
            onBackToCart={() => {
              navigateTo('home');
              setIsCartOpen(true);
            }}
            onOrderSuccess={(order) => {
              setCartItems([]);
              setConfirmedOrder(order);
              navigateTo('orders');
              refreshData();
            }}
            onBackToHome={() => navigateTo('home')}
          />
        )}

        {/* VIEW 3: DEDICATED ORDER TRACKING PAGE */}
        {currentView === 'track' && (
          <OrderTrackPage
            initialTrackingId={activeTrackingId}
            onBackToHome={() => navigateTo('home')}
            onViewAllOrders={() => navigateTo('orders')}
          />
        )}

        {/* VIEW 4: DEDICATED LOGIN / REGISTER / PROFILE PAGE */}
        {currentView === 'login' && (
          <AuthPage
            currentUser={currentUser}
            onLoginSuccess={(u) => {
              setCurrentUser(u);
              navigateTo('home');
              showToast(`Welcome back, ${u.name}! 🌸`);
            }}
            onLogout={() => {
              setCurrentUser(null);
              localStorage.removeItem('glamora_user');
              showToast('Signed out successfully');
            }}
            onBackToHome={() => navigateTo('home')}
            onViewOrders={() => navigateTo('orders')}
            onViewTrack={() => navigateTo('track')}
            onViewWishlist={() => {
              navigateTo('home');
              setIsWishlistOpen(true);
            }}
          />
        )}

        {/* VIEW 5: HOMEPAGE (EDITORIAL LUXURY COMMERCE) */}
        {currentView === 'home' && (
          <main>
            {/* Full-screen Editorial Hero Banner (No overlap on mobile) */}
            <HeroBanner
              onShopCombos={() => handleSelectCategory('combos')}
              onShopIndian={() => handleSelectCategory('indian')}
              onShopCollege={() => handleSelectCategory('kurti_jeans')}
            />

            {/* Story Highlights Bar */}
            <StoryHighlights onSelectCategory={handleSelectCategory} />

            {/* 1. CURATED COMBOS SECTION (SHOWN FIRST ON HOMEPAGE AS REQUESTED) */}
            <CombosSection
              combos={combos}
              onOpenComboModal={(c) => setSelectedCombo(c)}
              onAddToCart={handleAddToCart}
              onQuickBuy={(c) => {
                const item: CartItem = {
                  id: `${c.id}-${Date.now()}`,
                  comboId: c.id,
                  name: c.title,
                  price: c.comboPrice,
                  originalPrice: c.originalTotal,
                  image: c.image,
                  quantity: 1,
                  isCombo: true,
                  comboItems: c.items,
                };
                handleAddToCart(item);
                setIsCartOpen(false);
                navigateTo('payment');
              }}
            />

            {/* 2. RAJASTHANI & JAIPUR ETHNIC KURTI COLLECTION (@ ₹499) */}
            <IndianWearSection
              products={products}
              wishlistIds={wishlistIds}
              onToggleWishlist={handleToggleWishlist}
              onSelectProduct={(p) => setSelectedProduct(p)}
              onQuickAdd={handleQuickAddProduct}
            />

            {/* 3. COLLEGE GIRL SPECIAL (KURTI + BAGGY JEANS & CAMPUS FITS) */}
            <CollegeGirlEdit
              products={products}
              wishlistIds={wishlistIds}
              onToggleWishlist={handleToggleWishlist}
              onSelectProduct={(p) => setSelectedProduct(p)}
              onQuickAdd={handleQuickAddProduct}
              onViewAllCollege={() => handleSelectCategory('combos')}
            />

            {/* 4. RAJASTHANI 18K MINAKARI & OXIDISED JHUMKAS SECTION */}
            <AccessoriesSection
              products={products}
              wishlistIds={wishlistIds}
              onToggleWishlist={handleToggleWishlist}
              onSelectProduct={(p) => setSelectedProduct(p)}
              onQuickAdd={handleQuickAddProduct}
            />

            {/* 5. CUSTOMER REVIEWS WALL */}
            <ReviewsWall reviews={reviews} />

            {/* 6. INSTAGRAM LOOKBOOK FEED */}
            <InstagramFeed onShopLook={() => handleSelectCategory('combos')} />

            {/* Customer-Facing Footer */}
            <Footer
              onSelectCategory={handleSelectCategory}
              onOpenTrackOrder={() => navigateTo('track')}
            />
          </main>
        )}

      </div>

      {/* Mobile-First Bottom Floating App Dock Bar */}
      <MobileBottomNav
        cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        currentView={currentView}
        activeCategory={activeCategory}
        onNavigate={navigateTo}
        onSelectCategory={handleSelectCategory}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* ================= MODALS & DRAWERS ================= */}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleProceedToCheckout}
        coupons={coupons}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isWishlisted={selectedProduct ? wishlistIds.includes(selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={(item) => {
          handleAddToCart(item);
          setIsCartOpen(false);
          setSelectedProduct(null);
          navigateTo('payment');
        }}
        allProducts={products}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      {/* Combo Breakdown Modal */}
      <ComboDetailModal
        combo={selectedCombo}
        onClose={() => setSelectedCombo(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={(item) => {
          handleAddToCart(item);
          setIsCartOpen(false);
          setSelectedCombo(null);
          navigateTo('payment');
        }}
      />

      {/* Order Confirmed Celebration Modal */}
      <OrderSuccessModal
        order={confirmedOrder}
        onClose={() => setConfirmedOrder(null)}
        onTrackOrder={(id) => navigateTo('track', id)}
      />

      {/* Wishlist Modal */}
      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistedProducts={products.filter(p => wishlistIds.includes(p.id))}
        onRemoveFromWishlist={handleToggleWishlist}
        onMoveToCart={handleQuickAddProduct}
      />

      {/* Coupons Offer Modal */}
      <CouponsModal
        isOpen={isCouponsOpen}
        onClose={() => setIsCouponsOpen(false)}
        coupons={coupons}
        onApplyCoupon={(code) => {
          showToast(`Coupon ${code} copied!`);
        }}
      />

      {/* DEDICATED ADMIN CONTROL HUB (ACCESSIBLE VIA /admin ROUTE) */}
      <AdminDashboard
        isOpen={currentView === 'admin'}
        onClose={() => navigateTo('home')}
        products={products}
        combos={combos}
        settings={settings}
        onRefreshData={refreshData}
        onUpdateSettings={(newSet) => setSettings(newSet)}
      />

    </div>
  );
};

export default App;
