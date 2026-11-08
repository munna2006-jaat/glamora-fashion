import { Product, Combo, Review, Coupon, AppSettings } from '../types';

export const DEFAULT_SETTINGS: AppSettings = {
  upiId: 'glamora@upi',
  upiName: 'GLAMORA FASHION PVT LTD',
  qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=glamora@upi&pn=GLAMORA%20FASHION&cu=INR',
  qrCodes: [
    {
      id: 'qr-1',
      title: 'PhonePe VIP Scanner #1',
      upiId: 'glamora@upi',
      upiName: 'GLAMORA FASHION PVT LTD',
      image: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=glamora@upi&pn=GLAMORA%20FASHION&cu=INR',
      isActive: true,
      createdAt: new Date().toISOString()
    }
  ],
  announcementText: '🔥 DHAMAKA SALE: JAIPURI KURTI + EARRING COMBOS AT JUST ₹499 | KURTI + BAGGY JEANS AT ₹699!',
  whatsappNumber: '+91 98765 43210',
  shippingCharge: 70,
  freeShippingAbove: 799,
  metaPixelId: '',
  siteDomain: 'glamora.living'
};

export const MOCK_PRODUCTS: Product[] = [
  // ===================== RAJASTHANI & JAIPUR KURTIS =====================
  {
    id: 'prod-ind-1',
    name: 'Jaipuri Sanganeri Handblock Mulmul Straight Kurti',
    sku: 'GLM-JPR-001',
    category: 'indian',
    subcategory: 'Kurtis',
    price: 499,
    originalPrice: 999,
    priceTier: 'affordable',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Pure 100% Jaipur mulmul cotton kurti with authentic Sanganeri handblock floral print. Breathable round neck with wooden button detailing. Best paired with oxidised jhumkas or jeans.',
    fabric: '100% Pure Jaipur Mulmul Cotton',
    care: 'First wash gentle hand wash in cold water.',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Gulabi Rose', hex: '#D98BA5' },
      { name: 'Cream Peach', hex: '#FFF2EB' }
    ],
    stock: 65,
    rating: 4.9,
    reviewsCount: 340,
    isNewArrival: true,
    isBestSeller: true,
    isCollegeGirlEdit: true,
    matchingAccessories: ['prod-acc-1', 'prod-acc-2']
  },
  {
    id: 'prod-ind-2',
    name: 'Rajasthani Leheriya Pink Tiered Flared Anarkali Kurti',
    sku: 'GLM-JPR-002',
    category: 'indian',
    subcategory: 'Kurtis',
    price: 499,
    originalPrice: 1199,
    priceTier: 'affordable',
    images: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Vibrant Rajasthani diagonal Leheriya print in blush pink and rani rose tones. Features Gota-Patti border on sleeves and flared hem with handmade tassel dori.',
    fabric: 'Lightweight Cambric Cotton',
    care: 'Gentle hand wash. Iron on reverse.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Rani & Blush Pink', hex: '#E75480' },
      { name: 'Yellow Ochre', hex: '#F4D03F' }
    ],
    stock: 50,
    rating: 4.8,
    reviewsCount: 210,
    isBestSeller: true,
    isFestive: true,
    matchingAccessories: ['prod-acc-1']
  },
  {
    id: 'prod-ind-3',
    name: 'Bagru Dabu Print Natural Indigo A-Line Cotton Kurti',
    sku: 'GLM-JPR-003',
    category: 'indian',
    subcategory: 'Kurtis',
    price: 499,
    originalPrice: 1099,
    priceTier: 'affordable',
    images: [
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Authentic Bagru village hand-resist Dabu block print on indigo organic cotton. Features functional side pockets and mandarin collar. Perfect for everyday college wear.',
    fabric: '100% Bagru Dabu Organic Cotton',
    care: 'Wash separately in cold water.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [{ name: 'Indigo Blue & White', hex: '#1F3A60' }],
    stock: 45,
    rating: 4.7,
    reviewsCount: 180,
    isCollegeGirlEdit: true
  },
  {
    id: 'prod-ind-4',
    name: 'Bandhani Mirror-Work Short Flared Peplum Kurti',
    sku: 'GLM-JPR-004',
    category: 'indian',
    subcategory: 'Kurtis',
    price: 499,
    originalPrice: 899,
    priceTier: 'affordable',
    images: [
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Modern Gen-Z fusion short kurti with authentic Rajasthani Bandhej dot prints, neckline mirror embroidery, and gathered baby-doll waist. Crafted to style effortlessly over wide-leg jeans.',
    fabric: 'Soft Rayon Cotton Blend',
    care: 'Machine wash gentle cold.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Sunset Coral', hex: '#F08080' },
      { name: 'Teal Green', hex: '#008080' }
    ],
    stock: 58,
    rating: 4.8,
    reviewsCount: 195,
    isCollegeGirlEdit: true,
    isBestSeller: true
  },
  {
    id: 'prod-ind-5',
    name: 'Marwar Gota-Patti Festive Flared Kurti Pant Set',
    sku: 'GLM-JPR-005',
    category: 'indian',
    subcategory: 'Kurti sets',
    price: 799,
    originalPrice: 1499,
    priceTier: 'affordable',
    images: [
      'https://images.unsplash.com/photo-1610030469668-932d0c64c781?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Festive ready 2-piece set featuring a flared gold-printed kurti with intricate Marwar Gota-Patti border and matching straight-cut cotton pants with elasticated waistband.',
    fabric: 'Pure Cotton with Zari Gota Trims',
    care: 'Hand wash cold or dry clean.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Peacock Blue', hex: '#1C3F60' }],
    stock: 35,
    rating: 4.9,
    reviewsCount: 160,
    isFestive: true
  },

  // ===================== JEANS & BOTTOMS =====================
  {
    id: 'prod-wst-jeans',
    name: 'Gen-Z High-Waisted Wide Leg Baggy Denim Jeans',
    sku: 'GLM-JNS-001',
    category: 'western',
    subcategory: 'Jeans',
    price: 599,
    originalPrice: 1299,
    priceTier: 'affordable',
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'The viral high-rise baggy jeans cut specifically for styling with Indian short kurtis and crop tops. Non-stretch durable premium cotton denim with deep front & back pockets.',
    fabric: '100% Heavy Cotton Denim (12 oz)',
    care: 'Machine wash cold inside out.',
    sizes: ['26', '28', '30', '32', '34'],
    colors: [
      { name: 'Light Wash Vintage Blue', hex: '#A3C1AD' },
      { name: 'Medium Indigo', hex: '#3E5F8A' }
    ],
    stock: 80,
    rating: 4.9,
    reviewsCount: 420,
    isBestSeller: true,
    isCollegeGirlEdit: true
  },

  // ===================== RAJASTHANI EARRINGS & ACCESSORIES =====================
  {
    id: 'prod-acc-1',
    name: 'Rajasthani 18K Gold Plated Minakari Lotus Chandbali Jhumkas',
    sku: 'GLM-JWL-001',
    category: 'accessories',
    subcategory: 'Jhumkas',
    price: 499,
    originalPrice: 799,
    priceTier: 'affordable',
    images: [
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Authentic Jaipur Meenakari hand-enameled lotus motif with dual-bell jhumkis and tiny freshwater pearl clusters. Nickel-free lightweight alloy suitable for all-day wear.',
    fabric: '18K Gold Micron Plated Brass & Enamel',
    care: 'Wipe dry with clean cloth. Keep away from perfumes.',
    sizes: ['Free Size (5cm drop)'],
    colors: [{ name: 'Pink & Mint Meena', hex: '#F48FB1' }],
    stock: 140,
    rating: 4.9,
    reviewsCount: 390,
    isBestSeller: true,
    isCollegeGirlEdit: true
  },
  {
    id: 'prod-acc-2',
    name: 'Jaipuri Vintage Oxidised Silver Ghungroo Drop Jhumkis',
    sku: 'GLM-JWL-002',
    category: 'accessories',
    subcategory: 'Jhumkas',
    price: 499,
    originalPrice: 699,
    priceTier: 'affordable',
    images: [
      'https://images.unsplash.com/photo-1611591475155-426ea7b18fc9?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Classic boho silver oxidised jhumka earrings featuring embossed peacock dome, musical tiny ghungroos, and filigree hanging bells. The quintessential college kurti companion.',
    fabric: 'German Silver Oxidised Alloy',
    care: 'Store in airtight pouch.',
    sizes: ['One Size (4.5cm drop)'],
    colors: [{ name: 'Antique Silver', hex: '#C0C0C0' }],
    stock: 120,
    rating: 4.8,
    reviewsCount: 280,
    isCollegeGirlEdit: true
  },
  {
    id: 'prod-acc-3',
    name: 'Kundan Pearl Traditional Rajasthani Stud Chandbalis',
    sku: 'GLM-JWL-003',
    category: 'accessories',
    subcategory: 'Earrings',
    price: 499,
    originalPrice: 849,
    priceTier: 'affordable',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Uncut glass Kundan stones set in gold foil with crescent moon drop and pearl tassels. Elevates any simple cotton kurti into festive elegance.',
    fabric: 'Brass Kundan with Pearl Drops',
    care: 'Store in padded jewelry box.',
    sizes: ['Standard Size'],
    colors: [{ name: 'Gold & Ivory', hex: '#D4AF37' }],
    stock: 90,
    rating: 4.9,
    reviewsCount: 175
  },
  {
    id: 'prod-acc-4',
    name: 'Jaipur Block-Printed Canvas Everyday College Tote Bag',
    sku: 'GLM-BAG-001',
    category: 'accessories',
    subcategory: 'Handbags',
    price: 499,
    originalPrice: 799,
    priceTier: 'affordable',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Eco-friendly 100% thick canvas tote bag featuring Sanganeri floral block print. Fits 14-inch laptops, college notebooks, water bottles, and makeup pouch with secure top zipper.',
    fabric: 'Heavy Duty 100% Cotton Canvas',
    care: 'Machine washable.',
    sizes: ['Spacious (38cm x 34cm)'],
    colors: [{ name: 'Rose & Natural Cream', hex: '#EED9D5' }],
    stock: 75,
    rating: 4.8,
    reviewsCount: 145,
    isCollegeGirlEdit: true
  }
];

// ===================== HIGH-DEMAND CURATED COMBOS (RAJASTHAN & KURTI SPECIAL) =====================
export const MOCK_COMBOS: Combo[] = [
  // 1. KURTI + BAGGY JEANS COMBO (EXPLICIT USER REQUEST @ ₹699)
  {
    id: 'combo-kurti-jeans',
    title: 'KURTI + BAGGY JEANS COMBO',
    tagline: 'Authentic Jaipuri Cotton Kurti + High-Waisted Wide Leg Baggy Denim Jeans',
    description: 'The ultimate viral Gen-Z college outfit! Pair our top-selling Jaipuri printed kurti with trending relaxed-fit wide leg denim jeans. Comfortable for 8-hour campus days, stylish for canteen hangs.',
    badge: 'VIRAL SUPER DEAL • FLAT ₹699',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=900&q=85',
    items: [
      {
        productId: 'prod-ind-4',
        name: 'Bandhani Mirror-Work Short Flared Kurti',
        category: 'Kurti',
        individualPrice: 499,
        image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
        availableSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
      },
      {
        productId: 'prod-wst-jeans',
        name: 'High-Waisted Wide Leg Baggy Denim Jeans',
        category: 'Denim Jeans',
        individualPrice: 599,
        image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80',
        availableSizes: ['26', '28', '30', '32', '34']
      }
    ],
    comboPrice: 699,
    originalTotal: 1998,
    savings: 1299,
    stock: 45,
    rating: 4.9,
    reviewsCount: 520
  },

  // 2. JAIPUR SANGANERI KURTI + MEENAKARI JHUMKAS @ ₹499
  {
    id: 'combo-sanganeri-jhumka',
    title: 'SANGANERI KURTI + MINAKARI JHUMKA COMBO',
    tagline: '100% Mulmul Handblock Kurti + 18K Gold Plated Jaipur Minakari Jhumkas',
    description: 'The golden Rajasthani everyday pair. Featherlight breathable mulmul kurti in floral prints matched with hand-enameled lotus drop Chandbali jhumkas.',
    badge: 'DHAMAKA DEAL • ONLY ₹499',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85',
    items: [
      {
        productId: 'prod-ind-1',
        name: 'Jaipuri Sanganeri Handblock Mulmul Kurti',
        category: 'Kurti',
        individualPrice: 499,
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
        availableSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
      },
      {
        productId: 'prod-acc-1',
        name: '18K Gold Plated Minakari Lotus Chandbali Jhumkas',
        category: 'Jhumkas',
        individualPrice: 499,
        image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&q=80',
        availableSizes: ['Free Size']
      }
    ],
    comboPrice: 499,
    originalTotal: 1498,
    savings: 999,
    stock: 60,
    rating: 4.9,
    reviewsCount: 410
  },

  // 3. LEHERIYA PINK ANARKALI + KUNDAN CHANDBALI COMBO @ ₹549
  {
    id: 'combo-leheriya-kundan',
    title: 'RAJASTHANI LEHERIYA + KUNDAN CHANDBALI COMBO',
    tagline: 'Pink Flared Leheriya Kurti + Uncut Kundan Pearl Chandbalis',
    description: 'Traditional Marwari celebration fit! Luminous pink Leheriya flared tiered kurti paired with sparkling Kundan crescent moon earrings.',
    badge: 'FESTIVE EDIT • ₹549',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=900&q=85',
    items: [
      {
        productId: 'prod-ind-2',
        name: 'Rajasthani Leheriya Pink Tiered Flared Kurti',
        category: 'Flared Kurti',
        individualPrice: 499,
        image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80',
        availableSizes: ['S', 'M', 'L', 'XL', 'XXL']
      },
      {
        productId: 'prod-acc-3',
        name: 'Kundan Pearl Traditional Chandbalis',
        category: 'Earrings',
        individualPrice: 499,
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
        availableSizes: ['Free Size']
      }
    ],
    comboPrice: 549,
    originalTotal: 1698,
    savings: 1149,
    stock: 35,
    rating: 4.8,
    reviewsCount: 290
  },

  // 4. BAGRU INDIGO KURTI + OXIDISED AFGHANI JHUMKAS @ ₹499
  {
    id: 'combo-bagru-silver',
    title: 'BAGRU INDIGO KURTI + OXIDISED JHUMKI COMBO',
    tagline: 'Bagru Dabu Print Kurti + Vintage Ghungroo Drop Oxidised Jhumkis',
    description: 'The college arts & literature aesthetic! Hand-dyed natural indigo A-line kurti with earthy Dabu prints combined with ringing ghungroo drop silver jhumkis.',
    badge: 'CAMPUS TREND • ONLY ₹499',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=85',
    items: [
      {
        productId: 'prod-ind-3',
        name: 'Bagru Dabu Print Natural Indigo A-Line Kurti',
        category: 'Kurti',
        individualPrice: 499,
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80',
        availableSizes: ['XS', 'S', 'M', 'L', 'XL']
      },
      {
        productId: 'prod-acc-2',
        name: 'Jaipuri Vintage Oxidised Silver Ghungroo Jhumkis',
        category: 'Earrings',
        individualPrice: 499,
        image: 'https://images.unsplash.com/photo-1611591475155-426ea7b18fc9?auto=format&fit=crop&w=600&q=80',
        availableSizes: ['Free Size']
      }
    ],
    comboPrice: 499,
    originalTotal: 1598,
    savings: 1099,
    stock: 40,
    rating: 4.9,
    reviewsCount: 380
  },

  // 5. MARWAR GOTA PATTI SUIT SET + JHUMKA COMBO @ ₹799
  {
    id: 'combo-gota-suit',
    title: 'MARWAR GOTA SUIT + JHUMKA 3-PIECE COMBO',
    tagline: 'Flared Gold Printed Kurti + Cotton Pant + Gold Minakari Jhumkis',
    description: 'Complete festive ready head-to-toe ensemble. Shimmering gota border kurti, tailored pants and matching Minakari earrings in one luxury gift package.',
    badge: 'BESTSELLER FESTIVE • ₹799',
    image: 'https://images.unsplash.com/photo-1610030469668-932d0c64c781?auto=format&fit=crop&w=900&q=85',
    items: [
      {
        productId: 'prod-ind-5',
        name: 'Marwar Gota-Patti Flared Kurti Pant Set',
        category: 'Suit Set',
        individualPrice: 799,
        image: 'https://images.unsplash.com/photo-1610030469668-932d0c64c781?auto=format&fit=crop&w=600&q=80',
        availableSizes: ['S', 'M', 'L', 'XL']
      },
      {
        productId: 'prod-acc-1',
        name: '18K Gold Plated Minakari Lotus Chandbali Jhumkas',
        category: 'Jhumkas',
        individualPrice: 499,
        image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&q=80',
        availableSizes: ['Free Size']
      }
    ],
    comboPrice: 799,
    originalTotal: 2298,
    savings: 1499,
    stock: 25,
    rating: 5.0,
    reviewsCount: 260
  },

  // 6. COLLEGE TRIPLE ESSENTIALS: SHORT KURTI + JHUMKAS + CANVAS TOTE @ ₹649
  {
    id: 'combo-college-tote',
    title: 'COLLEGE GIRL TRIPLE COMBO',
    tagline: 'Short Bandhani Kurti + Oxidised Jhumkas + Block-Print Canvas Tote',
    description: 'Everything you need for college in one box. Trending short kurti, oxidised jhumkis, and a heavy-duty zipper canvas bag for your books and laptop.',
    badge: 'COLLEGE HIT • ₹649',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=85',
    items: [
      {
        productId: 'prod-ind-4',
        name: 'Bandhani Short Flared Peplum Kurti',
        category: 'Kurti',
        individualPrice: 499,
        image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
        availableSizes: ['XS', 'S', 'M', 'L', 'XL']
      },
      {
        productId: 'prod-acc-2',
        name: 'Jaipuri Oxidised Ghungroo Jhumkis',
        category: 'Earrings',
        individualPrice: 499,
        image: 'https://images.unsplash.com/photo-1611591475155-426ea7b18fc9?auto=format&fit=crop&w=600&q=80',
        availableSizes: ['Free Size']
      },
      {
        productId: 'prod-acc-4',
        name: 'Jaipur Block-Printed Canvas Tote Bag',
        category: 'Bag',
        individualPrice: 499,
        image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
        availableSizes: ['Free Size']
      }
    ],
    comboPrice: 649,
    originalTotal: 2197,
    savings: 1548,
    stock: 30,
    rating: 4.9,
    reviewsCount: 310
  }
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    userName: 'Kavita Rathore',
    city: 'Jaipur, Rajasthan',
    rating: 5,
    date: 'Yesterday',
    comment: 'Kurti aur baggy jeans wala combo ₹699 me mangwaya tha! Honestly kapda ekdum pure heavy denim aur kurti ka mulmul bohot soft hai. College me sabne poocha kaha se liya!',
    productName: 'KURTI + BAGGY JEANS COMBO',
    verified: true
  },
  {
    id: 'rev-2',
    userName: 'Pooja Choudhary',
    city: 'Jodhpur, Rajasthan',
    rating: 5,
    date: '2 days ago',
    comment: '₹499 me Jaipuri Kurti ke saath pure Minakari Jhumke mil gaye, I am shocked! Quality is literally 10/10. Deliver bhi 2 din me ho gaya!',
    productName: 'SANGANERI KURTI + MINAKARI JHUMKA COMBO',
    verified: true
  },
  {
    id: 'rev-3',
    userName: 'Simran Shekhawat',
    city: 'Udaipur, Rajasthan',
    rating: 5,
    date: '3 days ago',
    comment: 'Leheriya kurti ki flare bohot sundar hai aur Kundan chandbali jhumka bilkul heavy wedding look deta hai. GLAMORA rocks!',
    productName: 'RAJASTHANI LEHERIYA + KUNDAN CHANDBALI COMBO',
    verified: true
  }
];

export const MOCK_COUPONS: Coupon[] = [
  {
    code: 'GLAM499',
    discountPercent: 10,
    maxDiscount: 200,
    minOrder: 499,
    description: 'Extra 10% OFF on all Rajasthani Kurti Combos (Min ₹499)'
  },
  {
    code: 'COLLEGE15',
    discountPercent: 15,
    maxDiscount: 300,
    minOrder: 699,
    description: 'Flat 15% Student Discount on Kurti + Baggy Jeans'
  }
];
