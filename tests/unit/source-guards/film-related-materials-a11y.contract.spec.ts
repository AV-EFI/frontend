import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, test } from 'vitest';

const source = readFileSync(
  resolve(process.cwd(), 'components/detail/FilmRelatedMaterialsComp.vue'),
  'utf8'
);

describe('FilmRelatedMaterialsComp accessibility contract guards', () => {
  test('keeps list browser semantics for screenreader navigation', () => {
    expect(source).toContain('aria-labelledby="film-related-materials-heading"');
    expect(source).toContain(':aria-label="$t(\'filmRelatedMaterials\')"');
    expect(source).toContain('role="list"');
    expect(source).toContain('role="listitem"');
    expect(source).toContain(':aria-labelledby="getMaterialDomId(entry.material)"');
  });

  test('keeps searchable controls and pagination labelled', () => {
    expect(source).toContain('type="search"');
    expect(source).toContain(':placeholder="$t(\'filmRelatedMaterialsSearchPlaceholder\')"');
    expect(source).toContain(':aria-label="$t(\'previousPage\')"');
    expect(source).toContain(':aria-label="$t(\'nextPage\')"');
  });

  test('keeps preview placeholders centered and facts visibly labelled', () => {
    expect(source).toContain('class="material-thumbnail__placeholder"');
    expect(source).toContain('.material-thumbnail__placeholder');
    expect(source).toContain('class="material-representation-thumbnail"');
    expect(source).toContain('REPRESENTATION_PLACEHOLDER_SRC');
    expect(source).toContain(':name="fact.icon"');
    expect(source).toContain(':title="fact.value"');
  });

  test('does not expose event filtering controls', () => {
    expect(source).not.toContain('v-model="eventFilter"');
    expect(source).not.toContain('const eventFilter');
    expect(source).not.toContain('const eventOptions');
    expect(source).not.toContain('$t(\'allEvents\')');
  });
});
