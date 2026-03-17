import { readFile } from "node:fs/promises";

const files = [
  { label: "subjects-rerun", path: "normdata_extended_has_subject.first100.rerun.json" },
  { label: "genres-rerun", path: "normdata_extended_has_genre.first100.rerun.json" },
];

function extractGndId(idOrUrl) {
  const raw = String(idOrUrl ?? "").trim();
  if (!raw) return null;

  let candidate = raw;
  const fromUrl = raw.match(/(?:d-nb\.info\/gnd\/|lobid\.org\/gnd\/|explore\.gnd\.network\/gnd\/)([^/?#]+)/i);
  if (fromUrl?.[1]) candidate = fromUrl[1];

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
  const response = await fetch(url, {
    method: "GET",
    redirect: "follow",
    headers: { accept: "application/json,text/html;q=0.9,*/*;q=0.8" },
  });
  return response.status;
}

async function main() {
  let totalFailures = 0;

  for (const file of files) {
    const data = JSON.parse(await readFile(file.path, "utf8"));
    const failures = [];

    for (const [index, entry] of data.entries()) {
      const label = entry.genre || entry.subject || entry.value || `index:${index}`;

      const gndId = extractGndId(entry.gnd_id || entry.gnd_uri || entry.gnd_lobid_json || entry.gnd_explorer);
      if (gndId) {
        const gndUrl = `https://lobid.org/gnd/${gndId}.json`;
        const status = await fetchStatus(gndUrl);
        if (status === 404) failures.push(`${file.label}[${index}] ${label} => GND 404: ${gndUrl}`);
      }

      const wikidataId = normalizeWikidataId(entry.wikidata_id);
      if (wikidataId) {
        const wdUrl = `https://www.wikidata.org/wiki/Special:EntityData/${wikidataId}.json`;
        const status = await fetchStatus(wdUrl);
        if (status === 404) failures.push(`${file.label}[${index}] ${label} => Wikidata 404: ${wdUrl}`);
      }
    }

    totalFailures += failures.length;
    console.log(`${file.label}: ${data.length} checked, ${failures.length} failures`);
    if (failures.length) {
      for (const line of failures.slice(0, 20)) console.log(line);
      if (failures.length > 20) console.log("...");
    }
  }

  if (totalFailures > 0) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
