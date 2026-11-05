# ✨ GLAMORA — Premium Gen-Z Women's Fashion Brand
> *"Your Style. Your Story."*

A production-ready, full-stack luxury fashion e-commerce platform curated specifically for young Indian women aged 15–25 (school & college students, young professionals).

---

## 🌸 Brand Highlights & Core Features

### 1. Distinctive Gen-Z Brand Identity
- **Color Palette:**
  - Blush Pink (`#F7DDE5`)
  - Rose Pink (`#D98BA5`)
  - Soft Cream (`#FFF9F6`)
  - White (`#FFFFFF`)
  - Charcoal (`#292329`)
  - Vintage Gold Accents (`#D4AF37`)
- **Typography:** Playfair Display (Luxury Editorial Serif) + Plus Jakarta Sans (Clean Modern Sans)
- **Modest, Aspirational Styling:** Real, diverse, non-sexualized Indian fashion photography.

### 2. Complete 4-Pillar Catalog
- **Indian Wear:** Breathable mulmul anarkalis, pure Chanderi silk kurti sets, Angrakha wraps, and festive metallic tissue sarees.
- **Western Edit:** French cuff corset knit tops, liquid satin cowl midi dresses, high-waisted 90s trousers, and pastel tweed co-ord sets.
- **Finishing Accents:** 18K micron gold plated filigree jhumkas, Austrian zirconia tennis bracelets, Kundan Meenakari choker sets, and ruched vegan leather dumpling bags.
- **Footwear:** Bite-free memory foam padded mukaish juttis, metallic block heels, and chunky platform sneakers.

### 3. The 8 Signature GLAMORA Combos (Bundled Savings up to ₹1,598)
1. **Desi Darling Combo:** Pure mulmul kurti + 18K gold jhumkas + Zirconia stacking bracelet
2. **College Girl Combo:** Parisienne corset knit top + Croissant dumpling bag + tennis bracelet + organza hair bow
3. **Ethnic Glow Combo:** Noor Chanderi suit + filigree jhumkas + memory foam embroidered juttis
4. **Bestie Gift Box:** Jhumkas + tennis bracelet + silk organza clip duo + luxury keepsake ribbon box
5. **Night Out Combo:** Aura satin cowl midi dress + dumpling clutch + metallic block heel sandals
6. **Everyday Essentials:** Cottagecore milkmaid crop top + 18K jhumkas + hair bow duo
7. **Festive Edit:** Chandani tissue silk saree + Kundan Meenakari choker set + mukaish juttis
8. **Glamora Luxe Box:** Sorbet tweed blazer skort set + dumpling bag + block heels + luxury gift chest

### 4. Interactive Customer Journey
- **Live Search & Autocomplete:** Instant product discovery popover
- **Interactive Combo Modal:** Multi-item size configuration and transparent savings breakdown
- **Pincode Delivery Estimator:** Pan-India express delivery checker
- **Slide-out Cart Drawer:** Dynamic Free Shipping progress meter (unlocks at ₹999), coupon input (`GLAMFIRST`, `COLLEGE15`), and gift packaging option
- **Full Indian Checkout:** Full shipping address form with instant UPI (GPay/PhonePe QR simulation), Cards, Net Banking & Cash on Delivery
- **Live Order Tracker:** Visual 5-step timeline tracking (Placed → Packed → Dispatched via BlueDart → Out for Delivery → Delivered)
- **Wishlist & Community Love:** Save favorites and read verified reviews from college students across India

### 5. Control Hub (Admin Panel at `/admin`)
- **KPI Overview:** Total Revenue, Total Orders, Pending Orders, Low Stock Alerts
- **Product Management:** Full CRUD (edit prices, titles, images, fabric specs, inventory stock)
- **Combos Builder:** Adjust bundle pricing and savings dynamically
- **Order Fulfillment Pipeline:** Live status updates (Placed → Confirmed → Dispatched → Delivered)

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation & Run

```bash
# 1. Install dependencies
npm install

# 2. Run both frontend and backend concurrently
npm run dev

# Frontend dev server will start on: http://localhost:3000
# Backend API server will start on: http://localhost:5005
```

### Production Build & Run

```bash
# Compile client and bundle backend
npm run build

# Start production server
npm start
```

---

## 📂 Project Architecture

```
glamora/
├── public/                 # Static assets & icons
├── src/
│   ├── components/         # 18 modular UI components
│   │   ├── AnnouncementBar.tsx
│   │   ├── Navbar.tsx
│   │   ├── HeroBanner.tsx
│   │   ├── StoryHighlights.tsx
│   │   ├── CombosSection.tsx
│   │   ├── ComboDetailModal.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductDetailModal.tsx
│   │   ├── CollegeGirlEdit.tsx
│   │   ├── IndianWearSection.tsx
│   │   ├── WesternWearSection.tsx
│   │   ├── AccessoriesSection.tsx
│   │   ├── GiftBoxesSection.tsx
│   │   ├── ReviewsWall.tsx
│   │   ├── InstagramFeed.tsx
│   │   ├── CartDrawer.tsx
│   │   ├── CheckoutModal.tsx
│   │   ├── OrderSuccessModal.tsx
│   │   ├── OrderTrackingModal.tsx
│   │   ├── WishlistModal.tsx
│   │   ├── CouponsModal.tsx
│   │   ├── AdminDashboard.tsx
│   │   └── Footer.tsx
│   ├── data/
│   │   └── mockData.ts     # Curated initial catalog & combos
│   ├── types.ts            # TypeScript interfaces
│   ├── App.tsx             # Root Application
│   ├── main.tsx
│   └── index.css           # Tailwind custom tokens
├── server/
│   ├── db.ts               # Storage engine with live persistence
│   └── server.ts           # Express API endpoints
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

---

## 🔒 Admin Credentials
- **Access Route:** Click the **Admin** button in the header or footer
- **Demo Username:** `admin@glamora.com`
- **Demo Password:** `glamora2026`

---

© 2026 GLAMORA Fashion Private Limited. Handcrafted with pride in India.

