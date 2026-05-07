const base = process.env.E2E_BACKEND_BASE || 'https://www.av-efi.net/rest/v1';
const url = `${base}/frontend/search`;
const indexName = process.env.E2E_BACKEND_INDEX || '21.11155-denormalised-work';

const workFacets = [
  'has_genre_has_name',
  'subjects',
  'creators',
  'castmembers',
  'production',
  'located_in_has_name',
  'has_form',
];

const manifestationFacets = [
  'has_issuer_name',
  'manifestation_event_type',
];

const itemFacets = [
  'has_format_type',
  'has_colour_type',
  'has_sound_type',
  'in_language_code',
  'item_element_type',
  'has_access_status',
  'has_extent_has_value',
  'has_duration_has_value',
];

const facets = [
  ...workFacets,
  ...manifestationFacets,
  ...itemFacets,
];

const facetLevel = Object.fromEntries([
  ...workFacets.map((facet) => [facet, 'work']),
  ...manifestationFacets.map((facet) => [facet, 'manifestation']),
  ...itemFacets.map((facet) => [facet, 'item']),
]);

async function search({ facetFilters = [], query = '', hitsPerPage = 5 } = {}) {
  const payload = [
    {
      indexName,
      params: {
        query,
        page: 0,
        hitsPerPage,
        facetFilters,
        facets,
        maxValuesPerFacet: 100,
      },
    },
  ];

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  let body = null;
  try {
    body = JSON.parse(text);
  } catch {
    // Keep raw text for error reporting.
  }
  return { status: res.status, text, body };
}

function topBucket(facetMap, facet) {
  return Object.entries(facetMap?.[facet] || {})
    .filter(([value, count]) => value && Number(count) > 0)
    .sort((a, b) => Number(b[1]) - Number(a[1]))[0]?.[0];
}

function asArray(value) {
  if (Array.isArray(value)) return value;
  return value == null ? [] : [value];
}

function hitsFromResults(resultBody) {
  return resultBody?.results?.[0]?.hits || [];
}

function manifestationsFromResults(resultBody) {
  const manifestations = [];
  for (const work of hitsFromResults(resultBody)) {
    for (const manifestation of work.manifestations || []) {
      manifestations.push({ work, manifestation });
    }
  }
  return manifestations;
}

function itemsFromResults(resultBody) {
  const items = [];
  for (const { work, manifestation } of manifestationsFromResults(resultBody)) {
    for (const item of manifestation.items || []) {
      items.push({ work, manifestation, item });
    }
  }
  return items;
}

function itemFormats(item) {
  return (item?.has_record?.has_format || [])
    .map((format) => format?.type)
    .filter(Boolean);
}

function workMatchesFacet(work, facet, value) {
  const record = work?.has_record || {};

  if (facet === 'has_genre_has_name') {
    return asArray(record.has_genre).some((genre) => (
      genre?.has_name === value || genre === value
    ));
  }
  if (facet === 'subjects') {
    return asArray(work.subjects).some((subject) => (
      subject === value || subject?.has_name === value
    ));
  }
  if (facet === 'creators') return asArray(work.creators).includes(value);
  if (facet === 'castmembers') return asArray(work.castmembers).includes(value);
  if (facet === 'production') return asArray(work.production).includes(value);
  if (facet === 'located_in_has_name') {
    return asArray(record.has_event).some((event) => (
      asArray(event?.located_in).some((place) => place?.has_name === value)
    ));
  }
  if (facet === 'has_form') {
    return asArray(record.has_form).some((form) => (
      form === value || form?.has_name === value
    ));
  }

  throw new Error(`Unsupported work facet ${facet}`);
}

function manifestationMatchesFacet(manifestation, facet, value) {
  const record = manifestation?.has_record || {};
  if (facet === 'has_issuer_name') {
    return record.described_by?.has_issuer_name === value;
  }
  if (facet === 'manifestation_event_type') {
    return asArray(record.has_event).some((event) => event?.type === value);
  }
  throw new Error(`Unsupported manifestation facet ${facet}`);
}

