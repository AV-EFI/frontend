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

    // Accept canonical IDs and URLs, e.g.:
    // - 1098433076
    // - 4079163-4
    // - 127756258X
    // - https://d-nb.info/gnd/4079163-4
    // - https://lobid.org/gnd/4079163-4.json
    // - https://explore.gnd.network/gnd/4079163-4
    let candidate = raw;

    const fromUrl = raw.match(/(?:d-nb\.info\/gnd\/|lobid\.org\/gnd\/|explore\.gnd\.network\/gnd\/)([^/?#]+)/i);
    if (fromUrl?.[1]) {
        candidate = fromUrl[1];
    }

    candidate = candidate.replace(/\.json$/i, "").trim();

    // Legacy GND with check digit after hyphen (e.g. 4079163-4, 4299903-8)
    if (/^\d{6,9}-[\dX]$/i.test(candidate)) return candidate.toUpperCase();

    // Compact canonical form used by some records (e.g. 1098433076, 127756258X)
    if (/^\d{9,10}[\dX]?$/i.test(candidate)) return candidate.toUpperCase();

    // Fallback for plain numeric fragments if present
    const numeric = candidate.match(/^(\d{6,10})$/);
    return numeric ? numeric[1] : null;
}

function uniq(arr) {
    return Array.from(new Set(arr.filter(Boolean)));
}

function extractViafId(value) {
    const raw = String(value ?? "").trim();
    if (!raw) return null;
    const m = raw.match(/viaf\.org\/(?:en\/)?viaf\/(\d+)/i);
    return m?.[1] || null;
}

function collectLinkedIds(value) {
    if (!value) return [];
    const arr = Array.isArray(value) ? value : [value];
    const out = [];
    for (const entry of arr) {
        if (typeof entry === "string") out.push(entry);
        else if (entry && typeof entry === "object") {
            if (entry.id) out.push(entry.id);
            if (entry["@id"]) out.push(entry["@id"]);
            if (entry.sameAs) out.push(...collectLinkedIds(entry.sameAs));
        }
    }
    return out;
}

function findViafId(...sources) {
    for (const source of sources) {
        const linked = collectLinkedIds(source);
        for (const idOrUri of linked) {
            const viafId = extractViafId(idOrUri);
            if (viafId) return viafId;
        }
    }
    return null;
}

function normalizeWikidataId(value) {
    const raw = String(value ?? "").trim();
    if (!raw) return null;

    const fromUrl = raw.match(/wikidata\.org\/wiki\/(Q\d+)/i);
    if (fromUrl?.[1]) return fromUrl[1].toUpperCase();

    const match = raw.match(/Q\d+/i);
    return match ? match[0].toUpperCase() : null;
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

function normalizeMatchText(value) {
    return String(value ?? "")
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\p{L}\p{N}]+/gu, " ")
        .trim();
}

function hasWholeToken(haystack, needle) {
    if (!haystack || !needle) return false;
    return haystack.split(" ").includes(needle);
}

function startsWithToken(haystack, needle) {
    if (!haystack || !needle) return false;
    return haystack.startsWith(`${needle} `) || haystack === needle;
}

const CONTEXT_STOPWORDS = new Set([
    "in",
    "im",
    "der",
    "die",
    "das",
    "des",
    "den",
    "dem",
    "und",
    "mit",
    "von",
    "vom",
    "zur",
    "zum",
    "für",
    "city",
    "town",
    "state",
]);

function extractContextTokens(text) {
    const normalized = normalizeMatchText(text);
    if (!normalized) return [];
    return uniq(
        normalized
            .split(" ")
            .map((token) => token.trim())
            .filter((token) => token.length >= 4 && !CONTEXT_STOPWORDS.has(token))
    );
}

function isPlaceCandidate(doc) {
    return asArray(doc?.type).includes("PlaceOrGeographicName");
}

function isFilmish(d) {
    // Heuristic: some records include gndSubjectCategory entries; we bias towards ones mentioning Film.
    const cats = asArray(d?.gndSubjectCategory)
        .map((c) => (typeof c === "string" ? c : c?.label || c?.preferredName || c?.id || c?.["@id"] || ""))
        .join(" ")
        .toLowerCase();
    return cats.includes("film");
}

function scoreCandidate(doc, normalizedQuery, options = {}) {
    const pref = normalizeMatchText(preferredNameOf(doc));
    const prefRaw = String(preferredNameOf(doc) ?? "").toLowerCase();
    const vars = variantsOf(doc).map((v) => normalizeMatchText(v));
    const isShortQuery = normalizedQuery.length > 0 && normalizedQuery.length <= 4;
    const contextTokens = Array.isArray(options.contextTokens) ? options.contextTokens : [];

    let score = 0;

    if (pref === normalizedQuery) score += 1000;
    if (vars.some((v) => v === normalizedQuery)) score += 900;

    if (startsWithToken(pref, normalizedQuery)) score += 550;
    if (vars.some((v) => startsWithToken(v, normalizedQuery))) score += 500;

    if (hasWholeToken(pref, normalizedQuery)) score += 450;
    if (vars.some((v) => hasWholeToken(v, normalizedQuery))) score += 400;

    if (!isShortQuery) {
        if (pref.includes(normalizedQuery)) score += 300;
        if (vars.some((v) => v.includes(normalizedQuery))) score += 250;
    }

    // Bias towards "film-ish" subject categories if present.
    if (isFilmish(doc)) score += 50;

    // Prefer entries that actually have a numeric gndIdentifier/id we can extract.
    const gndId = extractGndId(doc?.gndIdentifier || doc?.id);
    if (gndId) score += 20;

    if (contextTokens.length && isPlaceCandidate(doc)) {
        const corpus = `${pref} ${vars.join(" ")}`.trim();
        let contextHits = 0;
        for (const token of contextTokens) {
            if (hasWholeToken(corpus, token)) contextHits += 1;
        }
        score += contextHits * 600;
    }

    if (isPlaceCandidate(doc) && startsWithToken(pref, normalizedQuery)) {
        if (prefRaw.includes("(landkreis")) score += 1200;
        else if (prefRaw.includes("(kreis")) score += 900;
        else if (prefRaw.includes("(stadt")) score += 700;
    }

    return score;
}

const MIN_SCORE_FOR_MATCH = 250;
const MIN_SCORE_FOR_ACRONYM_MATCH = 900;

function isAcronymLikeQuery(query) {
    const raw = String(query ?? "").trim();
    if (!raw) return false;
    return /^[A-ZÄÖÜ0-9]{2,6}$/.test(raw);
}

function isExactOrVariantExact(doc, normalizedQuery) {
    const pref = normalizeMatchText(preferredNameOf(doc));
    const vars = variantsOf(doc).map((v) => normalizeMatchText(v));
    return pref === normalizedQuery || vars.some((v) => v === normalizedQuery);
}

function detectMatchType(doc, normalizedQuery) {
    const pref = normalizeMatchText(preferredNameOf(doc));
    const vars = variantsOf(doc).map((v) => normalizeMatchText(v));

    if (pref === normalizedQuery) return "preferred_exact";
    if (vars.some((v) => v === normalizedQuery)) return "variant_exact";
    if (pref.includes(normalizedQuery)) return "preferred_contains";
    return "ranked_best";
}

async function fetchGndMembers(url) {
    const res = await fetch(url, { headers: { accept: "application/json" } });
    if (!res.ok) {
        if (process.env.DEBUG_GND) console.warn("GND SEARCH HTTP", res.status, url);
        return [];
    }
    const data = await res.json();
    return Array.isArray(data?.member) ? data.member : [];
}

const wikidataEntityContextCache = new Map(); // QID -> token[]

async function fetchWikidataContextTokens(qid) {
    const normalizedQid = normalizeWikidataId(qid);
    if (!normalizedQid) return [];
    if (wikidataEntityContextCache.has(normalizedQid)) {
        return wikidataEntityContextCache.get(normalizedQid);
    }

    const url = `https://www.wikidata.org/wiki/Special:EntityData/${normalizedQid}.json`;
    try {
        const res = await fetch(url, { headers: { accept: "application/json" } });
        if (!res.ok) {
            wikidataEntityContextCache.set(normalizedQid, []);
            return [];
        }

        const data = await res.json();
        const entity = data?.entities?.[normalizedQid];
        if (!entity) {
            wikidataEntityContextCache.set(normalizedQid, []);
            return [];
        }

        const texts = [
            entity?.labels?.de?.value,
            entity?.labels?.en?.value,
            entity?.descriptions?.de?.value,
            entity?.descriptions?.en?.value,
        ].filter(Boolean);

        const tokens = uniq(texts.flatMap((text) => extractContextTokens(text))).slice(0, 20);
        wikidataEntityContextCache.set(normalizedQid, tokens);
        return tokens;
    } catch (e) {
        if (process.env.DEBUG_WD) console.error("WD ENTITY ERROR", normalizedQid, e);
        wikidataEntityContextCache.set(normalizedQid, []);
        return [];
    }
}

function selectBestGndCandidate(members, query, options = {}) {
    const normalized = normalizeMatchText(query);
    const acronymLike = isAcronymLikeQuery(query);
    const minScore = acronymLike ? MIN_SCORE_FOR_ACRONYM_MATCH : MIN_SCORE_FOR_MATCH;

    const pool = acronymLike
        ? members.filter((member) => isExactOrVariantExact(member, normalized))
        : members;

    if (!pool.length) return null;

    let best = null;
    let bestScore = -Infinity;
    for (const member of pool) {
        const score = scoreCandidate(member, normalized, options);
        if (score > bestScore) {
            best = member;
            bestScore = score;
        }
    }

    if (!best || bestScore < minScore) {
        return null;
    }

    return {
        best,
        bestScore,
        normalized,
    };
}

/**
 * Query GND via lobid for a string, return best match.
 * Uses SubjectHeading filter by default (as you requested).
 */
async function queryGND(value, wikidataId = null) {
    const q = cleanQuery(value);
    if (!q) return null;
    const centuryLikeQuery = /^\d{1,2}\.\s*jahrhundert$/i.test(q);
    const decadeLikeQuery =
        /^\d{3,4}er(?:\s+jahre)?$/i.test(q) ||
        /^\d{1,2}0er(?:\s+jahre)?$/i.test(q) ||
        /^\d{3,4}s$/i.test(q);
    const temporalLikeQuery = centuryLikeQuery || decadeLikeQuery;

    const subjectUrl =
        `https://lobid.org/gnd/search?q=${encodeURIComponent(q)}` +
        `&filter=%2B(type:SubjectHeading)&size=200&format=json`;

    const broadUrl = `https://lobid.org/gnd/search?q=${encodeURIComponent(q)}&size=200&format=json`;

    try {
        const contextTokens = await fetchWikidataContextTokens(wikidataId);

        if (temporalLikeQuery) {
            const broadMembers = await fetchGndMembers(broadUrl);
            const exactBroad = broadMembers.filter((member) =>
                isExactOrVariantExact(member, normalizeMatchText(q))
            );
            const selectedCentury = exactBroad.length ? selectBestGndCandidate(exactBroad, q, { contextTokens }) : null;
            if (!selectedCentury) return null;

            const { best } = selectedCentury;
            const gndId = extractGndId(best?.gndIdentifier || best?.id);
            const matchType = detectMatchType(best, normalizeMatchText(q));

            let detail = null;
            let context = {};
            let viafId = findViafId(best?.sameAs, best?.identifiedBy);

            if (gndId && (process.env.GND_WITH_CONTEXT === "1" || !viafId)) {
                detail = await fetchGndDetailById(gndId);
                if (process.env.GND_WITH_CONTEXT === "1" && detail) {
                    context = extractContext(detail);
                }
                if (!viafId) {
                    viafId = findViafId(detail?.sameAs, detail?.identifiedBy);
                }
            }

            return {
                gndIdentifier: gndId || null,
                preferredName: preferredNameOf(best) || null,
                variantName: variantsOf(best),
                type: Array.isArray(best?.type) ? best.type : [],
                matchType,
                gnd_uri: gndId ? `https://d-nb.info/gnd/${gndId}` : null,
                gnd_lobid_json: gndId ? `https://lobid.org/gnd/${gndId}.json` : null,
                gnd_explorer: gndId ? `https://explore.gnd.network/gnd/${gndId}` : null,
                viaf_id: viafId || null,
                viaf_uri: viafId ? `https://viaf.org/en/viaf/${viafId}` : null,
                ...context,
            };
        }

        const subjectMembers = await fetchGndMembers(subjectUrl);
        const selectedSubject = subjectMembers.length ? selectBestGndCandidate(subjectMembers, q, { contextTokens }) : null;

        const normalized = normalizeMatchText(q);
        let selected = selectedSubject;

        const subjectIsExact = selectedSubject?.best ? isExactOrVariantExact(selectedSubject.best, normalized) : false;
        if (!subjectIsExact) {
            const broadMembers = await fetchGndMembers(broadUrl);
            const exactBroad = broadMembers.filter((member) => isExactOrVariantExact(member, normalized));
            if (exactBroad.length) {
                const exactSelection = selectBestGndCandidate(exactBroad, q, { contextTokens });
                if (exactSelection) selected = exactSelection;
            } else {
                const broadSelection = selectBestGndCandidate(broadMembers, q, { contextTokens });
                if (broadSelection) selected = broadSelection;
            }
        }

        if (!selected) return null;

        const { best } = selected;

        const gndId = extractGndId(best?.gndIdentifier || best?.id);
        const matchType = detectMatchType(best, normalized);

        let detail = null;
        let context = {};
        let viafId = findViafId(best?.sameAs, best?.identifiedBy);

        if (gndId && (process.env.GND_WITH_CONTEXT === "1" || !viafId)) {
            detail = await fetchGndDetailById(gndId);
            if (process.env.GND_WITH_CONTEXT === "1" && detail) {
                context = extractContext(detail);
            }
            if (!viafId) {
                viafId = findViafId(detail?.sameAs, detail?.identifiedBy);
            }
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
            viaf_id: viafId || null,
            viaf_uri: viafId ? `https://viaf.org/en/viaf/${viafId}` : null,

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
        const normalizedNormdataId = extractGndId(normdata_id);

        let gndResult = null;
        let wikidata = null;

        if (!normalizedNormdataId) {
            wikidata = await queryWikidata(value);
            const wikidataIdForMatch = normalizeWikidataId(wikidata);
            gndResult = await queryGND(value, wikidataIdForMatch);
        }

        const wikidataId = normalizeWikidataId(wikidata);

        results.push({
            genre: value,

            gnd_id: normalizedNormdataId || gndResult?.gndIdentifier || null,
            gnd_label: gndResult?.preferredName || null,
            gnd_type: gndResult?.type || [],
            gnd_match_type: gndResult?.matchType || null,

            // links
            gnd_uri:
                gndResult?.gnd_uri || (normalizedNormdataId ? `https://d-nb.info/gnd/${normalizedNormdataId}` : null),
            gnd_lobid_json:
                gndResult?.gnd_lobid_json ||
                (normalizedNormdataId ? `https://lobid.org/gnd/${normalizedNormdataId}.json` : null),
            gnd_explorer:
                gndResult?.gnd_explorer ||
                (normalizedNormdataId ? `https://explore.gnd.network/gnd/${normalizedNormdataId}` : null),
            viaf_id: gndResult?.viaf_id ?? null,
            viaf_uri: gndResult?.viaf_uri ?? null,

            // synonyms
            gnd_synonyms: gndResult?.variantName || [],

            // context (parents etc.) — only filled when GND_WITH_CONTEXT=1
            gnd_parent_id: gndResult?.gnd_parent_id ?? null,
            gnd_broader_ids: gndResult?.gnd_broader_ids ?? [],
            gnd_related_ids: gndResult?.gnd_related_ids ?? [],
            gnd_narrower_ids: gndResult?.gnd_narrower_ids ?? [],

            wikidata_id: wikidataId,
            wikidata_uri: wikidataId ? `https://www.wikidata.org/wiki/${wikidataId}` : null,
        });
    }

    return results;
}

export { suggestNormdataIds, queryGND, queryWikidata };
export { selectBestGndCandidate };

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