import { Product, Combo, Review, Coupon } from '../types';

export const MOCK_PRODUCTS: Product[] = [
  // ===================== INDIAN COLLECTION =====================
  {
    id: 'prod-ind-1',
    name: 'Gulabi Rose Handblock Tiered Anarkali Kurti',
    sku: 'GLM-IND-001',
    category: 'indian',
    subcategory: 'Kurtis',
    price: 1299,
    originalPrice: 1799,
    priceTier: 'everyday',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'A breezy pure mulmul cotton tiered anarkali kurti adorned with hand-carved floral block prints in soft rose and blush tones. Detailed with gota patti trims on sleeves.',
    fabric: '100% Breathable Mulmul Cotton',
    care: 'Gentle hand wash in cold water with mild detergent. Dry in shade.',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Blush Rose', hex: '#D98BA5' },
      { name: 'Soft Cream', hex: '#FFF9F6' }
    ],
    stock: 45,
    rating: 4.8,
    reviewsCount: 128,
    isNewArrival: true,
    isBestSeller: true,
    isCollegeGirlEdit: true,
    matchingAccessories: ['prod-acc-1', 'prod-acc-4']
  },
  {
    id: 'prod-ind-2',
    name: 'Noor Chanderi Silk Kurti & Afghan Pant Set with Organza Dupatta',
    sku: 'GLM-IND-002',
    category: 'indian',
    subcategory: 'Kurti sets',
    price: 3499,
    originalPrice: 4499,
    priceTier: 'premium',
    images: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Elevated luxury for festive occasions and family weddings. Crafted from luminous peach-gold Chanderi silk with delicate zardozi neckline and scalloped organza dupatta.',
    fabric: 'Chanderi Silk with Cotton Lining & Pure Organza Dupatta',
    care: 'Dry clean only to maintain silk lustre.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Powder Peach', hex: '#FAD2E1' },
      { name: 'Sage Mint', hex: '#D8E2DC' }
    ],
    stock: 22,
    rating: 4.9,
    reviewsCount: 84,
    isBestSeller: true,
    isFestive: true,
    matchingAccessories: ['prod-acc-2', 'prod-acc-3']
  },
  {
    id: 'prod-ind-3',
    name: 'Kashti Pastel Mirror-Work Ethnic Co-ord Set',
    sku: 'GLM-IND-003',
    category: 'indian',
    subcategory: 'Ethnic co-ord sets',
    price: 1899,
    originalPrice: 2499,
    priceTier: 'everyday',
    images: [
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'The viral Gen-Z modern ethnic co-ord featuring a crop peplum top with real micro-mirror embroidery and tailored straight-cut palazzo trousers with side pockets.',
    fabric: 'Rayon Viscose Blend',
    care: 'Machine wash delicate cycle. Iron on reverse side.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Dusty Rose', hex: '#DDA7A5' },
      { name: 'Lilac Mist', hex: '#E2D4F0' }
    ],
    stock: 38,
    rating: 4.7,
    reviewsCount: 96,
    isNewArrival: true,
    isCollegeGirlEdit: true
  },
  {
    id: 'prod-ind-4',
    name: 'Chandani Tissue Silk Festive Saree with Embroidered Blouse Piece',
    sku: 'GLM-IND-004',
    category: 'indian',
    subcategory: 'Sarees',
    price: 4999,
    originalPrice: 6499,
    priceTier: 'premium',
    images: [
      'https://images.unsplash.com/photo-1610030469668-932d0c64c781?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Feather-light crushed metallic tissue saree with molten gold undertones. Features an exquisite pearl-beaded cutwork border, perfect for farewells, college fests and festive nights.',
    fabric: 'Metallic Blend Tissue Silk',
    care: 'Dry clean recommended.',
    sizes: ['Free Size (5.5m Saree + 0.8m Blouse)'],
    colors: [
      { name: 'Champagne Gold', hex: '#F3E5AB' },
      { name: 'Rose Gold', hex: '#ECC5C0' }
    ],
    stock: 15,
    rating: 5.0,
    reviewsCount: 52,
    isFestive: true
  },
  {
    id: 'prod-ind-5',
    name: 'Meera Angrakha Style Flared Everyday Cotton Kurti',
    sku: 'GLM-IND-005',
    category: 'indian',
    subcategory: 'Kurtis',
    price: 799,
    originalPrice: 1199,
    priceTier: 'affordable',
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Casual college-ready Angrakha wrap kurti with handmade fabric latkans and subtle contrast piping. Style with your favourite mom jeans or white palazzos.',
    fabric: '100% Slub Cotton',
    care: 'Hand or gentle machine wash.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [{ name: 'Mauve Pink', hex: '#C28CAE' }],
    stock: 60,
    rating: 4.6,
    reviewsCount: 142,
    isCollegeGirlEdit: true
  },
  {
    id: 'prod-ind-6',
    name: 'Royale Heritage Hand-Embroidered Velvet Lehenga Set',
    sku: 'GLM-IND-006',
    category: 'indian',
    subcategory: 'Festive wear',
    price: 24999,
    originalPrice: 29999,
    priceTier: 'exclusive',
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1610030469668-932d0c64c781?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'An heirloom piece crafted for bridal sisters and festive soirees. Micro-velvet lehenga with 16-kali flare, intricate dabka and semi-precious stone embroidery.',
    fabric: 'Micro Velvet with Pure Satin Silk Lining',
    care: 'Specialist dry clean only.',
    sizes: ['S', 'M', 'L'],
    colors: [{ name: 'Deep Wine Rose', hex: '#581845' }],
    stock: 6,
    rating: 5.0,
    reviewsCount: 19,
    isFestive: true
  },

  // ===================== WESTERN COLLECTION =====================
  {
    id: 'prod-wst-1',
    name: 'Parisienne French-Cuff Corset Knit Top',
    sku: 'GLM-WST-001',
    category: 'western',
    subcategory: 'Tops',
    price: 999,
    originalPrice: 1499,
    priceTier: 'affordable',
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'A sculpt-fit ribbed knit top featuring boning-inspired front seams, sweetheart neckline and softly gathered mutton sleeves. High-comfort Gen-Z chic.',
    fabric: 'Modal Cotton Ribbed Knit',
    care: 'Gentle wash inside out. Lay flat to dry.',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Blush Cream', hex: '#F9ECE5' },
      { name: 'Midnight Charcoal', hex: '#292329' }
    ],
    stock: 55,
    rating: 4.8,
    reviewsCount: 112,
    isNewArrival: true,
    isCollegeGirlEdit: true
  },
  {
    id: 'prod-wst-2',
    name: 'Aura Satin Cowl Neck Backless Midi Dress',
    sku: 'GLM-WST-002',
    category: 'western',
    subcategory: 'Dresses',
    price: 2199,
    originalPrice: 2899,
    priceTier: 'everyday',
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Liquid silk touch satin midi dress featuring a draped cowl neckline, side thigh slit, and delicate criss-cross tie straps at the back. Ideal for date nights and cocktail parties.',
    fabric: 'Heavyweight Matte Satin',
    care: 'Gentle cold hand wash or dry clean.',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Rose Quartz', hex: '#D98BA5' },
      { name: 'Champagne Satin', hex: '#EFE0D4' }
    ],
    stock: 30,
    rating: 4.9,
    reviewsCount: 78,
    isBestSeller: true
  },
  {
    id: 'prod-wst-3',
    name: 'Retro 90s Wide Leg High-Waisted Tailored Trousers',
    sku: 'GLM-WST-003',
    category: 'western',
    subcategory: 'Trousers',
    price: 1699,
    originalPrice: 2299,
    priceTier: 'everyday',
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Flattering front pleats, comfortable stretch waistband and an effortlessly elongating wide leg silhouette. The essential campus to boardroom trouser.',
    fabric: 'Poly-Viscose Twill with 3% Spandex',
    care: 'Machine wash warm, tumble dry low.',
    sizes: ['24', '26', '28', '30', '32'],
    colors: [
      { name: 'Oatmeal Beige', hex: '#E3DAC9' },
      { name: 'Charcoal Black', hex: '#292329' }
    ],
    stock: 40,
    rating: 4.7,
    reviewsCount: 65,
    isCollegeGirlEdit: true
  },
  {
    id: 'prod-wst-4',
    name: 'Sorbet Tweed Blazer & Pleated Skort Co-ord Set',
    sku: 'GLM-WST-004',
    category: 'western',
    subcategory: 'Co-ord sets',
    price: 3899,
    originalPrice: 4999,
    priceTier: 'premium',
    images: [
      'https://images.unsplash.com/photo-1551803091-e20673f15770?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Old money pastel aesthetic made modern. Soft pastel pink woven tweed cropped jacket with pearl-finish buttons and matching safety-lined pleated skort.',
    fabric: 'Bouclé Tweed with Full Satin Lining',
    care: 'Dry clean only.',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [{ name: 'Baby Pink Tweed', hex: '#F6CBD5' }],
    stock: 20,
    rating: 4.9,
    reviewsCount: 43,
    isBestSeller: true
  },
  {
    id: 'prod-wst-5',
    name: 'Cottagecore Floral Milkmaid Puff-Sleeve Crop Top',
    sku: 'GLM-WST-005',
    category: 'western',
    subcategory: 'Tops',
    price: 699,
    originalPrice: 999,
    priceTier: 'affordable',
    images: [
      'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Sweetheart gathered bust, elasticated puff sleeves that can be worn on or off-shoulder, and smocked back panel for a flexible fit.',
    fabric: '100% Lightweight Cotton Poplin',
    care: 'Machine wash cold.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [{ name: 'Floral Blush', hex: '#FAD4D8' }],
    stock: 75,
    rating: 4.6,
    reviewsCount: 156,
    isCollegeGirlEdit: true
  },
  {
    id: 'prod-wst-6',
    name: 'Haute Couture Crystal-Embellished Silk Blazer Dress',
    sku: 'GLM-WST-006',
    category: 'western',
    subcategory: 'Party wear',
    price: 18500,
    originalPrice: 22000,
    priceTier: 'exclusive',
    images: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Structured double-breasted tuxedo dress in pure silk crepe with hand-placed Swarovski crystal lapel cascades. Tailored to perfection.',
    fabric: '100% Pure Mulberry Silk Crepe',
    care: 'Specialist dry clean.',
    sizes: ['XS', 'S', 'M'],
    colors: [{ name: 'Onyx Black', hex: '#1C1B1B' }],
    stock: 5,
    rating: 5.0,
    reviewsCount: 14
  },

  // ===================== ACCESSORIES =====================
  {
    id: 'prod-acc-1',
    name: 'Gulmohar 18K Gold-Plated Filigree Jhumkas',
    sku: 'GLM-ACC-001',
    category: 'accessories',
    subcategory: 'Jhumkas',
    price: 599,
    originalPrice: 899,
    priceTier: 'affordable',
    images: [
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Lightweight traditional Indian jhumkas with intricate lattice work and freshwater seed pearl drops. Skin-friendly hypoallergenic brass base.',
    fabric: '18K Gold micron plated brass & pearl drops',
    care: 'Keep away from water, perfumes and cosmetics. Store in velvet pouch.',
    sizes: ['One Size (4.5cm drop)'],
    colors: [{ name: 'Antique Gold', hex: '#D4AF37' }],
    stock: 120,
    rating: 4.9,
    reviewsCount: 310,
    isBestSeller: true,
    isCollegeGirlEdit: true
  },
  {
    id: 'prod-acc-2',
    name: 'Celeste Dainty Stacking Zirconia Tennis Bracelet',
    sku: 'GLM-ACC-002',
    category: 'accessories',
    subcategory: 'Bracelets',
    price: 799,
    originalPrice: 1299,
    priceTier: 'affordable',
    images: [
      'https://images.unsplash.com/photo-1611591475155-426ea7b18fc9?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Ultra-sparkling AAA Austrian zirconia stones handset in rhodium and rose gold plated hypoallergenic links. Includes adjustable extender chain.',
    fabric: 'Rhodium & Rose Gold Micron Plating',
    care: 'Wipe with soft chamois cloth.',
    sizes: ['Adjustable (6" to 8")'],
    colors: [
      { name: 'Rose Gold', hex: '#ECC5C0' },
      { name: 'Silver Rhodium', hex: '#E5E4E2' }
    ],
    stock: 90,
    rating: 4.8,
    reviewsCount: 205,
    isCollegeGirlEdit: true
  },
  {
    id: 'prod-acc-3',
    name: 'Kundan Meenakari Handcrafted Choker & Earring Set',
    sku: 'GLM-ACC-003',
    category: 'accessories',
    subcategory: 'Necklaces',
    price: 2499,
    originalPrice: 3499,
    priceTier: 'everyday',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Regal bridal-party choker set with hand-painted pastel pink Meenakari back and uncut Kundan stones finished with cluster bead droplets.',
    fabric: 'Brass base, Glass Kundan, Meenakari Enamel',
    care: 'Dry storage in Glamora jewelry box.',
    sizes: ['Adjustable Dori Choker + 5cm Earrings'],
    colors: [{ name: 'Pastel Rose Gold', hex: '#E2A9B8' }],
    stock: 25,
    rating: 4.9,
    reviewsCount: 88,
    isFestive: true
  },
  {
    id: 'prod-acc-4',
    name: 'The Croissant Vegan Leather Dumpling Sling Bag',
    sku: 'GLM-ACC-004',
    category: 'accessories',
    subcategory: 'Sling bags',
    price: 1499,
    originalPrice: 1999,
    priceTier: 'everyday',
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Ruched cloud-soft vegan leather bag with gold chunky chain and detachable crossbody strap. Fits iPhone Pro Max, lip gloss, wallet and keys.',
    fabric: 'Premium Cruelty-Free PU Leather',
    care: 'Wipe clean with a damp cloth.',
    sizes: ['Compact (24cm x 15cm x 8cm)'],
    colors: [
      { name: 'Soft Latte', hex: '#DECBB7' },
      { name: 'Blush Cream', hex: '#F9ECE5' },
      { name: 'Noir', hex: '#292329' }
    ],
    stock: 50,
    rating: 4.8,
    reviewsCount: 164,
    isCollegeGirlEdit: true,
    isBestSeller: true
  },
  {
    id: 'prod-acc-5',
    name: 'Silk Organza Bow & Pearl Hair Claw Clip Duo',
    sku: 'GLM-ACC-005',
    category: 'accessories',
    subcategory: 'Hair accessories',
    price: 499,
    priceTier: 'affordable',
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'French girl hair essentials: one oversized double-layered organza ribbon bow clip plus one pearl-encrusted acetate French grip claw.',
    fabric: 'Organza Ribbon & Cellulose Acetate',
    care: 'Store in dry accessory pouch.',
    sizes: ['Standard Clip Duo'],
    colors: [{ name: 'Blush & Pearl White', hex: '#FADBD8' }],
    stock: 150,
    rating: 4.7,
    reviewsCount: 180,
    isCollegeGirlEdit: true
  },

  // ===================== FOOTWEAR =====================
  {
    id: 'prod-ftw-1',
    name: 'Zari Mukaish Hand-Embroidered Juttis with Cushion Sole',
    sku: 'GLM-FTW-001',
    category: 'footwear',
    subcategory: 'Flats',
    price: 1599,
    originalPrice: 2199,
    priceTier: 'everyday',
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Double padded soft foam sole that guarantees zero shoe-bites. Genuine leather lining with gold mukaish tikki hand embroidery on satin silk.',
    fabric: 'Satin Silk upper with Genuine Leather lining & Memory Foam Sole',
    care: 'Dry clean only. Use butter paper when storing.',
    sizes: ['36 (IND 3)', '37 (IND 4)', '38 (IND 5)', '39 (IND 6)', '40 (IND 7)', '41 (IND 8)'],
    colors: [
      { name: 'Rose Gold', hex: '#ECC5C0' },
      { name: 'Champagne', hex: '#F3E5AB' }
    ],
    stock: 35,
    rating: 4.9,
    reviewsCount: 142,
    isFestive: true
  },
  {
    id: 'prod-ftw-2',
    name: 'Cloud-Walk Minimalist Chunky Platform Sneakers',
    sku: 'GLM-FTW-002',
    category: 'footwear',
    subcategory: 'Sneakers',
    price: 2299,
    originalPrice: 2999,
    priceTier: 'everyday',
    images: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Lightweight EVA 4.5cm platform sole with pastel blush accent panels. Ultra-comfortable for long college campus walks and city shopping.',
    fabric: 'Vegan Leather & Breathable Mesh with EVA Sole',
    care: 'Spot clean with sneaker wipe.',
    sizes: ['36', '37', '38', '39', '40'],
    colors: [{ name: 'Blush White', hex: '#FFF2F5' }],
    stock: 45,
    rating: 4.8,
    reviewsCount: 98,
    isCollegeGirlEdit: true
  },
  {
    id: 'prod-ftw-3',
    name: 'Starlight Metallic Strappy Block Heel Sandals',
    sku: 'GLM-FTW-003',
    category: 'footwear',
    subcategory: 'Sandals',
    price: 1999,
    originalPrice: 2699,
    priceTier: 'everyday',
    images: [
      'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Comfortable 2.5-inch sturdy flared block heel with delicate crisscross ankle straps. Pairs seamlessly with both sarees and cocktail dresses.',
    fabric: 'Metallic Vegan Leather with Microfiber insole',
    care: 'Wipe with soft cloth.',
    sizes: ['36', '37', '38', '39', '40'],
    colors: [
      { name: 'Soft Gold', hex: '#D4AF37' },
      { name: 'Blush Metallic', hex: '#D98BA5' }
    ],
    stock: 30,
    rating: 4.7,
    reviewsCount: 80
  }
];

// ===================== THE 8 EXCLUSIVE GLAMORA COMBOS =====================
export const MOCK_COMBOS: Combo[] = [
  {
    id: 'combo-1',
    title: 'DESI DARLING COMBO',
    tagline: 'Kurti + Matching Jhumkas + Zirconia Stacking Bracelet',
    description: 'The definitive ethnic glow up for college fests, casual outings, and festive occasions. Includes our top-rated Gulabi handblock kurti, 18K gold-plated jhumkas, and a sparkle stacking bracelet.',
    badge: 'Trending Best Seller',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85',
    items: [
      {
        productId: 'prod-ind-1',
        name: 'Gulabi Rose Handblock Tiered Anarkali Kurti',
        category: 'Indian Wear',
        individualPrice: 1299,
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
        availableSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
      },
      {
        productId: 'prod-acc-1',
        name: 'Gulmohar 18K Gold-Plated Filigree Jhumkas',
        category: 'Jewelry',
        individualPrice: 599,
        image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&q=80',
        availableSizes: ['One Size']
      },
      {
        productId: 'prod-acc-2',
        name: 'Celeste Dainty Stacking Zirconia Bracelet',
        category: 'Jewelry',
        individualPrice: 799,
        image: 'https://images.unsplash.com/photo-1611591475155-426ea7b18fc9?auto=format&fit=crop&w=600&q=80',
        availableSizes: ['Adjustable']
      }
    ],
    comboPrice: 1999,
    originalTotal: 2697,
    savings: 698,
    stock: 25,
    rating: 4.9,
    reviewsCount: 340
  },
  {
    id: 'combo-2',
    title: 'COLLEGE GIRL COMBO',
    tagline: 'Trendy Top + Earrings + Bracelet + Dumpling Sling Bag',
    description: 'Your complete Monday morning lecture-ready fit in one click. Features our Parisienne knit top, Croissant dumpling sling bag, and matching rose gold minimal accessories.',
    badge: 'Campus Favorite',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=85',
    items: [
      {
        productId: 'prod-wst-1',
        name: 'Parisienne French-Cuff Corset Knit Top',
        category: 'Western Top',
        individualPrice: 999,
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
        availableSizes: ['XS', 'S', 'M', 'L']
      },
      {
        productId: 'prod-acc-4',
        name: 'The Croissant Vegan Leather Dumpling Sling Bag',
        category: 'Handbag',
        individualPrice: 1499,
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80',
        availableSizes: ['One Size']
      },
      {
        productId: 'prod-acc-2',
        name: 'Celeste Dainty Stacking Zirconia Bracelet',
        category: 'Jewelry',
        individualPrice: 799,
        image: 'https://images.unsplash.com/photo-1611591475155-426ea7b18fc9?auto=format&fit=crop&w=600&q=80',
        availableSizes: ['Adjustable']
      },
      {
        productId: 'prod-acc-5',
        name: 'Silk Organza Bow & Pearl Hair Claw Clip Duo',
        category: 'Hair Care',
        individualPrice: 499,
        image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80',
        availableSizes: ['Free Size']
      }
    ],
    comboPrice: 2799,
    originalTotal: 3796,
    savings: 997,
    stock: 20,
    rating: 4.8,
    reviewsCount: 215
  },
  {
    id: 'combo-3',
    title: 'ETHNIC GLOW COMBO',
    tagline: 'Ethnic Silk Suit + Filigree Jhumkas + Handmade Bangles',
    description: 'Radiate pure elegance at poojas, weddings, and family gatherings. Featuring our Noor Chanderi suit set paired with artisan handcrafted Kundan and pearl jewelry.',
    badge: 'Festive Essential',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=900&q=85',
    items: [
      {
        productId: 'prod-ind-2',
        name: 'Noor Chanderi Silk Kurti & Afghan Pant Set',
        category: 'Ethnic Suit Set',
        individualPrice: 3499,
        image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80',
        availableSizes: ['S', 'M', 'L', 'XL']
      },
      {
        productId: 'prod-acc-1',
        name: 'Gulmohar 18K Gold-Plated Filigree Jhumkas',
        category: 'Jewelry',
        individualPrice: 599,
        image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&q=80',
        availableSizes: ['One Size']
      },
      {
        productId: 'prod-ftw-1',
        name: 'Zari Mukaish Hand-Embroidered Juttis',
        category: 'Footwear',
        individualPrice: 1599,
        image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80',
        availableSizes: ['36', '37', '38', '39', '40', '41']
      }
    ],
    comboPrice: 4599,
    originalTotal: 5697,
    savings: 1098,
    stock: 18,
    rating: 5.0,
    reviewsCount: 184
  },
  {
    id: 'combo-4',
    title: 'BESTIE GIFT BOX',
    tagline: 'Earrings + Bracelet + Hair Clips + Keepsake Luxury Gift Box',
    description: 'The ultimate birthday or friendship day surprise. Arrives wrapped in soft pink satin ribbon with a personalized handwritten calligraphy note and scented floral tissue paper.',
    badge: 'Top Gift Idea',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=900&q=85',
    items: [
      {
        productId: 'prod-acc-1',
        name: 'Gulmohar 18K Gold-Plated Filigree Jhumkas',
        category: 'Jewelry',
        individualPrice: 599,
        image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&q=80',
        availableSizes: ['One Size']
      },
      {
        productId: 'prod-acc-2',
        name: 'Celeste Dainty Stacking Zirconia Bracelet',
        category: 'Jewelry',
        individualPrice: 799,
        image: 'https://images.unsplash.com/photo-1611591475155-426ea7b18fc9?auto=format&fit=crop&w=600&q=80',
        availableSizes: ['Adjustable']
      },
      {
        productId: 'prod-acc-5',
        name: 'Silk Organza Bow & Pearl Hair Claw Clip Duo',
        category: 'Hair Care',
        individualPrice: 499,
        image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80',
        availableSizes: ['Free Size']
      }
    ],
    comboPrice: 1499,
    originalTotal: 1897,
    savings: 398,
    stock: 40,
    rating: 4.9,
    reviewsCount: 290
  },
  {
    id: 'combo-5',
    title: 'NIGHT OUT COMBO',
    tagline: 'Western Outfit + Dumpling Bag + Block Heels + Stacking Jewelry',
    description: 'Effortless show-stopping glamour for club nights, birthday bashes, and fine dining. Features our Aura Satin cowl dress, croissant clutch, and shimmering block heels.',
    badge: 'Nightlife Edit',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=900&q=85',
    items: [
      {
        productId: 'prod-wst-2',
        name: 'Aura Satin Cowl Neck Backless Midi Dress',
        category: 'Western Dress',
        individualPrice: 2199,
        image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80',
        availableSizes: ['XS', 'S', 'M', 'L']
      },
      {
        productId: 'prod-acc-4',
        name: 'The Croissant Vegan Leather Dumpling Sling Bag',
        category: 'Handbag',
        individualPrice: 1499,
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80',
        availableSizes: ['One Size']
      },
      {
        productId: 'prod-ftw-3',
        name: 'Starlight Metallic Strappy Block Heel Sandals',
        category: 'Footwear',
        individualPrice: 1999,
        image: 'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?auto=format&fit=crop&w=600&q=80',
        availableSizes: ['36', '37', '38', '39', '40']
      }
    ],
    comboPrice: 4799,
    originalTotal: 5697,
    savings: 898,
    stock: 15,
    rating: 4.9,
    reviewsCount: 165
  },
  {
    id: 'combo-6',
    title: 'EVERYDAY ESSENTIALS',
    tagline: 'Casual Crop Top + Dainty Jhumkas + Hair Bow Duo',
    description: 'The easiest capsule wardrobe pairing under ₹1,500. Slip into lightweight cotton comfort with elevated delicate accessories that lift your everyday mood.',
    badge: 'Budget Magic',
    image: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=85',
    items: [
      {
        productId: 'prod-wst-5',
        name: 'Cottagecore Floral Milkmaid Puff-Sleeve Top',
        category: 'Everyday Top',
        individualPrice: 699,
        image: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=600&q=80',
        availableSizes: ['XS', 'S', 'M', 'L', 'XL']
      },
      {
        productId: 'prod-acc-1',
        name: 'Gulmohar 18K Gold-Plated Filigree Jhumkas',
        category: 'Jewelry',
        individualPrice: 599,
        image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&q=80',
        availableSizes: ['One Size']
      },
      {
        productId: 'prod-acc-5',
        name: 'Silk Organza Bow & Pearl Hair Claw Clip Duo',
        category: 'Hair Care',
        individualPrice: 499,
        image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80',
        availableSizes: ['Free Size']
      }
    ],
    comboPrice: 1399,
    originalTotal: 1797,
    savings: 398,
    stock: 50,
    rating: 4.7,
    reviewsCount: 220
  },
  {
    id: 'combo-7',
    title: 'FESTIVE EDIT',
    tagline: 'Tissue Silk Saree + Kundan Choker Set + Embroidered Juttis',
    description: 'Curated for the Indian festive calendar: Diwali, Eid, Rakhi and intimate sangeets. The molten gold tissue drape teamed with regal uncut Kundan jewelry.',
    badge: 'Festive Limited Edition',
    image: 'https://images.unsplash.com/photo-1610030469668-932d0c64c781?auto=format&fit=crop&w=900&q=85',
    items: [
      {
        productId: 'prod-ind-4',
        name: 'Chandani Tissue Silk Festive Saree',
        category: 'Saree',
        individualPrice: 4999,
        image: 'https://images.unsplash.com/photo-1610030469668-932d0c64c781?auto=format&fit=crop&w=600&q=80',
        availableSizes: ['Free Size']
      },
      {
        productId: 'prod-acc-3',
        name: 'Kundan Meenakari Handcrafted Choker Set',
        category: 'Jewelry Set',
        individualPrice: 2499,
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
        availableSizes: ['Adjustable']
      },
      {
        productId: 'prod-ftw-1',
        name: 'Zari Mukaish Hand-Embroidered Juttis',
        category: 'Footwear',
        individualPrice: 1599,
        image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80',
        availableSizes: ['36', '37', '38', '39', '40', '41']
      }
    ],
    comboPrice: 7499,
    originalTotal: 9097,
    savings: 1598,
    stock: 12,
    rating: 5.0,
    reviewsCount: 145
  },
  {
    id: 'combo-8',
    title: 'GLAMORA LUXE BOX',
    tagline: 'Tweed Blazer Skort + Dumpling Bag + Block Heels + Luxury Box',
    description: 'The pinnacle of affordable luxury. A statement bouclé tweed co-ord set combined with luxury footwear, cruelty-free leather handbag and magnetic rigid gift chest.',
    badge: 'Collector Edition',
    image: 'https://images.unsplash.com/photo-1551803091-e20673f15770?auto=format&fit=crop&w=900&q=85',
    items: [
      {
        productId: 'prod-wst-4',
        name: 'Sorbet Tweed Blazer & Pleated Skort Set',
        category: 'Co-ord Set',
        individualPrice: 3899,
        image: 'https://images.unsplash.com/photo-1551803091-e20673f15770?auto=format&fit=crop&w=600&q=80',
        availableSizes: ['XS', 'S', 'M', 'L']
      },
      {
        productId: 'prod-acc-4',
        name: 'The Croissant Vegan Leather Dumpling Sling Bag',
        category: 'Handbag',
        individualPrice: 1499,
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80',
        availableSizes: ['One Size']
      },
      {
        productId: 'prod-ftw-3',
        name: 'Starlight Metallic Strappy Block Heel Sandals',
        category: 'Footwear',
        individualPrice: 1999,
        image: 'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?auto=format&fit=crop&w=600&q=80',
        availableSizes: ['36', '37', '38', '39', '40']
      },
      {
        productId: 'prod-acc-2',
        name: 'Celeste Dainty Stacking Zirconia Bracelet',
        category: 'Jewelry',
        individualPrice: 799,
        image: 'https://images.unsplash.com/photo-1611591475155-426ea7b18fc9?auto=format&fit=crop&w=600&q=80',
        availableSizes: ['Adjustable']
      }
    ],
    comboPrice: 6999,
    originalTotal: 8196,
    savings: 1197,
    stock: 10,
    rating: 5.0,
    reviewsCount: 92
  }
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    userName: 'Ananya Sharma',
    city: 'Delhi University, North Campus',
    rating: 5,
    date: '2 days ago',
    comment: 'Ordered the Desi Darling combo for college Diwali mela. Honestly the fabric quality blew me away! The kurti is pure breathable mulmul and the jhumkas did not tarnish even a bit. Got so many compliments in college!',
    productName: 'DESI DARLING COMBO',
    verified: true
  },
  {
    id: 'rev-2',
    userName: 'Rhea Fernandes',
    city: 'Bandra, Mumbai',
    rating: 5,
    date: '1 week ago',
    comment: 'The Aura Satin dress fits like an absolute dream!! Usually satin clings in all the wrong places, but this has such a high-end drape and weight. Fast delivery too (received in 2 days).',
    productName: 'Aura Satin Cowl Neck Midi Dress',
    verified: true
  },
  {
    id: 'rev-3',
    userName: 'Tanvi Maheshwari',
    city: 'Jaipur, Rajasthan',
    rating: 5,
    date: '3 days ago',
    comment: 'Sent the Bestie Gift Box to my roommate for her 21st birthday. The box packaging looks like it costs ₹10,000! Rose gold foil detailing, ribbon tie, handwritten card... GLAMORA is now my go-to gift store!',
    productName: 'BESTIE GIFT BOX',
    verified: true
  },
  {
    id: 'rev-4',
    userName: 'Srishti Sen',
    city: 'Kolkata',
    rating: 5,
    date: '5 days ago',
    comment: 'The memory foam in the juttis is genius. Wore them through a 7-hour sangeet night with zero shoe bites. The mukaish work is so subtle and elegant.',
    productName: 'Zari Mukaish Embroidered Juttis',
    verified: true
  }
];

export const MOCK_COUPONS: Coupon[] = [
  {
    code: 'GLAMFIRST',
    discountPercent: 10,
    maxDiscount: 500,
    minOrder: 999,
    description: 'Flat 10% OFF on your first GLAMORA order (Min ₹999)'
  },
  {
    code: 'COLLEGE15',
    discountPercent: 15,
    maxDiscount: 750,
    minOrder: 1499,
    description: 'Special 15% Student Discount on combos & college wear'
  },
  {
    code: 'FESTIVE20',
    discountPercent: 20,
    maxDiscount: 1500,
    minOrder: 2999,
    description: 'Festive Season Offer: 20% OFF on orders above ₹2,999'
  }
];

