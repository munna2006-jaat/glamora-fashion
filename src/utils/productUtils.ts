import { Product } from '../types';

export const isJewelryProduct = (p: Product): boolean => {
  const text = `${p.name} ${p.subcategory || ''}`.toLowerCase();
  const isBag = text.includes('bag') || text.includes('tote') || text.includes('purse') || text.includes('clutch');
  if (isBag) return false;
  return p.category === 'accessories' || Boolean(text.match(/earring|jhumk|necklace|pendant|jewel|kundan|pearl|gold|silver|chain|bracelet|bangle|ring|solitaire|drop|chandbali/i));
};

export const isBagProduct = (p: Product): boolean => {
  const text = `${p.name} ${p.subcategory || ''}`.toLowerCase();
  return Boolean(text.match(/bag|tote|purse|clutch|shoulder/i));
};

export const getProductBadge = (p: Product): string => {
  if (isJewelryProduct(p)) return 'JEWELRY';
  if (isBagProduct(p)) return 'HANDBAGS';

  const text = p.name.toLowerCase();
  if (text.match(/jean|denim|trouser|pant/i)) return 'DENIM & JEANS';
  if (text.match(/sweatshirt|hoodie|pullover/i)) return 'SWEATSHIRTS';
  if (text.match(/top|blouse|shirt|cardigan|knit/i)) return 'TOPS & KNITWEAR';
  if (text.match(/lounge|pajama|nightwear/i)) return 'LOUNGEWEAR';
  if (text.match(/dress|cowl|maxi/i)) return 'DRESSES';
  if (text.match(/kurti|anarkali|saree|ethnic|leheriya|bandhani/i)) return 'KURTIS';
  if (p.category === 'accessories') return 'ACCESSORIES';
  if (p.category === 'western') return 'WESTERN';
  if (p.category === 'indian') return 'INDIAN WEAR';
  return p.subcategory || 'FASHION';
};

export const isNonClothingProduct = (p: Product): boolean => {
  return isJewelryProduct(p) || isBagProduct(p) || p.category === 'accessories';
};
