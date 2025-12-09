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
import { $fetch } from 'ofetch';

interface Issuer {
  name: string;
  id: string | null;
  doc_count: number;
}

async function generateIssuerData() {
    console.log('[generate-issuer-data] Starting...');

    const esHost = process.env.ELASTIC_HOST_PUBLIC || process.env.ELASTIC_HOST;
    const esIndex = process.env.ELASTIC_INDEX;

    if (!esHost || !esIndex) {
        console.error('[generate-issuer-data] ERROR: ELASTIC_HOST / ELASTIC_HOST_PUBLIC and ELASTIC_INDEX must be set in env.');
        process.exit(1);
    }

    console.log(`[generate-issuer-data] Connecting to ${esHost}/${esIndex}`);

    const esBody = {
        size: 0,
        aggs: {
            manifestations_nested: {
                nested: {
                    path: 'manifestations'
                },
                aggs: {
                    issuers_by_name: {
                        terms: {
                            field: 'manifestations.has_record.described_by.has_issuer_name.keyword',
                            size: 20,
                            order: {
                                _count: 'desc'
                            }
                        },
                        aggs: {
                            issuer_ids: {
                                terms: {
                                    field: 'manifestations.has_record.described_by.has_issuer_id.keyword',
                                    size: 1
                                }
                            }
                        }
                    }
                }
            }
        }
    };

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

    const nameBuckets = res?.aggregations?.manifestations_nested?.issuers_by_name?.buckets || [];

    if (!nameBuckets.length) {
        console.warn('[generate-issuer-data] No buckets returned, nothing to write.');
        process.exit(0);
    }

    const issuers: Issuer[] = nameBuckets.map((bucket: any) => ({
        name: bucket.key,
        id: bucket.issuer_ids?.buckets?.[0]?.key || null,
        doc_count: bucket.doc_count
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
