#!/usr/bin/env node
import sharp from 'sharp';
import { existsSync, mkdirSync, readdirSync, rmSync } from 'fs';
import { dirname, join, parse } from 'path';
import {
  WEBP_QUALITY,
  getDeclaredOutputs,
  getManagedFamilyPrefixes,
  getManagedKeepSet,
  imageJobs,
  isRetiredImagePath,
  publicDir,
} from './image-manifest.mjs';

const flags = new Set(process.argv.slice(2));
const isCheckMode = flags.has('--check');
const shouldClean = flags.has('--clean');
const isDryRun = flags.has('--dry-run');

const imgDir = join(publicDir, 'img');

const normalizeRelPath = (relPath) => relPath.replace(/\\/g, '/');

const ensureDirectory = (absolutePath) => {
  const outputDir = dirname(absolutePath);
  if (!existsSync(outputDir) && !isDryRun) {
    mkdirSync(outputDir, { recursive: true });
  }
};

const createResponsiveImage = async (job, outputConfig) => {
  const inputPath = join(publicDir, job.input);
  const outputPath = join(publicDir, outputConfig.output);

  if (!existsSync(inputPath)) {
    throw new Error(`Missing input file: ${job.input}`);
  }

  ensureDirectory(outputPath);

  if (isDryRun) {
    console.log(`DRY RUN create ${outputConfig.output} from ${job.input}`);
    return;
  }

  await sharp(inputPath)
    .resize(outputConfig.width, null, {
      withoutEnlargement: true,
      fit: 'inside',
    })
    .webp({ quality: WEBP_QUALITY })
    .toFile(outputPath);

  const stats = await sharp(outputPath).metadata();
  console.log(`Created ${outputConfig.output} (${stats.width}x${stats.height})`);
};

const createFixedHeightLogo = async (job) => {
  const inputPath = join(publicDir, job.input);
  const outputPath = join(publicDir, job.output);

  if (!existsSync(inputPath)) {
    throw new Error(`Missing input file: ${job.input}`);
  }

  ensureDirectory(outputPath);

  if (isDryRun) {
    console.log(`DRY RUN create ${job.output} from ${job.input}`);
    return;
  }

  await sharp(inputPath)
    .resize({ height: job.height, fit: 'contain' })
    .webp({ quality: WEBP_QUALITY })
    .toFile(outputPath);

  const stats = await sharp(outputPath).metadata();
  console.log(`Created ${job.output} (${stats.width}x${stats.height})`);
};

const runGeneration = async () => {
  for (const job of imageJobs) {
    if (job.kind === 'responsive') {
      for (const output of job.outputs) {
        await createResponsiveImage(job, output);
      }
      continue;
    }

    await createFixedHeightLogo(job);
  }
};

const collectStaleManagedFiles = () => {
  const keepSet = getManagedKeepSet();
  const familyPrefixes = getManagedFamilyPrefixes();

  return readdirSync(imgDir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => normalizeRelPath(join('img', entry.name)))
    .filter((relPath) => {
      if (keepSet.has(relPath)) {
        return false;
      }

      if (isRetiredImagePath(relPath)) {
        return true;
      }

      const parsed = parse(relPath);
      const fileBasePath = normalizeRelPath(join(parsed.dir, parsed.name));

      return familyPrefixes.some((prefix) => fileBasePath === prefix || fileBasePath.startsWith(`${prefix}-`));
    });
};

const cleanStaleManagedFiles = () => {
  const staleFiles = collectStaleManagedFiles();

  if (staleFiles.length === 0) {
    console.log('No stale managed image files found.');
    return;
  }

  for (const relPath of staleFiles) {
    const absolutePath = join(publicDir, relPath);

    if (isDryRun) {
      console.log(`DRY RUN remove ${relPath}`);
      continue;
    }

    rmSync(absolutePath, { force: true });
    console.log(`Removed stale file ${relPath}`);
  }
};

const runChecks = () => {
  const missingInputs = imageJobs
    .map((job) => job.input)
    .filter((input) => !existsSync(join(publicDir, input)));

  const missingOutputs = getDeclaredOutputs()
    .filter((output) => !existsSync(join(publicDir, output)));

  if (missingInputs.length > 0) {
    console.error('Missing input images:');
    for (const input of missingInputs) {
      console.error(`- ${input}`);
    }
  }

  if (missingOutputs.length > 0) {
    console.error('Missing generated output images:');
    for (const output of missingOutputs) {
      console.error(`- ${output}`);
    }
  }

  const staleFiles = collectStaleManagedFiles();
  if (staleFiles.length > 0) {
    console.error('Stale managed image files present:');
    for (const relPath of staleFiles) {
      console.error(`- ${relPath}`);
    }
  }

  if (missingInputs.length > 0 || missingOutputs.length > 0 || staleFiles.length > 0) {
    process.exitCode = 1;
    return;
  }

  console.log('Image check passed.');
};

const run = async () => {
  if (isCheckMode) {
    runChecks();
    return;
  }

  await runGeneration();

  if (shouldClean) {
    cleanStaleManagedFiles();
  }
};

run().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
