import http from 'http';

function get(h) {
  return new Promise((res, rej) => {
    const d = JSON.stringify({ size: 1, query: { match: { handle: h } } });
    const o = {
      hostname: '141.5.105.237', port: 9200,
      path: '/21.11155-nested-testbed/_search',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(d) }
    };
    const r = http.request(o, resp => {
      let b = ''; resp.on('data', c => b += c);
      resp.on('end', () => res(JSON.parse(b).hits.hits[0]?._source));
    });
    r.on('error', rej); r.write(d); r.end();
  });
}

// WORK
const work = await get('21.11155/A37FAC2F-2527-4DFE-94FB-5C18D2569406');
console.log('WORK:', work.handle, '|', work.has_record?.has_primary_title?.has_name, '|', work.years);

// MANIFESTATIONS
const manifHandles = [
  '21.11155/AF1BEFE7-6E44-41DF-8727-5EAF19503FF9',
  '21.11155/621FA496-A03C-4ABC-B02D-26CF22EAEE4C',
  '21.11155/30A9143D-F90E-458A-9EA7-4B1E02CCF63D',
];
for (const mh of manifHandles) {
  const m = await get(mh);
  if (!m) { console.log('not found:', mh); continue; }
  console.log('\nM:', m.handle);
  console.log('  issuer:', m.has_record.described_by.has_issuer_name);
  console.log('  items:', m.has_record.has_item?.length);
  console.log('  events:', JSON.stringify(m.has_record.has_event));
  for (const it of (m.has_record.has_item || []).slice(0, 2)) {
    const i = await get(it.id);
    if (i) {
      console.log('  I:', i.handle, '|', i.has_record.described_by.has_issuer_name,
        '| fmt:', JSON.stringify(i.has_record.has_format),
        '| colour:', i.has_record.has_colour_type,
        '| access:', i.has_record.has_access_status);
    }
  }
}
