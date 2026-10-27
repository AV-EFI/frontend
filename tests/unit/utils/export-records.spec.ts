import { describe, expect, it } from 'vitest';
import { flattenRecord, recordsToCsvRows, recordsToXml, unwrapRecord } from '../../../utils/exportRecords';

const record = {
  handle: '21.11155/A',
  '@timestamp': 1,
  manifestations: [{
    handle: '21.11155/B',
    has_record: { has_note: ['a & b', 'c'] },
    items: [{ handle: '21.11155/C' }],
  }],
};

describe('exportRecords', () => {
  it('unwraps the search-engine envelope', () => {
    expect(unwrapRecord({ handle: 'x', compound_record: { _source: record } })).toBe(record);
    expect(unwrapRecord({ _source: record })).toBe(record);
    expect(unwrapRecord(record)).toBe(record);
  });

  it('flattens every value to a path column', () => {
    expect(flattenRecord(record)).toMatchObject({
      handle: '21.11155/A',
      'manifestations.0.items.0.handle': '21.11155/C',
      'manifestations.0.has_record.has_note.1': 'c',
    });
  });

  it('uses the union of columns across records', () => {
    const { headers, rows } = recordsToCsvRows([{ a: 1 }, { b: 2 }]);
    expect(headers).toEqual(['a', 'b']);
    expect(rows).toEqual([{ a: '1', b: '' }, { a: '', b: '2' }]);
  });

  it('writes nested XML with escaped text, repeated array elements and valid names', () => {
    const xml = recordsToXml([record]);
    expect(xml).toContain('<_timestamp>1</_timestamp>');
    expect(xml).toContain('<has_note>a &amp; b</has_note>');
    expect(xml.match(/<has_note>/g)).toHaveLength(2);
    expect(xml).toContain('<handle>21.11155/C</handle>');
  });
});
