import { createError, setHeader } from 'h3';
import JSZip from 'jszip';
import { promises as fs } from 'node:fs';
import { join, resolve } from 'node:path';

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
    const publicDir = join(process.cwd(), 'public');
    const manifestPath = join(publicDir, 'press', 'manifest.json');

    let manifest: PressManifest;

    try {
        const manifestRaw = await fs.readFile(manifestPath, 'utf-8');
        manifest = JSON.parse(manifestRaw) as PressManifest;
    } catch (error) {
        console.error('[press-kit] Manifest read failed', error);
        throw createError({ statusCode: 500, statusMessage: 'Unable to load press kit manifest.' });
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
        throw createError({ statusCode: 404, statusMessage: 'No press kit assets found.' });
    }

    const zip = new JSZip();

    for (const originalPath of filePaths) {
        const normalizedPath = originalPath.replace(/^\/+/, '');
        const absolutePath = resolve(publicDir, normalizedPath);

        if (!absolutePath.startsWith(publicDir)) {
            console.warn('[press-kit] Ignored path outside public directory:', originalPath);
            continue;
        }

        try {
            const fileBuffer = await fs.readFile(absolutePath);
            zip.file(normalizedPath, fileBuffer);
        } catch (error) {
            console.error('[press-kit] Unable to add asset to zip:', originalPath, error);
            throw createError({ statusCode: 500, statusMessage: 'Failed to assemble press kit.' });
        }
    }

    const archive = await zip.generateAsync({
        type: 'nodebuffer',
        compression: 'DEFLATE',
        compressionOptions: { level: 9 },
    });

    setHeader(event, 'Content-Type', 'application/zip');
    setHeader(event, 'Content-Disposition', 'attachment; filename="AVefi_PressKit.zip"');

    return archive;
});
