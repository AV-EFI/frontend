import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const SAMPLE_SIZE = Number.parseInt(process.env.NORMDATA_SAMPLE_SIZE ?? "100", 10);
const RETRIES = Number.parseInt(process.env.NORMDATA_HTTP_RETRIES ?? "2", 10);
const RETRY_DELAY_MS = Number.parseInt(process.env.NORMDATA_HTTP_RETRY_DELAY_MS ?? "500", 10);

const projectRoot = path.resolve(import.meta.dirname, "..", "..");

async function readJson(relativePath) {
    const fullPath = path.join(projectRoot, relativePath);
    const buffer = await readFile(fullPath);

    let raw;
    if (buffer[0] === 0xff && buffer[1] === 0xfe) {
        raw = new TextDecoder("utf-16le").decode(buffer);
    } else if (buffer[0] === 0xfe && buffer[1] === 0xff) {
        raw = new TextDecoder("utf-16be").decode(buffer);
    } else {
        raw = buffer.toString("utf8");
    }

    raw = raw.replace(/^\uFEFF/, "");
    return JSON.parse(raw);
}

function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function extractGndId(idOrUrl) {
    const raw = String(idOrUrl ?? "").trim();
    if (!raw) return null;

    let candidate = raw;
    const fromUrl = raw.match(/(?:d-nb\.info\/gnd\/|lobid\.org\/gnd\/|explore\.gnd\.network\/gnd\/)([^/?#]+)/i);
    if (fromUrl?.[1]) {
        candidate = fromUrl[1];
    }

    candidate = candidate.replace(/\.json$/i, "").trim();

    if (/^\d{6,9}-[\dX]$/i.test(candidate)) return candidate.toUpperCase();
    if (/^\d{9,10}[\dX]?$/i.test(candidate)) return candidate.toUpperCase();

    const numeric = candidate.match(/^(\d{6,10})$/);
    return numeric ? numeric[1] : null;
}

function normalizeWikidataId(id) {
    const raw = String(id ?? "").trim();
    if (!raw) return null;
    const match = raw.match(/Q\d+/i);
    return match ? match[0].toUpperCase() : null;
}

async function fetchStatus(url) {
    let lastStatus = null;
    let lastError = null;

    for (let attempt = 0; attempt <= RETRIES; attempt++) {
        try {
            const response = await fetch(url, {
                method: "GET",
                redirect: "follow",
                headers: { accept: "application/json,text/html;q=0.9,*/*;q=0.8" },
            });

            lastStatus = response.status;

            if (response.status === 404) return { status: 404 };
            if (response.ok) return { status: response.status };

            if (response.status === 429 || response.status >= 500) {
                if (attempt < RETRIES) {
                    await wait(RETRY_DELAY_MS * (attempt + 1));
                    continue;
                }
                return { status: response.status };
            }

            return { status: response.status };
        } catch (error) {
            lastError = error;
            if (attempt < RETRIES) {
                await wait(RETRY_DELAY_MS * (attempt + 1));
                continue;
            }
        }
    }

    return {
        status: lastStatus,
        error: lastError ? String(lastError?.message || lastError) : "Unknown network error",
    };
}

async function validateEntries(entries, label) {
    const failures = [];

    for (const [index, entry] of entries.slice(0, SAMPLE_SIZE).entries()) {
        const name = entry.genre || entry.subject || entry.value || `index:${index}`;

        const gndId = extractGndId(entry.gnd_id || entry.gnd_uri || entry.gnd_lobid_json || entry.gnd_explorer);
        if (gndId) {
            const gndUrl = `https://lobid.org/gnd/${gndId}.json`;
            const gndStatus = await fetchStatus(gndUrl);

            if (gndStatus.status === 404) {
                failures.push(`${label}[${index}] ${name} => GND 404: ${gndUrl}`);
            }
        }

        const wikidataId = normalizeWikidataId(entry.wikidata_id);
        if (wikidataId) {
            const wikidataUrl = `https://www.wikidata.org/wiki/Special:EntityData/${wikidataId}.json`;
            const wikidataStatus = await fetchStatus(wikidataUrl);

            if (wikidataStatus.status === 404) {
                failures.push(`${label}[${index}] ${name} => Wikidata 404: ${wikidataUrl}`);
            }
        }
    }

    return failures;
}

test(`normdata subjects first ${SAMPLE_SIZE} entries do not return 404`, async () => {
    const subjects = await readJson("normdata_extended_has_subject.json");
    const failures = await validateEntries(subjects, "subjects");

    assert.equal(
        failures.length,
        0,
        `Found ${failures.length} missing identifiers (404):\n${failures.slice(0, 50).join("\n")}${failures.length > 50 ? "\n..." : ""}`,
    );
});

test(`normdata genres first ${SAMPLE_SIZE} entries do not return 404`, async () => {
    const genres = await readJson("normdata_extended_has_genre.json");
    const failures = await validateEntries(genres, "genres");

    assert.equal(
        failures.length,
        0,
        `Found ${failures.length} missing identifiers (404):\n${failures.slice(0, 50).join("\n")}${failures.length > 50 ? "\n..." : ""}`,
    );
});
