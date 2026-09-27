import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const svgPath = path.resolve('public/icon.svg');
const svgBuffer = fs.readFileSync(svgPath);

async function generate() {
  console.log('Generating PWA icons...');
  
  // 192x192
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile('public/pwa-192x192.png');
  console.log('pwa-192x192.png generated');

  // 512x512
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile('public/pwa-512x512.png');
  console.log('pwa-512x512.png generated');

  // apple-touch-icon 180x180
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile('public/apple-touch-icon.png');
  console.log('apple-touch-icon.png generated');

  // maskable 512x512 (with 15% inner padding safe zone)
  const innerSize = Math.round(512 * 0.76); // ~390px
  const innerIcon = await sharp(svgBuffer).resize(innerSize, innerSize).toBuffer();
  
  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 15, g: 23, b: 42, alpha: 1 } // #0f172a
    }
  })
  .composite([
    { input: innerIcon, gravity: 'center' }
  ])
  .png()
  .toFile('public/pwa-maskable-512x512.png');
  console.log('pwa-maskable-512x512.png generated');
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});
