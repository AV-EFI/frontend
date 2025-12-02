#!/usr/bin/env node
import sharp from 'sharp';
import { existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicDir = join(__dirname, '..', 'public');

// Image optimization configurations
const images = [
  {
    input: 'img/aktiv_im_dok.jpg',
    outputs: [
      { name: 'img/aktiv_im_dok-800.webp', width: 800, format: 'webp', quality: 85 },
      { name: 'img/aktiv_im_dok-800.jpg', width: 800, format: 'jpeg', quality: 85 },
    ]
  },
  {
    input: 'img/restaur_kurzfilme.jpg',
    outputs: [
      { name: 'img/restaur_kurzfilme-800.webp', width: 800, format: 'webp', quality: 85 },
      { name: 'img/restaur_kurzfilme-800.jpg', width: 800, format: 'jpeg', quality: 85 },
    ]
  },
  {
    input: 'img/avefi_vid_poster.webp',
    outputs: [
      { name: 'img/avefi_vid_poster-1024.webp', width: 1024, format: 'webp', quality: 85 },
    ]
  }
];

async function optimizeImages() {
  console.log('🖼️  Starting image optimization...\n');

  for (const imageConfig of images) {
    const inputPath = join(publicDir, imageConfig.input);
    
    if (!existsSync(inputPath)) {
      console.log(`⚠️  Skipping ${imageConfig.input} (not found)`);
      continue;
    }

    console.log(`📸 Processing: ${imageConfig.input}`);
    
    for (const output of imageConfig.outputs) {
      const outputPath = join(publicDir, output.name);
      const outputDir = dirname(outputPath);

      // Ensure output directory exists
      if (!existsSync(outputDir)) {
        mkdirSync(outputDir, { recursive: true });
      }

      try {
        const pipeline = sharp(inputPath).resize(output.width, null, {
          withoutEnlargement: true,
          fit: 'inside'
        });

        if (output.format === 'webp') {
          await pipeline.webp({ quality: output.quality }).toFile(outputPath);
        } else if (output.format === 'jpeg') {
          await pipeline.jpeg({ quality: output.quality, mozjpeg: true }).toFile(outputPath);
        }

        const stats = await sharp(outputPath).metadata();
        console.log(`   ✅ Created: ${output.name} (${stats.width}x${stats.height})`);
      } catch (error) {
        console.error(`   ❌ Error processing ${output.name}:`, error.message);
      }
    }
    console.log('');
  }

  console.log('✨ Image optimization complete!\n');
}

optimizeImages().catch(console.error);
