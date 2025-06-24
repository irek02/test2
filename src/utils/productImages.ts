// Product image utility for generating contextual placeholder images

// Image generation service URLs
const PLACEHOLDER_SERVICES = {
  picsum: 'https://picsum.photos', // General photos
  unsplash: 'https://source.unsplash.com', // High quality photos by keyword
  placeholder: 'https://via.placeholder.com' // Simple colored placeholders
};

// Category-based image keywords for Unsplash
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  // Food & Beverage
  'coffee': ['coffee', 'espresso', 'latte', 'cappuccino', 'coffee-beans'],
  'food': ['food', 'gourmet', 'restaurant', 'cuisine', 'delicious'],
  'beverage': ['drinks', 'beverages', 'cocktails', 'smoothie', 'juice'],
  'tea': ['tea', 'teacup', 'green-tea', 'herbal-tea', 'tea-ceremony'],
  'wine': ['wine', 'vineyard', 'wine-glass', 'bottle', 'cellar'],
  'beer': ['beer', 'brewery', 'craft-beer', 'hops', 'ale'],

  // Fashion & Accessories
  'clothing': ['fashion', 'style', 'clothes', 'apparel', 'outfit'],
  'shoes': ['shoes', 'sneakers', 'footwear', 'boots', 'sandals'],
  'accessories': ['accessories', 'jewelry', 'watches', 'bags', 'style'],
  'jewelry': ['jewelry', 'rings', 'necklace', 'earrings', 'gems'],
  'bags': ['bags', 'handbags', 'purse', 'backpack', 'luggage'],

  // Electronics & Tech
  'electronics': ['electronics', 'technology', 'gadgets', 'devices', 'modern'],
  'tech': ['technology', 'computer', 'smartphone', 'digital', 'innovation'],
  'computer': ['computer', 'laptop', 'desktop', 'keyboard', 'monitor'],
  'phone': ['smartphone', 'mobile', 'iphone', 'android', 'communication'],
  'audio': ['headphones', 'speakers', 'music', 'sound', 'audio'],

  // Home & Garden
  'furniture': ['furniture', 'home', 'interior', 'design', 'modern-furniture'],
  'home': ['home', 'house', 'interior', 'living-room', 'cozy'],
  'garden': ['garden', 'plants', 'flowers', 'nature', 'green'],
  'decor': ['home-decor', 'decoration', 'interior-design', 'modern', 'style'],
  'kitchen': ['kitchen', 'cooking', 'utensils', 'chef', 'culinary'],

  // Health & Beauty
  'beauty': ['beauty', 'cosmetics', 'skincare', 'makeup', 'spa'],
  'health': ['health', 'fitness', 'wellness', 'medical', 'healthcare'],
  'skincare': ['skincare', 'beauty', 'face', 'cosmetics', 'treatment'],
  'fitness': ['fitness', 'gym', 'exercise', 'workout', 'health'],

  // Sports & Recreation
  'sports': ['sports', 'fitness', 'athletic', 'game', 'competition'],
  'outdoor': ['outdoor', 'nature', 'adventure', 'hiking', 'camping'],
  'books': ['books', 'reading', 'library', 'literature', 'education'],
  'music': ['music', 'instruments', 'guitar', 'piano', 'sound'],

  // Art & Crafts
  'art': ['art', 'painting', 'creative', 'artistic', 'gallery'],
  'crafts': ['crafts', 'handmade', 'diy', 'creative', 'artisan'],

  // Vintage & Collectibles
  'vintage': ['vintage', 'antique', 'retro', 'classic', 'old'],
  'records': ['vinyl', 'records', 'music', 'vintage', 'turntable'],
  'vinyl': ['vinyl', 'records', 'music', 'retro', 'collection'],

  // Default fallbacks
  'equipment': ['equipment', 'tools', 'machinery', 'industrial', 'professional'],
  'tools': ['tools', 'workshop', 'hardware', 'construction', 'repair'],
  'office': ['office', 'business', 'workspace', 'professional', 'desk']
};

