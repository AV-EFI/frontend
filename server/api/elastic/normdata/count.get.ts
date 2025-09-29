import { defineEventHandler, getQuery } from 'h3';

type Cfg = {
  ES_URL: string
  ES_INDEX: string
  ES_APIKEY?: string
  ES_USERNAME?: string
  ES_PASSWORD?: string
}

// .env-Anpassung: Host/Index nach deiner Variablenkonvention
function cfgFromEnv(): Cfg {
    const host =
    process.env.ELASTIC_HOST_INTERNAL ||
    process.env.ELASTIC_GWDG_HOST ||
    process.env.ELASTIC_HOST_PUBLIC ||
    'http://localhost:9200';

    const index =
    process.env.ELASTIC_INDEX ||
    process.env.ELASTIC_GWDG_INDEX ||
    '21.11155-denormalised-work';

    return {
        ES_URL: host,
        ES_INDEX: index,
        ES_APIKEY: process.env.ELASTI_APIKEY, // ApiKey (optional)
        ES_USERNAME: process.env.ELASTIC_USERNAME, // optional Fallback
        ES_PASSWORD: process.env.ELASTIC_PASSWORD, // optional Fallback
    };
}

function nestedPathFor(field: string): string | null {
    if (field.startsWith('manifestations.items.')) return 'manifestations.items';
    if (field.startsWith('manifestations.')) return 'manifestations';
    return null;
}

async function countForField(field: string, cfg: Cfg): Promise<number> {
    const isNested = nestedPathFor(field);
    const url = `${cfg.ES_URL.replace(/\/+$/, '')}/${encodeURIComponent(cfg.ES_INDEX)}/_search`;

    const query = isNested
        ? {
            query: {
                nested: {
                    path: isNested,
                    ignore_unmapped: true,
                    query: { exists: { field } },
                },
            },
            size: 0,
            track_total_hits: true,
        }
        : {
            query: { exists: { field } },
            size: 0,
            track_total_hits: true,
        };

    const headers: Record<string, string> = { 'content-type': 'application/json' };
    if (cfg.ES_APIKEY) {
        headers['authorization'] = `ApiKey ${cfg.ES_APIKEY}`;
    } else if (cfg.ES_USERNAME && cfg.ES_PASSWORD) {
        const token = Buffer.from(`${cfg.ES_USERNAME}:${cfg.ES_PASSWORD}`).toString('base64');
        headers['authorization'] = `Basic ${token}`;
    }

    const res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(query),
    });

    if (!res.ok) {
    // Log + 0 zurückgeben, damit die Seite robust bleibt
        const text = await res.text().catch(() => '');
        console.error('ES error', { field, status: res.status, text });
        return 0;
    }

    const json: any = await res.json();
    const total = typeof json.hits?.total === 'number' ? json.hits.total : json.hits?.total?.value;
    return typeof total === 'number' ? total : 0;
}

export default defineEventHandler(async (event) => {
    const q = getQuery(event);
    let fields: string[] = [];
    if (Array.isArray(q.field)) fields = q.field as string[];
    else if (typeof q.field === 'string') fields = (q.field as string).split(',').map((s) => s.trim()).filter(Boolean);

    if (!fields.length) return { counts: {} };

    const cfg = cfgFromEnv();
    const results = await Promise.allSettled(fields.map((f) => countForField(f, cfg)));
    const counts: Record<string, number> = {};

    results.forEach((r, i) => {
        const key = fields[i];
        counts[key] = r.status === 'fulfilled' ? r.value : 0;
    });

    return { counts };
});
