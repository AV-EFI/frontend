#!/usr/bin/env node
import sharp from 'sharp';
import { join } from 'path';
import { getDeclaredOutputs, imageJobs, publicDir, staticRuntimeImages } from './image-manifest.mjs';

const isImagePath = (relPath) => /\.(?:avif|gif|ico|jpe?g|png|svg|webp)$/iu.test(relPath);

const defaultTargets = Array.from(new Set([
    ...staticRuntimeImages.filter(isImagePath),
    ...imageJobs.map((job) => job.input),
    ...getDeclaredOutputs(),
]));

async function run() {
    const extraTargets = process.argv.slice(2);
    const targets = extraTargets.length ? extraTargets : defaultTargets;

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
