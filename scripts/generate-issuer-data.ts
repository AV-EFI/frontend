#!/usr/bin/env ts-node
/**
 * scripts/generate-issuer-data.ts
 * Fetches top issuers from Elasticsearch and generates a static data file
 * 
 * Usage:
 *   ELASTIC_HOST="https://..." ELASTIC_INDEX="index-name" ts-node scripts/generate-issuer-data.ts
 */
import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { config as loadEnv } from 'dotenv';
import { $fetch } from 'ofetch';

interface Issuer {
  name: string;
  id: string | null;
  doc_count: number;
}

const DEFAULT_TOP_ISSUERS_INDEX = '21.11155-denormalised-work';

function buildBackendAlignedTopIssuersQuery(size = 20) {
    return {
        query: {
            bool: {
                should: [
                    {
                        multi_match: {
                            query: '',
                            fields: [
                                'has_record.has_primary_title.has_name^2',
                                'has_record.has_alternative_title.has_name^1',
                                'parents.has_record.has_primary_title.has_name^1.5',
                                'directors_or_editors^2.5',
                                'subjects^1',
                                'years^1',
                                'production^1',
                            ],
                            zero_terms_query: 'all',
                            type: 'phrase',
                        },
                    },
                ],
                minimum_should_match: 1,
            },
        },
        size: 0,
        aggs: {
            manifestations: {
                nested: {
                    path: 'manifestations',
                },
                aggs: {
                    issuers_by_name: {
                        terms: {
                            field: 'manifestations.has_record.described_by.has_issuer_name.keyword',
                            size,
                            order: {
                                handle_count: 'desc',
                            },
                        },
                        aggs: {
                            handle_count: {
                                cardinality: {
                                    field: 'manifestations.handle.keyword',
                                },
                            },
                            issuer_ids: {
                                terms: {
                                    field: 'manifestations.has_record.described_by.has_issuer_id.keyword',
                                    size: 1,
                                },
                            },
                        },
                    },
                },
            },
        },
    };
}

function loadLocalEnv() {
    const cwd = process.cwd();
    const envFiles = ['.env.local', '.env'];

    for (const file of envFiles) {
        const fullPath = path.resolve(cwd, file);
        if (fs.existsSync(fullPath)) {
            loadEnv({ path: fullPath, override: false });
        }
    }
}

async function generateIssuerData() {
    loadLocalEnv();
    console.log('[generate-issuer-data] Starting...');

    const esHost = process.env.ELASTIC_HOST_PUBLIC || process.env.ELASTIC_HOST;
    const esIndex =
        process.env.ELASTIC_TOP_ISSUERS_INDEX ||
        process.env.ELASTIC_GWDG_INDEX ||
        process.env.ELASTIC_INDEX ||
        DEFAULT_TOP_ISSUERS_INDEX;

    if (!esHost) {
        console.error('[generate-issuer-data] ERROR: ELASTIC_HOST / ELASTIC_HOST_PUBLIC must be set in env.');
        process.exit(1);
    }

    console.log(`[generate-issuer-data] Connecting to ${esHost}/${esIndex}`);

    const esBody = buildBackendAlignedTopIssuersQuery(20);

    const url = `${esHost}/${encodeURIComponent(esIndex)}/_search`;

    let res: any;
    try {
        res = await $fetch<any>(url, {
            method: 'POST',
            body: esBody,
        });
    } catch (err: any) {
        console.error(
            '[generate-issuer-data] ERROR while calling Elasticsearch:',
            err?.data || err?.message || err
        );
        process.exit(1);
    }

    const nameBuckets = res?.aggregations?.manifestations?.issuers_by_name?.buckets || [];

    if (!nameBuckets.length) {
        console.warn('[generate-issuer-data] No buckets returned, nothing to write.');
        process.exit(0);
    }

    const issuers: Issuer[] = nameBuckets.map((bucket: any) => ({
        name: bucket.key,
        id: bucket.issuer_ids?.buckets?.[0]?.key || null,
        doc_count: bucket.handle_count?.value ?? bucket.doc_count
    }));

    const outDir = path.resolve(process.cwd(), 'data');
    const outFile = path.join(outDir, 'top-issuers.json');

    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }

    const data = {
        generated_at: new Date().toISOString(),
        issuers
    };

    fs.writeFileSync(outFile, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`[generate-issuer-data] ✓ Written ${issuers.length} issuers to ${outFile}`);
    console.log('[generate-issuer-data] Top 5:', issuers.slice(0, 5).map(i => i.name));
}

generateIssuerData().catch((err) => {
    console.error('[generate-issuer-data] Unhandled ERROR:', err);
    process.exit(1);
});
