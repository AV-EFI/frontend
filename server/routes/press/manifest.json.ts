import { createError, setHeader } from 'h3';
import { promises as fs } from 'node:fs';
import { join } from 'node:path';

export default defineEventHandler(async (event) => {
    const manifestPath = join(process.cwd(), 'public', 'press', 'manifest.json');

    try {
        const manifestRaw = await fs.readFile(manifestPath, 'utf-8');
        setHeader(event, 'Content-Type', 'application/json');
        return JSON.parse(manifestRaw);
    } catch (error) {
        console.error('[press-manifest] Unable to read manifest', error);
        throw createError({ statusCode: 500, statusMessage: 'Unable to read press manifest.' });
    }
});