function itemMatchesFacet(item, facet, value) {
  const record = item?.has_record || {};
  if (facet === 'has_format_type') return itemFormats(item).includes(value);
  if (facet === 'has_colour_type') return record.has_colour_type === value;
  if (facet === 'has_sound_type') return record.has_sound_type === value;
  if (facet === 'item_element_type') return record.element_type === value;
  if (facet === 'has_access_status') return record.has_access_status === value;
  if (facet === 'in_language_code') {
    return asArray(record.in_language).some((language) => language?.code === value);
  }
  if (facet === 'has_extent_has_value') {
    return String(record.has_extent?.has_value ?? '') === String(value);
  }
  if (facet === 'has_duration_has_value') {
    return String(record.has_duration?.has_value ?? '') === String(value);
  }
  throw new Error(`Unsupported item facet ${facet}`);
}

function validateFacet(body, facet, value) {
  const level = facetLevel[facet];
  if (level === 'work') {
    const works = hitsFromResults(body);
    const mismatches = works.filter((work) => !workMatchesFacet(work, facet, value));
    return {
      unit: 'works',
      total: works.length,
      mismatches,
      examples: mismatches.slice(0, 5).map((work) => ({
        work: work?.handle,
        title: work?.has_record?.has_primary_title?.has_name,
      })),
    };
  }

  if (level === 'manifestation') {
    const manifestations = manifestationsFromResults(body);
    const mismatches = manifestations.filter(({ manifestation }) => (
      !manifestationMatchesFacet(manifestation, facet, value)
    ));
    return {
      unit: 'manifestations',
      total: manifestations.length,
      mismatches,
      examples: mismatches.slice(0, 5).map(({ manifestation }) => ({
        manifestation: manifestation?.handle,
        issuer: manifestation?.has_record?.described_by?.has_issuer_name,
        eventTypes: asArray(manifestation?.has_record?.has_event)
          .map((event) => event?.type),
      })),
    };
  }

  if (level === 'item') {
    const items = itemsFromResults(body);
    const mismatches = items.filter(({ item }) => !itemMatchesFacet(item, facet, value));
    return {
      unit: 'items',
      total: items.length,
      mismatches,
      examples: mismatches.slice(0, 5).map(({ item, manifestation }) => ({
        manifestation: manifestation?.handle,
        item: item?.handle,
        formats: itemFormats(item),
        colour: item?.has_record?.has_colour_type,
        sound: item?.has_record?.has_sound_type,
        language: item?.has_record?.in_language,
        element: item?.has_record?.element_type,
        access: item?.has_record?.has_access_status,
        extent: item?.has_record?.has_extent?.has_value,
        duration: item?.has_record?.has_duration?.has_value,
      })),
    };
  }

  throw new Error(`Unsupported facet level for ${facet}`);
}

async function buildCompatibleFilters(facetSequence, query) {
  const facetFilters = [];
  const values = {};

  for (const facet of facetSequence) {
    const current = await search({ facetFilters, query, hitsPerPage: 5 });
    if (current.status !== 200) {
      return {
        skipped: false,
        error: `Discovery for ${facet} failed with ${current.status}: ${current.text.slice(0, 300)}`,
      };
    }

    const facetMap = current.body?.results?.[0]?.facets || {};
    const value = topBucket(facetMap, facet);
    if (!value) {
      return { skipped: true, reason: `No compatible bucket for ${facet}` };
    }

    values[facet] = value;
    facetFilters.push([`${facet}:${value}`]);
  }

  return { skipped: false, facetFilters, values };
}

