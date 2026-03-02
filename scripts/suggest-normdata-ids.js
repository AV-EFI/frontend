// scripts/suggest-normdata-ids.js
// Suggest normdata IDs for genre/subject values using lobid-gnd + Wikidata
//
// Usage (ESM):
//   node ./scripts/suggest-normdata-ids.js input.json > output.json
//   node ./scripts/suggest-normdata-ids.js input.csv  > output.json
//   node ./scripts/suggest-normdata-ids.js input.csv output.json
//
// PowerShell (context on/off):
//   $env:GND_WITH_CONTEXT="1"; node ./scripts/suggest-normdata-ids.js input.csv > output.json
//   $env:DEBUG_GND="1"; $env:GND_WITH_CONTEXT="1"; node ./scripts/suggest-normdata-ids.js input.csv > output.json
//
// Notes:
// - GND search uses lobid: https://lobid.org/gnd/search
// - Detail/context (parents etc.) uses: https://lobid.org/gnd/<ID>.json
// - Output includes:
//   - gnd_uri (canonical)     => https://d-nb.info/gnd/<ID>
//   - gnd_lobid_json (API)    => https://lobid.org/gnd/<ID>.json
//   - gnd_explorer (human UI) => https://explore.gnd.network/gnd/<ID>

import fetch from "node-fetch";
import fs from "fs";
import path from "path";

/* ----------------------------- small utilities ---------------------------- */

function cleanQuery(value) {
    return String(value ?? "").replace(/^"|"$/g, "").trim();
}

function asArray(x) {
    return Array.isArray(x) ? x : x ? [x] : [];
}

function pickId(x) {
    if (!x) return null;
    if (typeof x === "string") return x;
    if (typeof x === "object") return x.id || x["@id"] || null;
    return null;
}

function extractGndId(idOrUrl) {
    const raw = String(idOrUrl ?? "").trim();
    if (!raw) return null;
    // Accept: "1098433076" or "https://d-nb.info/gnd/1098433076" or "https://lobid.org/gnd/1098433076"
    const m = raw.match(/(?:d-nb\.info\/gnd\/|lobid\.org\/gnd\/)?(\d{6,})/);
    return m ? m[1] : null;
}

function uniq(arr) {
    return Array.from(new Set(arr.filter(Boolean)));
}

/* ------------------------------ GND: context ------------------------------ */

function extractContext(detail) {
    // JSON-LD can vary: objects with {id}, strings, arrays.
    const broaderCandidates = [
        ...asArray(detail?.broaderTerm),
        ...asArray(detail?.broaderTermPartitive),
        ...asArray(detail?.broaderTermInstantial),
    ];

    const broaderIds = uniq(broaderCandidates.map(pickId));
    const parentId = broaderIds.length ? broaderIds[0] : null;

    const relatedIds = uniq(asArray(detail?.relatedTerm).map(pickId));
    const narrowerIds = uniq(asArray(detail?.narrowerTerm).map(pickId));

    return {
        gnd_parent_id: parentId,
        gnd_broader_ids: broaderIds,
        gnd_related_ids: relatedIds,
        gnd_narrower_ids: narrowerIds,
    };
}

const gndDetailCache = new Map(); // gndId -> detail json or null

async function fetchGndDetailById(gndId) {
    if (!gndId) return null;
    if (gndDetailCache.has(gndId)) return gndDetailCache.get(gndId);

    const url = `https://lobid.org/gnd/${gndId}.json`;
    try {
        const res = await fetch(url, { headers: { accept: "application/json" } });
        if (!res.ok) {
            if (process.env.DEBUG_GND) console.warn("GND DETAIL HTTP", res.status, url);
            gndDetailCache.set(gndId, null);
            return null;
        }
        const json = await res.json();
        gndDetailCache.set(gndId, json);
        return json;
    } catch (e) {
        if (process.env.DEBUG_GND) console.error("GND DETAIL ERROR", gndId, e);
        gndDetailCache.set(gndId, null);
        return null;
    }
}

/* ------------------------------- GND: search ------------------------------ */

function preferredNameOf(d) {
    return String(d?.preferredName ?? "").trim();
}
function variantsOf(d) {
    return Array.isArray(d?.variantName) ? d.variantName.map((v) => String(v).trim()).filter(Boolean) : [];
}

function isFilmish(d) {
    // Heuristic: some records include gndSubjectCategory entries; we bias towards ones mentioning Film.
    const cats = asArray(d?.gndSubjectCategory)
        .map((c) => (typeof c === "string" ? c : c?.label || c?.preferredName || c?.id || c?.["@id"] || ""))
        .join(" ")
        .toLowerCase();
    return cats.includes("film");
}

