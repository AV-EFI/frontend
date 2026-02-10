// server/api/vocab/[field].get.ts
import { defineEventHandler, getRouterParam, getQuery, createError } from 'h3';

type WhitelistKey = 'has_subject' | 'has_genre' | 'has_form' // extend as needed

interface FieldConfig {
  // ES field for the VALUE (terms agg target)
  valueField: string
  // We'll use top_hits and then these paths to *try* to extract normdata + provider
  // Adapt these to your real mapping.
  normdataPath: string[]
  providerPath: string[]
    filterNestedPath?: string
    filterMatchField?: string
}

const WHITELIST: Record<WhitelistKey, FieldConfig> = {
    has_subject: {
        valueField: 'has_record.has_subject.has_name.keyword',
        // Path to the array containing same_as: has_record.has_subject[]
        normdataPath: ['has_record', 'has_subject'],
        // Based on mapping: has_record.described_by.has_issuer_name
        providerPath: ['has_record', 'described_by', 'has_issuer_name'],
        filterNestedPath: 'has_record.has_subject',
        filterMatchField: 'has_record.has_subject.has_name',
    },
    has_genre: {
        valueField: 'has_record.has_genre.has_name.keyword',
        // Path to the array containing same_as: has_record.has_genre[]
        normdataPath: ['has_record', 'has_genre'],
        // Based on mapping: has_record.described_by.has_issuer_name
        providerPath: ['has_record', 'described_by', 'has_issuer_name'],
        filterNestedPath: 'has_record.has_genre',
        filterMatchField: 'has_record.has_genre.has_name',
    },
    has_form: {
        valueField: 'has_record.has_form.keyword',
        // has_form is just text, no nested same_as in the mapping
        normdataPath: [],
        // Based on mapping: has_record.described_by.has_issuer_name
        providerPath: ['has_record', 'described_by', 'has_issuer_name'],
    },
};

function getNested(source: any, path: string[]): any {
    let cur: any = source;
    for (const key of path) {
        if (cur == null) return null;
        // allow numeric keys as array indices
        const idx = Number.isInteger(+key) ? +key : key;
        cur = cur[idx];
    }
    return cur;
}

function extractNormdataRefs(source: any, basePath: string[], targetValue: string): Array<{ id: string; category: string }> {
    const results: Array<{ id: string; category: string }> = [];
  
    // Navigate to the base (e.g., has_record.has_subject)
    let cur: any = source;
    for (const key of basePath) {
        if (cur == null) return results;
        cur = cur[key];
    }
  
    // cur should now be an array of objects with has_name and same_as
    if (!Array.isArray(cur)) return results;
  
    for (const item of cur) {
    // Only extract normdata from items that match the target value
        if (item?.has_name === targetValue) {
            const sameAsArray = item?.same_as;
            if (Array.isArray(sameAsArray)) {
                for (const ref of sameAsArray) {
                    if (ref?.id) {
                        results.push({
                            id: String(ref.id),
                            category: ref.category ? String(ref.category) : '',
                        });
                    }
                }
            }
        }
    }
  
    return results;
}