async function runCase({ name, facetSequence, query = '' }, failures, summary) {
  summary.cases += 1;
  const built = await buildCompatibleFilters(facetSequence, query);
  if (built.error) {
    failures.push({ name, query, reason: built.error });
    return;
  }
  if (built.skipped) {
    summary.skipped += 1;
    console.log(`SKIP ${name}${query ? ` query=${query}` : ''}: ${built.reason}`);
    return;
  }
  summary.executed += 1;

  const res = await search({ facetFilters: built.facetFilters, query, hitsPerPage: 5 });
  if (res.status !== 200) {
    failures.push({
      name,
      query,
      status: res.status,
      filters: built.facetFilters,
      reason: res.text.slice(0, 500),
    });
    return;
  }

  for (const [facet, value] of Object.entries(built.values)) {
    const result = validateFacet(res.body, facet, value);
    summary.validations += 1;
    console.log(
      `${name}${query ? ` query=${query}` : ''} ${facet}=${value}: returned${result.unit}=${result.total}, mismatches=${result.mismatches.length}`,
    );

    if (result.total === 0) {
      failures.push({
        name,
        query,
        facet,
        value,
        filters: built.facetFilters,
        reason: `No returned ${result.unit} to validate`,
      });
    }
    if (result.mismatches.length > 0) {
      failures.push({
        name,
        query,
        facet,
        value,
        filters: built.facetFilters,
        reason: `Returned ${result.unit} include non-matching records`,
        examples: result.examples,
      });
    }
  }

  const reset = await search({ query, hitsPerPage: 5 });
  if (reset.status !== 200) {
    failures.push({
      name: `reset_after:${name}`,
      query,
      status: reset.status,
      reason: reset.text.slice(0, 300),
    });
  }
}

const discovery = await search({ hitsPerPage: 5 });
if (discovery.status !== 200) {
  throw new Error(`Discovery failed ${discovery.status}: ${discovery.text.slice(0, 500)}`);
}

console.log(`Endpoint: ${url}`);

const failures = [];
const summary = {
  cases: 0,
  executed: 0,
  skipped: 0,
  validations: 0,
};
const cases = [
  ...facets.map((facet) => ({ name: `single:${facet}`, facetSequence: [facet] })),
  ...workFacets.flatMap((workFacet) => (
    itemFacets.map((itemFacet) => ({
      name: `work_item:${workFacet}+${itemFacet}`,
      facetSequence: [workFacet, itemFacet],
    }))
  )),
  ...workFacets.flatMap((workFacet) => (
    manifestationFacets.map((manifestationFacet) => ({
      name: `work_manifestation:${workFacet}+${manifestationFacet}`,
      facetSequence: [workFacet, manifestationFacet],
    }))
  )),
  ...manifestationFacets.flatMap((manifestationFacet) => (
    itemFacets.map((itemFacet) => ({
      name: `manifestation_item:${manifestationFacet}+${itemFacet}`,
      facetSequence: [manifestationFacet, itemFacet],
    }))
  )),
  { name: 'all_levels:genre+issuer+format', facetSequence: ['has_genre_has_name', 'has_issuer_name', 'has_format_type'] },
  { name: 'all_levels:form+event+language', facetSequence: ['has_form', 'manifestation_event_type', 'in_language_code'] },
  { name: 'all_levels:production+issuer+access', facetSequence: ['production', 'has_issuer_name', 'has_access_status'] },
  { name: 'all_item_facets', facetSequence: itemFacets },
  { name: 'all_manifestation_facets', facetSequence: manifestationFacets },
];

const queryVariants = ['', 'Berlin'];
for (const query of queryVariants) {
  for (const currentCase of cases) {
    await runCase({ ...currentCase, query }, failures, summary);
  }
}

console.log(
  `Checked cases=${summary.cases}, executed=${summary.executed}, skipped=${summary.skipped}, validations=${summary.validations}, failures=${failures.length}`,
);

if (failures.length) {
  console.log(JSON.stringify(failures, null, 2));
  process.exit(1);
}

console.log('Payload work/manifestation/item facet checks passed.');