function scoreCandidate(doc, normalizedQuery) {
    const pref = preferredNameOf(doc).toLowerCase();
    const vars = variantsOf(doc).map((v) => v.toLowerCase());

    let score = 0;

    if (pref === normalizedQuery) score += 1000;
    if (vars.some((v) => v === normalizedQuery)) score += 900;
    if (pref.includes(normalizedQuery)) score += 300;
    if (vars.some((v) => v.includes(normalizedQuery))) score += 250;

    // Bias towards "film-ish" subject categories if present.
    if (isFilmish(doc)) score += 50;

    // Prefer entries that actually have a numeric gndIdentifier/id we can extract.
    const gndId = extractGndId(doc?.gndIdentifier || doc?.id);
    if (gndId) score += 20;

    return score;
}

/**
 * Query GND via lobid for a string, return best match.
 * Uses SubjectHeading filter by default (as you requested).
 */
async function queryGND(value) {
    const q = cleanQuery(value);
    if (!q) return null;

    const url =
        `https://lobid.org/gnd/search?q=${encodeURIComponent(q)}` +
        `&filter=%2B(type:SubjectHeading)&format=json`;

    try {
        const res = await fetch(url, { headers: { accept: "application/json" } });
        if (!res.ok) {
            if (process.env.DEBUG_GND) console.warn("GND SEARCH HTTP", res.status, url);
            return null;
        }

        const data = await res.json();
        const members = Array.isArray(data?.member) ? data.member : [];
        if (!members.length) return null;

        const normalized = q.toLowerCase();

        // pick best by score
        let best = null;
        let bestScore = -Infinity;
        for (const m of members) {
            const s = scoreCandidate(m, normalized);
            if (s > bestScore) {
                best = m;
                bestScore = s;
            }
        }
        if (!best) return null;

        const gndId = extractGndId(best?.gndIdentifier || best?.id);
        const matchType =
            preferredNameOf(best).toLowerCase() === normalized
                ? "preferred_exact"
                : variantsOf(best).some((v) => v.toLowerCase() === normalized)
                    ? "variant_exact"
                    : preferredNameOf(best).toLowerCase().includes(normalized)
                        ? "preferred_contains"
                        : "ranked_best";

        let context = {};
        if (process.env.GND_WITH_CONTEXT === "1" && gndId) {
            const detail = await fetchGndDetailById(gndId);
            if (detail) context = extractContext(detail);
        }

        const out = {
            gndIdentifier: gndId || null,
            preferredName: preferredNameOf(best) || null,
            variantName: variantsOf(best),
            type: Array.isArray(best?.type) ? best.type : [],
            matchType,

            // links
            gnd_uri: gndId ? `https://d-nb.info/gnd/${gndId}` : null,
            gnd_lobid_json: gndId ? `https://lobid.org/gnd/${gndId}.json` : null,
            gnd_explorer: gndId ? `https://explore.gnd.network/gnd/${gndId}` : null,

            // context
            ...context,
        };

        //if (process.env.DEBUG_GND) console.log("GND MATCH:", q, out);
        return out;
    } catch (e) {
        if (process.env.DEBUG_GND) console.error("GND ERROR:", e);
        return null;
    }
}

/* ------------------------------ Wikidata query ---------------------------- */

// Cache because genres repeat a lot
const wikidataCache = new Map(); // q -> QID|null

/**
 * Query Wikidata via SPARQL with an exact-label preference (de/en).
 * Returns a Q-ID or null.
 */
async function queryWikidata(value) {
    const q = cleanQuery(value);
    if (!q) return null;

    if (wikidataCache.has(q)) return wikidataCache.get(q);

    // Escape quotes for SPARQL string literals
    const qEsc = q.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

    // Exact label match first (de/en). This avoids a lot of wbsearch noise.
    const sparql = `
SELECT ?item WHERE {
  VALUES ?label { "${qEsc}"@de "${qEsc}"@en }
  ?item rdfs:label ?label .
}
LIMIT 5
`.trim();

    const url = "https://query.wikidata.org/sparql?format=json&query=" + encodeURIComponent(sparql);

    try {
        const res = await fetch(url, {
            headers: {
                accept: "application/sparql-results+json",
                // Wikidata requests a UA; put something stable here.
                "user-agent": "avefi-normdata-ids/1.0 (normdata enrichment; contact: av-efi)",
            },
        });

        if (!res.ok) {
            if (process.env.DEBUG_WD) console.warn("WD HTTP", res.status);
            wikidataCache.set(q, null);
            return null;
        }

        const data = await res.json();
        const bindings = data?.results?.bindings || [];
        if (!bindings.length) {
            wikidataCache.set(q, null);
            return null;
        }

        const iri = bindings[0]?.item?.value || "";
        const qid = iri.split("/").pop() || null;

        wikidataCache.set(q, qid);
        return qid;
    } catch (e) {
        if (process.env.DEBUG_WD) console.error("WD ERROR", e);
        wikidataCache.set(q, null);
        return null;
    }
}

