// server/api/press-kit.zip.ts
import {
  defineEventHandler,
  createError,
  setHeader,
  setResponseStatus,
} from 'h3';
import JSZip from 'jszip';
import { promises as fs } from 'node:fs';
import { join, resolve, relative } from 'node:path';

type ManifestFile = {
  label: string;
  path: string;
};

type ManifestItem = {
  id: string;
  files: ManifestFile[];
};

type ManifestSection = {
  id: string;
  items: ManifestItem[];
};

type PressManifest = {
  sections: ManifestSection[];
};

export default defineEventHandler(async (event) => {
  const publicDir = resolve(process.cwd(), 'public');
  const manifestPath = join(publicDir, 'press', 'manifest.json');

  let manifest: PressManifest;

  try {
    const manifestRaw = await fs.readFile(manifestPath, 'utf-8');
    manifest = JSON.parse(manifestRaw) as PressManifest;
  } catch (error) {
    console.error('[press-kit] Manifest read failed', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unable to load press kit manifest.',
    });
  }

  const filePaths = new Set<string>();

  for (const section of manifest.sections ?? []) {
    for (const item of section.items ?? []) {
      for (const file of item.files ?? []) {
        if (file.path) {
          filePaths.add(file.path);
        }
      }
    }
  }

  if (!filePaths.size) {
    throw createError({
      statusCode: 404,
      statusMessage: 'No press kit assets found.',
    });
  }

  const validatedFiles: Array<{
    originalPath: string;
    normalizedPath: string;
    absolutePath: string;
  }> = [];

  for (const originalPath of filePaths) {
    const normalizedPath = originalPath.replace(/^\/+/, '');
    const absolutePath = resolve(publicDir, normalizedPath);
    const rel = relative(publicDir, absolutePath);

    if (rel.startsWith('..') || rel.includes('\0')) {
      console.warn('[press-kit] Ignored path outside public directory:', originalPath);
      continue;
    }

    try {
      await fs.access(absolutePath);
      validatedFiles.push({ originalPath, normalizedPath, absolutePath });
    } catch (error) {
      console.error('[press-kit] Missing asset referenced by manifest:', originalPath, absolutePath, error);
      throw createError({
        statusCode: 500,
        statusMessage: `Missing press kit asset: ${originalPath}`,
      });
    }
  }

  if (!validatedFiles.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'No valid press kit assets found.',
    });
  }

  setHeader(event, 'Content-Type', 'application/zip');
  setHeader(event, 'Content-Disposition', 'attachment; filename="AVefi_PressKit.zip"');
  setHeader(event, 'Cache-Control', 'public, max-age=3600');

  if (event.method === 'HEAD') {
    setResponseStatus(event, 200);
    return '';
  }

  const zip = new JSZip();

  for (const file of validatedFiles) {
    try {
      const fileBuffer = await fs.readFile(file.absolutePath);
      zip.file(file.normalizedPath, fileBuffer);
    } catch (error) {
      console.error('[press-kit] Unable to add asset to zip:', file.originalPath, error);
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to assemble press kit.',
      });
    }
  }

  return await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  });
});