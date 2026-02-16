#!/usr/bin/env node
import sharp from 'sharp';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicDir = join(__dirname, '..', 'public');

const targets = [
    'img/avefi_diamonds_prim_mobile.webp',
    'img/avefi_diamonds_prim_tablet.webp',
    'img/avefi_diamonds_prim_desktop.webp',
    'img/avefi_diamonds_prim_white.webp',
    'img/restaur_kurzfilme.webp',
    'img/aktiv_im_dok.webp',
    'img/Georg-Stefan-Troller-2011-im-ZDF-bei-Vor-30-Jahren.webp',
    'img/Bundesarchiv_Bild_Leipzig_Capitol_Nacht.webp',
    'img/avefi_vid_poster.webp',
    'img/logo_sdk.png',
    'img/logo_tib.png',
    'img/logo_fmd.png',
    'img/logo_mcdci.png',
    'img/logo_hdf.webp',
    'img/logo_fmd.webp',
    'img/logo_sdk.webp',
    'img/logo_tib.webp',
    'img/logo_mcdci.webp',
];

async function run() {
    for (const rel of targets) {
        const abs = join(publicDir, rel);
        try {
            const meta = await sharp(abs).metadata();
            console.log(`${rel}: ${meta.width}x${meta.height}`);
        } catch (err) {
            console.error(`Failed to read ${rel}: ${err.message}`);
        }
    }
}

run();
