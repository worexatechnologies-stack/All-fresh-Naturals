import ragiMaltBackImg from '../assets/ragi_malt_back_info.jpg';
import ragiMaltFrontImg from '../assets/ragi_malt_front_mockup.jpg';
import ragiMaltDualImg from '../assets/ragi_malt_dual_mockup.jpg';
import abcMaltImg from '../assets/abc_malt_dual_mockup.jpg';
import abcMaltBackImg from '../assets/abc_malt_back_info.jpg';

export interface Product {
  id: string;
  name: string;
  badge: string;
  tagline: string;
  description: string;
  price: number;
  originalPrice?: number;
  size: string;
  image: string;
  altImage?: string;
  ingredients: string[];
  benefits: string[];
  usage: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface IngredientDetails {
  name: string;
  benefits: string[];
  role: string;
}

export { ragiMaltBackImg, ragiMaltFrontImg, ragiMaltDualImg, abcMaltImg, abcMaltBackImg };

export function resolveProductImage(url: string | undefined, defaultFallback: string = abcMaltImg): string {
  if (!url || typeof url !== 'string') return defaultFallback;
  const lower = url.toLowerCase();

  if (lower.includes('abc_malt_back')) {
    return abcMaltBackImg;
  }
  if (lower.includes('abc_malt_dual') || lower.includes('abc_malt') || lower.includes('abc-malt')) {
    return abcMaltImg;
  }
  if (lower.includes('ragi_malt_back')) {
    return ragiMaltBackImg;
  }
  if (lower.includes('ragi_malt_dual') || lower.includes('ragi_malt_front') || lower.includes('ragi_malt') || lower.includes('ragi-malt')) {
    return ragiMaltDualImg;
  }

  return url;
}

export function normalizeProduct(p: Product): Product {
  if (!p || typeof p !== 'object') {
    return defaultProducts[0];
  }

  const pId = typeof p.id === 'string' ? p.id : '';
  const defaultProd = defaultProducts.find(
    (dp) => dp.id === pId || (pId && (dp.id.replace('-', '_') === pId.replace('-', '_') || pId.replace('_', '-') === dp.id))
  );

  const fallbackImg = defaultProd ? defaultProd.image : abcMaltImg;
  const fallbackAlt = defaultProd?.altImage || abcMaltBackImg;

  return {
    ...p,
    id: pId || (defaultProd ? defaultProd.id : 'unknown-product'),
    image: resolveProductImage(p.image, fallbackImg),
    altImage: p.altImage ? resolveProductImage(p.altImage, fallbackAlt) : fallbackAlt
  };
}

export const defaultProducts: Product[] = [
  {
    id: 'abc-malt',
    name: 'ABC Malt',
    badge: 'Best Seller',
    tagline: 'Wholesome Nutrition in Every Sip!',
    description: 'A delicious and nourishing health drink mix made with the goodness of Apple, Beetroot, Carrot, Jaggery, Nuts and Cardamom (Elaichi). Prepared with care by All Fresh Naturals.',
    price: 399,
    originalPrice: 599,
    size: '250gm',
    image: abcMaltImg,
    altImage: abcMaltBackImg,
    ingredients: ['Apple', 'Beetroot', 'Carrot', 'Jaggery', 'Almonds', 'Cashews', 'Cardamom (Elaichi)'],
    benefits: [
      'Supports Everyday Energy & Vitality',
      'Packed with Beta-carotene and Antioxidants',
      'Naturally Sweetened with Premium Jaggery (Sugar-Free)',
      'Rich in Dietary Fibre & Essential Nutrients',
      '100% Natural & Homemade style with zero artificial additives'
    ],
    usage: 'Add 2-3 spoonfuls of ABC Malt powder to warm milk. Mix thoroughly and enjoy it fresh. Perfect for breakfast or evening refreshment!'
  },
  {
    id: 'ragi-malt',
    name: 'Ragi Malt Health Mix',
    badge: 'Traditional Recipe',
    tagline: 'Experience the goodness of traditional nutrition',
    description: 'A wholesome health mix made from carefully selected natural ingredients such as ragi, jowar, wheat, rice, nuts, green gram, fenugreek, dry ginger, pepper, jeera, and other grains. Rich in calcium, iron, protein, and fiber.',
    price: 199,
    originalPrice: 399,
    size: '250gm',
    image: ragiMaltDualImg,
    altImage: ragiMaltBackImg,
    ingredients: ['Ragi (Finger Millet)', 'Jowar', 'Wheat', 'Rice', 'Almonds', 'Cashews', 'Green Gram', 'Fenugreek', 'Dry Ginger', 'Black Pepper', 'Jeera'],
    benefits: [
      'Rich Source of Natural Calcium & Bone Strength',
      'High Fibre Content for Smooth Digestion',
      'Sustained Energy Release Throughout the Day',
      'Ideal Health Drink for Children, Adults & Seniors',
      'Handmade Fresh in Small Batches'
    ],
    usage: 'Mix 2 tbsp of Ragi Malt with milk or water, cook on low flame for 3-5 minutes until smooth, add jaggery or milk as per taste and serve warm.'
  }
];

export const products: Product[] = defaultProducts;

export const ingredientsExplorer: Record<string, IngredientDetails[]> = {
  malts: [
    {
      name: 'Ragi (Finger Millet)',
      role: 'Ragi Malt Base',
      benefits: [
        'Excellent natural source of calcium (nearly 3 times more than milk) that supports strong bones and teeth.',
        'Rich in iron that helps improve haemoglobin levels and fight tiredness.',
        'Completely gluten-free and high in dietary fibre for better digestion.'
      ]
    },
    {
      name: 'Apple',
      role: 'ABC Malt Nutrition',
      benefits: [
        'Naturally rich in fibre and antioxidants that support gut health and immunity.',
        'Provides gentle natural sweetness and a refreshing taste to the malt.',
        'Helps keep the drink light and easy to digest for all age groups.'
      ]
    },
    {
      name: 'Beetroot',
      role: 'ABC Malt Vitality',
      benefits: [
        'Excellent source of natural nitrates and iron that support healthy blood flow and energy.',
        'Adds a mild earthy sweetness and beautiful colour without any artificial dyes.',
        'Traditionally valued for supporting stamina and overall vitality.'
      ]
    },
    {
      name: 'Carrot',
      role: 'ABC Malt Immunity',
      benefits: [
        'Loaded with beta-carotene (Vitamin A) that supports eye health and glowing skin.',
        'Brings natural sweetness and a smooth texture to the malt.',
        'Rich in antioxidants that help the body fight everyday stress.'
      ]
    },
    {
      name: 'Jaggery (Gur)',
      role: 'Natural Sweetener',
      benefits: [
        'Unrefined and packed with natural iron, minerals, and a soft caramel flavour.',
        'Provides gentle energy without the sharp blood-sugar spike of white sugar.',
        'Traditional sweetener that complements the earthy taste of ragi and roots.'
      ]
    },
    {
      name: 'Nuts (Almonds & Cashews)',
      role: 'Healthy Fats & Proteins',
      benefits: [
        'Provide healthy fats, protein, and a creamy mouthfeel.',
        'Almonds add Vitamin E and magnesium; cashews add zinc and healthy calories.',
        'Make the malt more filling and nourishing for growing children and active adults.'
      ]
    }
  ]
};
