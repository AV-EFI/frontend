#!/usr/bin/env node
import sharp from 'sharp';
import { existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicDir = join(__dirname, '..', 'public');

// Responsive widths chosen to match lighthouse guidance (mobile → desktop)
const DEFAULT_WIDTHS = [240, 360, 480, 720, 1024];

const responsiveImages = [
  {
    input: 'img/aktiv_im_dok.jpg',
    baseOutput: 'img/aktiv_im_dok',
    widths: DEFAULT_WIDTHS,
    formats: ['webp', 'jpeg'],
  },
  {
    input: 'img/restaur_kurzfilme.jpg',
    baseOutput: 'img/restaur_kurzfilme',
    widths: DEFAULT_WIDTHS,
    formats: ['webp', 'jpeg'],
  },
  {
    input: 'img/Georg-Stefan-Troller-2011-im-ZDF-bei-Vor-30-Jahren.webp',
    baseOutput: 'img/Georg-Stefan-Troller-2011-im-ZDF-bei-Vor-30-Jahren',
    widths: DEFAULT_WIDTHS,
    formats: ['webp', 'jpeg'],
  },
  {
    input: 'img/Bundesarchiv_Bild_Leipzig_Capitol_Nacht.webp',
    baseOutput: 'img/Bundesarchiv_Bild_Leipzig_Capitol_Nacht',
    widths: DEFAULT_WIDTHS,
    formats: ['webp', 'jpeg'],
  },
  {
    input: 'img/avefi_vid_poster.webp',
    baseOutput: 'img/avefi_vid_poster',
    widths: [360, 540, 720, 960, 1280],
    formats: ['webp'],
  },
];

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
        const outputName = `${imageConfig.baseOutput}-${width}.${extension}`;
        const outputPath = join(publicDir, outputName);
        const outputDir = dirname(outputPath);

        if (!existsSync(outputDir)) {
          mkdirSync(outputDir, { recursive: true });
        }

        try {
          const pipeline = sharp(inputPath).resize(width, null, {
            withoutEnlargement: true,
            fit: 'inside'
          });

          if (format === 'webp') {
            await pipeline.webp({ quality: 85 }).toFile(outputPath);
          } else if (format === 'jpeg') {
            await pipeline.jpeg({ quality: 85, mozjpeg: true }).toFile(outputPath);
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

  console.log('✨ Image optimization complete!\n');
}

optimizeImages().catch(console.error);
