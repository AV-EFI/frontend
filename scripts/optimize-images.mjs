#!/usr/bin/env node
import sharp from 'sharp';
import { existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicDir = join(__dirname, '..', 'public');

// Responsive widths chosen to match lighthouse guidance (mobile → desktop)
const DEFAULT_WIDTHS = [240, 320, 480, 720, 1024];
const WEBP_QUALITY = 90;
const JPEG_QUALITY = 82;

const responsiveImages = [
  {
    input: 'img/hermann_schlenker.jpg',
    baseOutput: 'img/hermann_schlenker',
    widths: DEFAULT_WIDTHS,
    formats: ['webp'],
  },
  {
    input: 'img/logo_mcdci.png',
    baseOutput: 'img/logo_mcdci',
    widths: [null], // null triggers height-only resize
    formats: ['webp'],
  },
  {
    input: 'img/avefi_nodes-hero.png',
    baseOutput: 'img/avefi_nodes-hero',
    widths: [...DEFAULT_WIDTHS, 2040],
    formats: ['webp'],
  },
  {
    input: 'img/avefi_nodes-og.png',
    baseOutput: 'img/avefi_nodes-og',
    widths: [...DEFAULT_WIDTHS],
    formats: ['webp'],
  },
  {
    input: 'img/aktiv_im_dok.jpg',
    baseOutput: 'img/aktiv_im_dok',
    widths: DEFAULT_WIDTHS,
    formats: ['webp'],
  },
  {
    input: 'img/restaur_kurzfilme.jpg',
    baseOutput: 'img/restaur_kurzfilme',
    widths: DEFAULT_WIDTHS,
    formats: ['webp'],
  },
  {
    input: 'img/Georg-Stefan-Troller-2011-im-ZDF-bei-Vor-30-Jahren.webp',
    baseOutput: 'img/Georg-Stefan-Troller-2011-im-ZDF-bei-Vor-30-Jahren',
    widths: DEFAULT_WIDTHS,
    formats: ['webp'],
  },
  {
    input: 'img/Bundesarchiv_Bild_Leipzig_Capitol_Nacht.webp',
    baseOutput: 'img/Bundesarchiv_Bild_Leipzig_Capitol_Nacht',
    widths: DEFAULT_WIDTHS,
    formats: ['webp'],
  },
  {
    input: 'img/avefi_vid_poster.webp',
    baseOutput: 'img/avefi_vid_poster',
    widths: [360, 540, 720, 960, 1280],
    formats: ['webp'],
  },
];

// --- Issuer logo upscaling config ---
// For each webp in issuer-images.json, we have a source PNG with the same name.
// We want to generate a larger webp version based on a height of 80px (width auto).
import { readFileSync } from 'fs';
const issuerImagesJson = join(__dirname, '..', 'data', 'issuer-images.json');
let issuerLogoConfigs = [];
try {
  const issuerData = JSON.parse(readFileSync(issuerImagesJson, 'utf8'));
  if (issuerData.mappings) {
    issuerLogoConfigs = Object.values(issuerData.mappings)
      .filter(entry => entry.image && entry.image.endsWith('.webp'))
      .map(entry => {
        const webpPath = entry.image.replace(/^\//, ''); // remove leading slash
        const pngPath = webpPath.replace(/\.webp$/, '.png');
        const jpgPath = webpPath.replace(/\.webp$/, '.jpg');
        // Prefer PNG, fallback to JPG
        let input = pngPath;
        if (!existsSync(join(publicDir, pngPath)) && existsSync(join(publicDir, jpgPath))) {
          input = jpgPath;
        }
        return {
          input,
          baseOutput: webpPath.replace(/\.webp$/, ''),
          height: 80,
          format: 'webp',
        };
      });
  }
} catch (e) {
  console.warn('Could not read issuer-images.json for logo upscaling:', e.message);
}

async function optimizeImages() {
  console.log('🖼️  Starting image optimization...\n');

  for (const imageConfig of responsiveImages) {
    const inputPath = join(publicDir, imageConfig.input);

    if (!existsSync(inputPath)) {
      console.log(`⚠️  Skipping ${imageConfig.input} (not found)`);
      continue;
    }

    console.log(`📸 Processing: ${imageConfig.input}`);

    for (const width of imageConfig.widths) {
      for (const format of imageConfig.formats) {
        const extension = format === 'jpeg' ? 'jpg' : format;
        let outputName;
        if (imageConfig.input === 'img/logo_mcdci.png' && width === null) {
          outputName = `${imageConfig.baseOutput}.${extension}`;
        } else {
          outputName = `${imageConfig.baseOutput}-${width}.${extension}`;
        }
        const outputPath = join(publicDir, outputName);
        const outputDir = dirname(outputPath);

        if (!existsSync(outputDir)) {
          mkdirSync(outputDir, { recursive: true });
        }

        try {
          let pipeline;
          if (imageConfig.input === 'img/logo_mcdci.png' && width === null) {
            pipeline = sharp(inputPath).resize({ height: 80, fit: 'contain' });
          } else {
            pipeline = sharp(inputPath).resize(width, null, {
              withoutEnlargement: true,
              fit: 'inside'
            });
          }

          if (format === 'webp') {
            await pipeline.webp({ quality: WEBP_QUALITY }).toFile(outputPath);
          } else if (format === 'jpeg') {
            await pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toFile(outputPath);
          }

          const stats = await sharp(outputPath).metadata();
          console.log(`   ✅ Created: ${outputName} (${stats.width}x${stats.height})`);
        } catch (error) {
          console.error(`   ❌ Error processing ${outputName}:`, error.message);
        }
      }
    }

    console.log('');
  }

  // --- Issuer logo upscaling ---
  if (issuerLogoConfigs.length > 0) {
    console.log('🏢 Upscaling issuer logos to 80px height...\n');
    for (const logo of issuerLogoConfigs) {
      const inputPath = join(publicDir, logo.input);
      const outputName = logo.baseOutput + '.webp';
      const outputPath = join(publicDir, outputName);
      const outputDir = dirname(outputPath);
      if (!existsSync(inputPath)) {
        console.log(`⚠️  Skipping ${logo.input} (not found)`);
        continue;
      }
      if (!existsSync(outputDir)) {
        mkdirSync(outputDir, { recursive: true });
      }
      try {
        await sharp(inputPath)
          .resize({ height: logo.height, fit: 'contain' })
          .webp({ quality: WEBP_QUALITY })
          .toFile(outputPath);
        const stats = await sharp(outputPath).metadata();
        console.log(`   ✅ Created: ${outputName} (${stats.width}x${stats.height})`);
      } catch (error) {
        console.error(`   ❌ Error processing ${outputName}:`, error.message);
      }
    }
    console.log('');
  }

  console.log('✨ Image optimization complete!\n');
}

optimizeImages().catch(console.error);
