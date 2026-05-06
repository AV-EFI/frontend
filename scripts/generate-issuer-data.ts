#!/usr/bin/env ts-node
/**
 * scripts/generate-issuer-data.ts
 * Fetches top issuers from the frontend Search backend and generates a static data file.
 *
 * Usage:
 *   TOP_ISSUERS_BACKEND_BASE="http://localhost:8080/rest/v1" tsx scripts/generate-issuer-data.ts
 */
import fs from 'node:fs';
import path from 'node:path';
import { config as loadEnv } from 'dotenv';
import { $fetch } from 'ofetch';

interface Issuer {
    name: string;
    id: string | null;
    doc_count: number;
    category_counts: {
        'avefi:WorkVariant': number;
        'avefi:Manifestation': number;
        'avefi:Item': number;
    };
}

const DEFAULT_BACKEND_BASE = 'http://localhost:8080/rest/v1';
const DEFAULT_INDEX = '21.11155-denormalised-work';
const DEFAULT_SEARCH_PATH = 'frontend/search';

function loadLocalEnv() {
    const cwd = process.cwd();
    const envFiles = ['.env', '.env.local'];

    for (const file of envFiles) {
        const fullPath = path.resolve(cwd, file);
        if (fs.existsSync(fullPath)) {
            loadEnv({ path: fullPath, override: true });
        }
    }
}

function joinUrl(base: string, pathPart: string) {
    return `${base.replace(/\/+$/, '')}/${pathPart.replace(/^\/+/, '')}`;
}

function resolveBackendBase() {
    const configured =
        process.env.TOP_ISSUERS_BACKEND_BASE ||
        process.env.E2E_BACKEND_BASE ||
        process.env.PUBLIC_AVEFI_ELASTIC_API ||
        process.env.AVEFI_ELASTIC_API ||
        DEFAULT_BACKEND_BASE;

    return configured.startsWith('http')
        ? configured
        : joinUrl('http://localhost:8080', configured);
}

function searchPayload(params: Record<string, unknown>) {
    return [
        {
            indexName: process.env.ELASTIC_INDEX || DEFAULT_INDEX,
            params: {
                query: '',
                page: 0,
                ...params,
            },
        },
    ];
}

function parseSearchResult(response: any) {
    return (
        response?.results?.[0] ||
        response?.responses?.[0] ||
        response?.[0] ||
        null
    );
}

function errorStatus(err: any): number | null {
    return (
        err?.response?.status ||
        err?.status ||
        err?.statusCode ||
        null
    );
}

function errorDetails(err: any): string {
    const status = errorStatus(err);
    const data = err?.data || err?.response?._data;
    const message = err?.message || String(err);
    return `${status ? `[status ${status}] ` : ''}${data ? JSON.stringify(data) : message}`;
}

async function searchBackend(searchUrl: string, params: Record<string, unknown>) {
    const payload = searchPayload(params);

    try {
        const response = await $fetch<any>(searchUrl, {
            method: 'POST',
            body: payload,
        });

        return parseSearchResult(response);
    } catch (firstErr: any) {
        if (errorStatus(firstErr) !== 422) {
            throw firstErr;
        }

        // Some backend variants expect `{ requests: [...] }` instead of `[...]`.
        const response = await $fetch<any>(searchUrl, {
            method: 'POST',
            body: { requests: payload },
        });

        return parseSearchResult(response);
    }
}

function extractIssuerId(result: any, issuerName: string): string | null {
    for (const hit of result?.hits || []) {
        for (const manifestation of hit?.manifestations || []) {
            const describedBy = manifestation?.has_record?.described_by;
            if (describedBy?.has_issuer_name === issuerName && describedBy?.has_issuer_id) {
                return describedBy.has_issuer_id;
            }
        }
    }

    return null;
}

async function generateIssuerData() {
    loadLocalEnv();
    console.log('[generate-issuer-data] Starting...');

    const backendBase = resolveBackendBase();
    const searchPath = process.env.AVEFI_ELASTIC_API_SEARCH_ENDPOINT || process.env.AVEFI_SEARCH || DEFAULT_SEARCH_PATH;
    const searchUrl = joinUrl(backendBase, searchPath);
    const issuerLimit = Number(process.env.TOP_ISSUERS_LIMIT || 20);
    const outDir = path.resolve(process.cwd(), 'data');
    const outFile = path.join(outDir, 'top-issuers.json');

    console.log(`[generate-issuer-data] Fetching issuer counts from ${searchUrl}`);

    let facetResult: any;
    try {
        facetResult = await searchBackend(searchUrl, {
            hitsPerPage: 0,
            facets: ['has_issuer_name'],
        });
    } catch (err: any) {
        const fallbackAllowed = process.env.TOP_ISSUERS_FALLBACK_TO_EXISTING !== 'false';
        if (fallbackAllowed && fs.existsSync(outFile)) {
            console.warn(
                '[generate-issuer-data] Backend request failed, keeping existing data:',
                errorDetails(err)
            );
            console.warn(`[generate-issuer-data] Using existing file: ${outFile}`);
            return;
        }

        console.error('[generate-issuer-data] ERROR while calling Search backend:', errorDetails(err));
        process.exit(1);
    }

    const issuerNames = Object.entries(facetResult?.facets?.has_issuer_name || {})
        .sort(([, left], [, right]) => Number(right) - Number(left))
        .slice(0, issuerLimit)
        .map(([name]) => name);

    if (!issuerNames.length) {
        console.warn('[generate-issuer-data] No issuer facet values returned, nothing to write.');
        process.exit(0);
    }

    const issuers: Issuer[] = [];

    for (const issuerName of issuerNames) {
        const result = await searchBackend(searchUrl, {
            hitsPerPage: 5,
            facetFilters: [[`has_issuer_name:${issuerName}`]],
        });
        const manifestationCount = result?.nbManifestations ?? 0;

        issuers.push({
            name: issuerName,
            id: extractIssuerId(result, issuerName),
            doc_count: manifestationCount,
            category_counts: {
                'avefi:WorkVariant': result?.nbWorks ?? 0,
                'avefi:Manifestation': manifestationCount,
                'avefi:Item': result?.nbItems ?? 0,
            },
        });
    }

    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }

    const data = {
        generated_at: new Date().toISOString(),
        issuers,
    };

    fs.writeFileSync(outFile, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`[generate-issuer-data] Written ${issuers.length} issuers to ${outFile}`);
    console.log('[generate-issuer-data] Top 5:', issuers.slice(0, 5).map(i => i.name));
}

generateIssuerData().catch((err) => {
    console.error('[generate-issuer-data] Unhandled ERROR:', err);
    process.exit(1);
});