/* --------------------------- main suggestion runner ------------------------ */

/**
 * @param {Array<{value: string, normdata_id?: string}>} values
 */
async function suggestNormdataIds(values) {
    const results = [];

    for (const item of values) {
        const value = item?.value ?? item?.genre ?? item?.subject ?? "";
        const normdata_id = item?.normdata_id ?? item?.id ?? undefined;

        let gndResult = null;
        let wikidata = null;

        if (!normdata_id) {
            gndResult = await queryGND(value);
            wikidata = await queryWikidata(value);
        }

        results.push({
            genre: value,

            gnd_id: normdata_id || gndResult?.gndIdentifier || null,
            gnd_label: gndResult?.preferredName || null,
            gnd_type: gndResult?.type || [],
            gnd_match_type: gndResult?.matchType || null,

            // links
            gnd_uri: gndResult?.gnd_uri || (normdata_id ? `https://d-nb.info/gnd/${normdata_id}` : null),
            gnd_lobid_json:
                gndResult?.gnd_lobid_json || (normdata_id ? `https://lobid.org/gnd/${normdata_id}.json` : null),
            gnd_explorer:
                gndResult?.gnd_explorer || (normdata_id ? `https://explore.gnd.network/gnd/${normdata_id}` : null),

            // synonyms
            gnd_synonyms: gndResult?.variantName || [],

            // context (parents etc.) — only filled when GND_WITH_CONTEXT=1
            gnd_parent_id: gndResult?.gnd_parent_id ?? null,
            gnd_broader_ids: gndResult?.gnd_broader_ids ?? [],
            gnd_related_ids: gndResult?.gnd_related_ids ?? [],
            gnd_narrower_ids: gndResult?.gnd_narrower_ids ?? [],

            wikidata_id: wikidata || null,
        });
    }

    return results;
}

export { suggestNormdataIds, queryGND, queryWikidata };

/* ---------------------------------- CLI ---------------------------------- */

// Helper to parse CSV (semicolon delimiter, quoted values)
function parseCSV(data) {
    const lines = data.split("\n").filter((l) => l.trim());
    if (!lines.length) return [];

    const header = lines[0].split(";").map((h) => h.replace(/"/g, "").trim());

    return lines.slice(1).map((line) => {
        const values = line.match(/("[^"]*"|[^;]+)/g) || [];
        const obj = {};
        header.forEach((h, i) => {
            let v = values[i] || "";
            v = v.replace(/^"|"$/g, "").trim();
            obj[h] = v;
        });
        return obj;
    });
}

function normalizeInput(values) {
    return values.map((v) => {
        if (typeof v === "string") return { value: v };
        const firstKey = v && typeof v === "object" ? Object.keys(v)[0] : null;
        return {
            value: v.value || v.genre || v.subject || (firstKey ? v[firstKey] : ""),
            normdata_id: v.normdata_id || v.id || undefined,
        };
    });
}

async function main() {
    const inputFile = process.argv[2];
    const outputFile = process.argv[3];

    if (!inputFile) {
        console.error("Usage: node suggest-normdata-ids.js <input.json|input.csv> [output.json]");
        process.exit(1);
    }

    const ext = path.extname(inputFile).toLowerCase();
    const raw = fs.readFileSync(inputFile, "utf8");

    let values = [];
    if (ext === ".json") values = JSON.parse(raw);
    else if (ext === ".csv") values = parseCSV(raw);
    else {
        console.error("Unsupported file type. Use .json or .csv");
        process.exit(1);
    }

    values = normalizeInput(values);

    const results = await suggestNormdataIds(values);
    const jsonOut = JSON.stringify(results, null, 2);

    if (outputFile) fs.writeFileSync(outputFile, jsonOut, { encoding: "utf8" });
    else process.stdout.write(jsonOut);
}

// Run as CLI when invoked directly
if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, "/"))) {
    main().catch((e) => {
        console.error(e);
        process.exit(1);
    });
}