export default defineEventHandler(async (event) => {
    const fieldParam = getRouterParam(event, 'field') as WhitelistKey | undefined;
    if (!fieldParam || !WHITELIST[fieldParam]) {
        throw createError({ statusCode: 400, statusMessage: 'Field not allowed' });
    }

    const cfg = WHITELIST[fieldParam];

    // Get query parameters for server-side filtering
    const query = getQuery(event);
    const letter = query.letter as string | undefined;
    const isExport = query.export === 'true';
    const filterTextRaw = typeof query.filter === 'string' ? query.filter : undefined;
    const filterText = filterTextRaw?.trim() ? filterTextRaw.trim() : undefined;
    const queryFilters: any[] = [];

    // ⬇️ Adapt to your runtimeConfig
    const config = useRuntimeConfig();
    const esHost = config.elasticsearch?.host || process.env.ELASTIC_HOST_PUBLIC || process.env.ELASTIC_HOST_INTERNAL;
    const esIndex = config.elasticsearch?.index || process.env.ELASTIC_INDEX;
    const esApiKey = config.elasticsearch?.apiKey || process.env.ELASTIC_APIKEY;

    if (!esHost || !esIndex) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Elasticsearch host/index not configured',
        });
    }

    // Build the aggregation with optional regex filter for letter
    const termsAgg: any = {
        field: cfg.valueField,
        size: isExport ? 100000 : 10000, // Much higher limit for exports
        order: { _key: 'asc' },
    };

    // Add regex include filter if letter is specified
    if (letter && letter.length === 1) {
    // Case-insensitive regex to match values starting with the letter
        termsAgg.include = `[${letter.toUpperCase()}${letter.toLowerCase()}].*`;
    }

    if (filterText) {
        const escapedFilter = filterText.replace(/[\\*?]/g, '\\$&');
        const containsWildcards = /[*?]/.test(filterText);

        const clauses: any[] = [
            {
                wildcard: {
                    [cfg.valueField]: {
                        value: `*${escapedFilter}*`,
                        case_insensitive: true,
                    },
                },
            },
        ];

        if (!containsWildcards) {
            clauses.push({
                term: {
                    [cfg.valueField]: filterText,
                },
            });
        }

        if (cfg.filterMatchField) {
            clauses.push({
                match_phrase: {
                    [cfg.filterMatchField]: filterText,
                },
            });
        }

        queryFilters.push({
            bool: {
                should: clauses,
                minimum_should_match: 1,
            },
        });
    }

    const body = {
        size: 0,
        ...(queryFilters.length
            ? {
                query: {
                    bool: {
                        filter: queryFilters,
                    },
                },
            }
            : {}),
        aggs: {
            values: {
                terms: termsAgg,
                aggs: {
                    // Get multiple documents per value to capture all normdata variations
                    all_docs: {
                        top_hits: {
                            size: 5, // reduced to 5 to lower the overall query size
                            _source: true,
                        },
                    },
                },
            },
        },
    };

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (esApiKey) {
        headers.Authorization = `ApiKey ${esApiKey}`;
    }

    let res: any;
    try {
        res = await $fetch(`${esHost}/${esIndex}/_search`, {
            method: 'POST',
            headers,
            body,
            timeout: 5000, // 5 second timeout
        });
    } catch (error: any) {
        console.error('Elasticsearch query failed:', error);
        throw createError({
            statusCode: 502,
            statusMessage: `Elasticsearch connection failed: ${error.message}`,
        });
    }

    const buckets = res?.aggregations?.values?.buckets || [];

    const rows = buckets.map((b: any) => {
        const hits = b.all_docs?.hits?.hits || [];
    
        // Collect all unique normdata refs from ALL documents with this value
        const allNormdataRefs: Array<{ id: string; category: string }> = [];
        const seenRefs = new Set<string>();
        const providers = new Set<string>();

        for (const hit of hits) {
            const source = hit._source ?? {};
      
            // Extract normdata from this document, filtering by the exact value
            if (cfg.normdataPath.length > 0) {
                const refs = extractNormdataRefs(source, cfg.normdataPath, b.key);
                for (const ref of refs) {
                    const key = `${ref.id}|${ref.category}`;
                    if (!seenRefs.has(key)) {
                        seenRefs.add(key);
                        allNormdataRefs.push(ref);
                    }
                }
            }
      
            // Collect all providers - described_by is an array
            const describedBy = source?.has_record?.described_by;
            if (Array.isArray(describedBy)) {
                for (const desc of describedBy) {
                    const issuerName = desc?.has_issuer_name;
                    if (issuerName && typeof issuerName === 'string') {
                        providers.add(issuerName);
                    }
                }
            } else if (describedBy && typeof describedBy === 'object') {
                // Handle single object case (if not an array)
                const issuerName = describedBy.has_issuer_name;
                if (issuerName && typeof issuerName === 'string') {
                    providers.add(issuerName);
                }
            }
        }

        return {
            value: b.key,
            docCount: b.doc_count,
            normdataRefs: allNormdataRefs,
            provider: providers.size > 0 ? Array.from(providers).join(', ') : null,
        };
    });

    // If export mode, return CSV directly
    if (isExport) {
        const header = ['value', 'normdata_id', 'normdata_category', 'provider', 'docCount'];
        const lines = [header.join(';')];
    
        for (const r of rows) {
            if (r.normdataRefs.length > 0) {
                // One row per normdata reference
                for (const ref of r.normdataRefs) {
                    lines.push(
                        [
                            r.value,
                            ref.id,
                            ref.category,
                            r.provider || '',
                            String(r.docCount),
                        ]
                            .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
                            .join(';')
                    );
                }
            } else {
                // No normdata, single row
                lines.push(
                    [
                        r.value,
                        '',
                        '',
                        r.provider || '',
                        String(r.docCount),
                    ]
                        .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
                        .join(';')
                );
            }
        }

        event.node.res.setHeader('Content-Type', 'text/csv;charset=utf-8;');
        event.node.res.setHeader('Content-Disposition', `attachment; filename="vocab_${fieldParam}_export.csv"`);
        return lines.join('\r\n');
    }

    // Normal mode: limit to 100 results for display
    const limitedRows = rows.slice(0, 1000);

    return {
        field: fieldParam,
        count: limitedRows.length,
        total: rows.length,
        rows: limitedRows,
    };
});
