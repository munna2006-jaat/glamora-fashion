import React, { useState, useEffect } from 'react';
import { Product, Combo, CartItem, Order, Coupon, Review } from './types';
import { MOCK_PRODUCTS, MOCK_COMBOS, MOCK_COUPONS, MOCK_REVIEWS } from './data/mockData';

// Components
import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { StoryHighlights } from './components/StoryHighlights';
import { CombosSection } from './components/CombosSection';
import { ComboDetailModal } from './components/ComboDetailModal';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CollegeGirlEdit } from './components/CollegeGirlEdit';
import { IndianWearSection } from './components/IndianWearSection';
import { WesternWearSection } from './components/WesternWearSection';
import { AccessoriesSection } from './components/AccessoriesSection';
import { GiftBoxesSection } from './components/GiftBoxesSection';
import { ReviewsWall } from './components/ReviewsWall';
import { InstagramFeed } from './components/InstagramFeed';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { AdminDashboard } from './components/AdminDashboard';
import { WishlistModal } from './components/WishlistModal';
import { CouponsModal } from './components/CouponsModal';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  // Data State
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [combos, setCombos] = useState<Combo[]>(MOCK_COMBOS);
  const [coupons, setCoupons] = useState<Coupon[]>(MOCK_COUPONS);
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [activeCategory, setActiveCategory] = useState<string>('all');

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
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isCouponsOpen, setIsCouponsOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
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

  // Initial Fetch from API & Route Check
  const refreshData = async () => {
    try {
      const [resProd, resCombo, resCoup, resRev] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/combos'),
        fetch('/api/coupons'),
        fetch('/api/reviews')
      ]);
      if (resProd.ok) setProducts(await resProd.json());
      if (resCombo.ok) setCombos(await resCombo.json());
      if (resCoup.ok) setCoupons(await resCoup.json());
      if (resRev.ok) setReviews(await resRev.json());
    } catch (e) {
      console.log('Using local dataset as fallback:', e);
    }
  };

  useEffect(() => {
    refreshData();
    // Open admin directly if URL is /admin or #admin
    if (window.location.pathname === '/admin' || window.location.hash === '#admin') {
      setIsAdminOpen(true);
    }
  }, []);

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
    setIsCheckoutOpen(true);
  };

  const handleOrderPlaced = (order: Order) => {
    setCartItems([]);
    setIsCheckoutOpen(false);
    setConfirmedOrder(order);
    refreshData();
  };

  const handleTrackSpecificOrder = (trackingId: string) => {
    setActiveTrackingId(trackingId);
    setIsTrackingOpen(true);
  };

  // Category Filtering
  const handleSelectCategory = (cat: string) => {
    setActiveCategory(cat);
    if (cat === 'combos') {
      const el = document.getElementById('combos-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (cat === 'indian') {
      const el = document.getElementById('indian-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (cat === 'western') {
      const el = document.getElementById('western-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (cat === 'accessories' || cat === 'footwear') {
      const el = document.getElementById('accessories-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-glamora-cream text-glamora-charcoal font-sans flex flex-col selection:bg-glamora-blush selection:text-glamora-charcoal">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-glamora-charcoal text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-elevated border border-glamora-rose animate-slide-up flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Announcement Bar */}
      <AnnouncementBar onOpenCoupons={() => setIsCouponsOpen(true)} />

      {/* Main Luxury Navigation Bar */}
      <Navbar
        cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAdmin={() => {
          setIsAdminOpen(true);
          window.history.pushState(null, '', '/admin');
        }}
        onOpenTrackOrder={() => {
          setActiveTrackingId('');
          setIsTrackingOpen(true);
        }}
        onSelectCategory={handleSelectCategory}
        activeCategory={activeCategory}
        allProducts={products}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      <main className="flex-1">
        
        {/* Full-screen Editorial Hero Banner */}
        <HeroBanner
          onShopCombos={() => handleSelectCategory('combos')}
          onShopIndian={() => handleSelectCategory('indian')}
          onShopCollege={() => handleSelectCategory('college')}
        />

        {/* Story Highlights Bar */}
        <StoryHighlights onSelectCategory={handleSelectCategory} />

        {/* Curated GLAMORA Combos (The 8 Signature Collections) */}
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
            setIsCheckoutOpen(true);
          }}
        />

        {/* College Girl Edit (Under ₹1,499) */}
        <CollegeGirlEdit
          products={products}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onQuickAdd={handleQuickAddProduct}
          onViewAllCollege={() => handleSelectCategory('college')}
        />

        {/* Indian Ethnic Wear Collection */}
        <IndianWearSection
          products={products}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onQuickAdd={handleQuickAddProduct}
        />

        {/* Western Boutique Edit */}
        <WesternWearSection
          products={products}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onQuickAdd={handleQuickAddProduct}
        />

        {/* Accessories & Footwear Section */}
        <AccessoriesSection
          products={products}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onQuickAdd={handleQuickAddProduct}
        />

        {/* Luxury Gift Boxes & Unboxing Experience */}
        <GiftBoxesSection
          combos={combos}
          onOpenComboModal={(c) => setSelectedCombo(c)}
        />

        {/* Customer Reviews Wall */}
        <ReviewsWall reviews={reviews} />

        {/* Shoppable Instagram Lookbook Feed */}
        <InstagramFeed onShopLook={() => handleSelectCategory('combos')} />

      </main>

      {/* Premium Footer */}
      <Footer
        onSelectCategory={handleSelectCategory}
        onOpenTrackOrder={() => {
          setActiveTrackingId('');
          setIsTrackingOpen(true);
        }}
        onOpenAdmin={() => {
          setIsAdminOpen(true);
          window.history.pushState(null, '', '/admin');
        }}
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
          setIsCheckoutOpen(true);
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
          setIsCheckoutOpen(true);
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        appliedCoupon={appliedCheckoutCoupon}
        giftWrap={isGiftWrapSelected}
        onOrderPlaced={handleOrderPlaced}
      />

      {/* Order Confirmed Celebration Modal */}
      <OrderSuccessModal
        order={confirmedOrder}
        onClose={() => setConfirmedOrder(null)}
        onTrackOrder={handleTrackSpecificOrder}
      />

      {/* Order Tracking Modal */}
      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        initialTrackingId={activeTrackingId}
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

      {/* Full Admin Dashboard Hub */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => {
          setIsAdminOpen(false);
          window.history.pushState(null, '', '/');
        }}
        products={products}
        combos={combos}
        onRefreshData={refreshData}
      />

    </div>
  );
};

export default App;

