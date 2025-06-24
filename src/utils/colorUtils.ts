// Color utility functions for better accessibility and contrast

// Convert hex to RGB
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Convert RGB to hex
export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// Calculate relative luminance
export function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Calculate contrast ratio between two colors
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return 1;
  
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
}

// Check if color is dark or light
export function isLightColor(color: string): boolean {
  const rgb = hexToRgb(color);
  if (!rgb) return true;
  
  const luminance = getLuminance(rgb.r, rgb.g, rgb.b);
  return luminance > 0.5;
}

// Generate accessible text color for a background
export function getAccessibleTextColor(backgroundColor: string): string {
  return isLightColor(backgroundColor) ? '#1a1a1a' : '#ffffff';
}

// Darken a color by a percentage
export function darkenColor(color: string, percentage: number): string {
  const rgb = hexToRgb(color);
  if (!rgb) return color;
  
  const factor = 1 - (percentage / 100);
  return rgbToHex(
    Math.round(rgb.r * factor),
    Math.round(rgb.g * factor),
    Math.round(rgb.b * factor)
  );
}

// Lighten a color by a percentage
export function lightenColor(color: string, percentage: number): string {
  const rgb = hexToRgb(color);
  if (!rgb) return color;
  
  const factor = percentage / 100;
  return rgbToHex(
    Math.round(rgb.r + (255 - rgb.r) * factor),
    Math.round(rgb.g + (255 - rgb.g) * factor),
    Math.round(rgb.b + (255 - rgb.b) * factor)
  );
}

// Create an accessible color palette from AI-generated colors
export function createAccessiblePalette(primary: string, secondary: string, accent: string) {
  // Ensure primary color works well with white text
  let accessiblePrimary = primary;
  if (getContrastRatio(primary, '#ffffff') < 4.5) {
    accessiblePrimary = isLightColor(primary) ? darkenColor(primary, 40) : lightenColor(primary, 30);
  }
  
  // Create a lighter secondary for backgrounds
  let accessibleSecondary = secondary;
  if (getContrastRatio(secondary, '#ffffff') < 3) {
    accessibleSecondary = isLightColor(secondary) ? darkenColor(secondary, 30) : darkenColor(secondary, 20);
  }
  
  // Ensure accent color is vibrant but not too bright
  let accessibleAccent = accent;
  const accentRgb = hexToRgb(accent) || { r: 0, g: 0, b: 0 };
  const accentLuminance = getLuminance(accentRgb.r, accentRgb.g, accentRgb.b);
  if (accentLuminance > 0.8) {
    accessibleAccent = darkenColor(accent, 20);
  }
  
  return {
    primary: accessiblePrimary,
    secondary: accessibleSecondary,
    accent: accessibleAccent,
    // Additional utility colors
    light: lightenColor(accessiblePrimary, 85),
    dark: darkenColor(accessiblePrimary, 60),
    muted: lightenColor(accessiblePrimary, 70)
  };
}