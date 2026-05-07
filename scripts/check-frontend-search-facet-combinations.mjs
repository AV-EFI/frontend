const base = process.env.E2E_BACKEND_BASE || 'https://www.av-efi.net/rest/v1';
const url = `${base}/frontend/search`;
const indexName = process.env.E2E_BACKEND_INDEX || '21.11155-denormalised-work';

const stringFacets = [
  'has_genre_has_name',
  'subjects',
  'creators',
  'castmembers',
  'production',
  'located_in_has_name',
  'has_form',
  'manifestation_event_type',
  'has_issuer_name',
  'has_format_type',
  'has_colour_type',
  'has_sound_type',
  'in_language_code',
  'has_duration_has_value',
  'has_extent_has_value',
  'item_element_type',
  'has_access_status',
];

const itemFacets = [
  'has_format_type',
  'has_colour_type',
  'has_sound_type',
  'in_language_code',
  'has_duration_has_value',
  'has_extent_has_value',
  'item_element_type',
  'has_access_status',
];

const manifestationFacets = ['has_issuer_name', 'manifestation_event_type'];
const nestedManifestationAndItemFacets = [
  ...manifestationFacets,
  ...itemFacets,
];

async function search(facetFilters = [], extraParams = {}) {
  const payload = [
    {
      indexName,
      params: {
        query: '',
        page: 0,
        hitsPerPage: 1,
        facetFilters,
        facets: stringFacets,
        maxValuesPerFacet: 100,
        ...extraParams,
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

function topBucket(facets, facet) {
  return Object.entries(facets?.[facet] || {})
    .filter(([value, count]) => value && Number(count) > 0)
    .sort((a, b) => Number(b[1]) - Number(a[1]))[0]?.[0];
}

function addCase(cases, values, name, facetNames, extraParams = {}) {
  const filters = facetNames
    .filter((facet) => values[facet])
    .map((facet) => [`${facet}:${values[facet]}`]);
  cases.push({ name, facetNames, filters, extraParams });
}

const discovery = await search([]);
if (discovery.status !== 200) {
  throw new Error(
    `Discovery failed ${discovery.status}: ${discovery.text.slice(0, 500)}`,
  );
}

const facets = discovery.body?.results?.[0]?.facets || {};
const values = {};
for (const facet of stringFacets) {
  const value = topBucket(facets, facet);
  if (value) values[facet] = value;
}

console.log(`Endpoint: ${url}`);
console.log('Discovered values:');
for (const facet of stringFacets) {
  console.log(`  ${facet} = ${values[facet] ?? '<none>'}`);
}

const cases = [];
for (const facet of stringFacets) addCase(cases, values, `single:${facet}`, [facet]);
for (let i = 0; i < stringFacets.length; i += 1) {
  for (let j = i + 1; j < stringFacets.length; j += 1) {
    addCase(cases, values, `pair:${stringFacets[i]}+${stringFacets[j]}`, [
      stringFacets[i],
      stringFacets[j],
    ]);
  }
}

for (const manifestationFacet of manifestationFacets) {
  for (const itemFacet of itemFacets) {
    addCase(cases, values, `regression:${manifestationFacet}+${itemFacet}`, [
      manifestationFacet,
      itemFacet,
    ]);
  }
  addCase(cases, values, `all_items_plus:${manifestationFacet}`, [
    manifestationFacet,
    ...itemFacets,
  ]);
}

for (let mask = 1; mask < (1 << nestedManifestationAndItemFacets.length); mask += 1) {
  const subset = nestedManifestationAndItemFacets.filter((_, index) => (
    mask & (1 << index)
  ));
  addCase(cases, values, `nested_subset:${subset.join('+')}`, subset);
}

addCase(cases, values, 'all_string_facets', stringFacets);
addCase(cases, values, 'issuer_format_explicit', [
  'has_issuer_name',
  'has_format_type',
]);
addCase(cases, values, 'issuer_format_colour_sound', [
  'has_issuer_name',
  'has_format_type',
  'has_colour_type',
  'has_sound_type',
]);
addCase(cases, values, 'all_items_plus_year_range', itemFacets, {
  'numeric-refinements': { production_in_year: { '>=': 1930, '<=': 2000 } },
});
addCase(cases, values, 'all_items_plus_item_duration_range', itemFacets, {
  'numeric-refinements': { item_duration_in_minutes: { '>=': 1, '<=': 240 } },
});

const failures = [];
let checked = 0;
for (const currentCase of cases) {
  if (!currentCase.filters.length) continue;
  checked += 1;
  const res = await search(currentCase.filters, currentCase.extraParams);
  if (res.status < 200 || res.status >= 300) {
    failures.push({
      name: currentCase.name,
      status: res.status,
      filters: currentCase.filters,
      text: res.text.slice(0, 500),
    });
    console.log(
      `FAIL ${currentCase.name} status=${res.status} filters=${JSON.stringify(
        currentCase.filters,
      )}`,
    );
  }
}

console.log(`Checked cases: ${checked}`);
console.log(`Failures: ${failures.length}`);
if (failures.length) {
  console.log(JSON.stringify(failures, null, 2));
  process.exit(1);
}