// Product name keywords for more specific matching
const PRODUCT_KEYWORDS: Record<string, string[]> = {
  // Specific items
  'mug': ['mug', 'coffee-mug', 'tea-cup', 'ceramic', 'cup'],
  'beans': ['coffee-beans', 'beans', 'coffee', 'roasted', 'arabica'],
  'grinder': ['coffee-grinder', 'grinder', 'coffee-equipment', 'brewing'],
  'press': ['french-press', 'coffee-press', 'brewing', 'coffee-maker'],
  'shirt': ['shirt', 't-shirt', 'clothing', 'fashion', 'apparel'],
  'jeans': ['jeans', 'denim', 'pants', 'clothing', 'casual'],
  'watch': ['watch', 'timepiece', 'luxury', 'accessories', 'wrist-watch'],
  'phone': ['smartphone', 'mobile-phone', 'iphone', 'technology'],
  'laptop': ['laptop', 'computer', 'macbook', 'technology', 'work'],
  'headphones': ['headphones', 'audio', 'music', 'sound', 'wireless'],
  'chair': ['chair', 'furniture', 'seating', 'office-chair', 'comfort'],
  'table': ['table', 'furniture', 'dining-table', 'desk', 'wood'],
  'plant': ['plant', 'houseplant', 'green', 'nature', 'indoor-plant'],
  'candle': ['candle', 'scented-candle', 'home-decor', 'aromatherapy'],
  'book': ['book', 'reading', 'literature', 'novel', 'education'],
  'bottle': ['bottle', 'wine-bottle', 'glass-bottle', 'container'],
  'glass': ['glass', 'wine-glass', 'glassware', 'crystal', 'drinking-glass']
};

// Function to get the best keywords for a product
function getProductKeywords(productName: string, category: string): string[] {
  const name = productName.toLowerCase();
  
  // Check for specific product keywords first
  for (const [keyword, tags] of Object.entries(PRODUCT_KEYWORDS)) {
    if (name.includes(keyword)) {
      return tags;
    }
  }
  
  // Fall back to category keywords
  const categoryLower = category.toLowerCase();
  for (const [catKeyword, tags] of Object.entries(CATEGORY_KEYWORDS)) {
    if (categoryLower.includes(catKeyword)) {
      return tags;
    }
  }
  
  // Default fallback
  return ['product', 'item', 'modern', 'clean', 'minimal'];
}

// Generate a product image URL
export function getProductImageUrl(
  productName: string, 
  category: string, 
  productId: number,
  size: { width: number; height: number } = { width: 300, height: 300 }
): string {
  const keywords = getProductKeywords(productName, category);
  const primaryKeyword = keywords[0];
  
  // Use Unsplash for high-quality contextual images
  // Add the product ID as a seed to ensure consistent but varied images
  const seed = Math.abs(productId * 1234567) % 1000; // Deterministic but varied seed
  
  return `${PLACEHOLDER_SERVICES.unsplash}/${size.width}x${size.height}/?${primaryKeyword}&${seed}`;
}

// Alternative: Get multiple image options for a product
export function getProductImageOptions(
  productName: string, 
  category: string, 
  productId: number,
  size: { width: number; height: number } = { width: 300, height: 300 }
): string[] {
  const keywords = getProductKeywords(productName, category);
  const seed = Math.abs(productId * 1234567) % 1000;
  
  return keywords.slice(0, 3).map((keyword, index) => 
    `${PLACEHOLDER_SERVICES.unsplash}/${size.width}x${size.height}/?${keyword}&${seed + index}`
  );
}

// Fallback image if Unsplash fails
export function getFallbackImageUrl(
  productName: string,
  category: string,
  size: { width: number; height: number } = { width: 300, height: 300 }
): string {
  // Generate a color based on the product name for consistency
  const hash = productName.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const colors = ['4A90E2', '7ED321', 'F5A623', 'D0021B', '9013FE', '50E3C2'];
  const color = colors[Math.abs(hash) % colors.length];
  
  return `${PLACEHOLDER_SERVICES.placeholder}/${size.width}x${size.height}/${color}/FFFFFF?text=${encodeURIComponent(category)}`;
}

// Main function to get a product image with fallback
export function getProductImage(
  productName: string,
  category: string,
  productId: number,
  size: { width: number; height: number } = { width: 300, height: 300 }
): {
  primary: string;
  fallback: string;
  alt: string;
} {
  return {
    primary: getProductImageUrl(productName, category, productId, size),
    fallback: getFallbackImageUrl(productName, category, size),
    alt: `${productName} - ${category}`
  };
}