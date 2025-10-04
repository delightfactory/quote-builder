/**
 * Generate PWA Icons Script
 * This script creates a simple icon template
 * For production, use a proper image editing tool or online generator
 * Recommended: https://realfavicongenerator.net/ or https://www.pwabuilder.com/imageGenerator
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const iconsDir = path.join(__dirname, 'public', 'icons');

// Create icons directory if it doesn't exist
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Icon sizes to generate
const sizes = [16, 32, 72, 96, 128, 144, 152, 180, 192, 384, 512];

// Generate SVG icon template
const generateSVG = (size) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="${size}" height="${size}" fill="#3b82f6" rx="${size * 0.2}"/>
  
  <!-- Document Icon -->
  <g transform="translate(${size * 0.2}, ${size * 0.15})">
    <rect x="0" y="0" width="${size * 0.6}" height="${size * 0.7}" fill="white" rx="${size * 0.05}"/>
    
    <!-- Lines representing text -->
    <rect x="${size * 0.1}" y="${size * 0.15}" width="${size * 0.4}" height="${size * 0.04}" fill="#3b82f6" rx="${size * 0.02}"/>
    <rect x="${size * 0.1}" y="${size * 0.25}" width="${size * 0.3}" height="${size * 0.04}" fill="#3b82f6" rx="${size * 0.02}"/>
    <rect x="${size * 0.1}" y="${size * 0.35}" width="${size * 0.35}" height="${size * 0.04}" fill="#3b82f6" rx="${size * 0.02}"/>
    
    <!-- Currency symbol -->
    <text x="${size * 0.3}" y="${size * 0.58}" font-family="Arial, sans-serif" font-size="${size * 0.2}" font-weight="bold" fill="#10b981" text-anchor="middle">ج.م</text>
  </g>
</svg>`;
};

// Generate icons
sizes.forEach(size => {
  const svgContent = generateSVG(size);
  const filename = `icon-${size}x${size}.svg`;
  const filepath = path.join(iconsDir, filename);
  
  fs.writeFileSync(filepath, svgContent);
  console.log(`✅ Generated: ${filename}`);
});

// Create a README for icons
const iconReadme = `# PWA Icons

## Auto-generated Icons

These SVG icons were auto-generated. For production use, please:

1. **Use a professional design tool** (Figma, Sketch, Adobe Illustrator)
2. **Or use an online generator:**
   - https://realfavicongenerator.net/
   - https://www.pwabuilder.com/imageGenerator
   - https://favicon.io/

## Required Sizes

- 16x16, 32x32 - Favicon
- 72x72, 96x96, 128x128, 144x144, 152x152 - PWA icons
- 180x180 - Apple Touch Icon
- 192x192, 384x384, 512x512 - PWA icons (required by manifest)

## Design Guidelines

- Use a simple, recognizable icon
- Ensure good contrast
- Test on both light and dark backgrounds
- Make it square (1:1 aspect ratio)
- Use vector graphics (SVG) for scalability
`;

fs.writeFileSync(path.join(iconsDir, 'README.md'), iconReadme);
console.log('✅ Generated: README.md');
console.log('\n🎨 Icons generated successfully!');
console.log('📝 Note: For production, replace these with professionally designed icons.');
