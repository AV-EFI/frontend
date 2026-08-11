import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, test } from 'vitest';

const compareEditorSource = readFileSync(
  resolve(process.cwd(), 'components/global/CompareViewEditor.vue'),
  'utf8'
);
const resultEditorSource = readFileSync(
  resolve(process.cwd(), 'components/views/WorkViewEditorResult.vue'),
  'utf8'
);

describe('Disambiguation layout contract guards', () => {
  test('BB-DISAMBIGUATION-001 keeps result column controls compact', () => {
    expect(compareEditorSource).toContain('lg:w-1/3 min-w-0 overflow-y-auto overflow-x-hidden');
    expect(resultEditorSource).toContain('btn btn-error btn-outline btn-xs h-8 min-h-0 px-2');
    expect(resultEditorSource).toContain("outer: '!w-auto max-w-none mt-3 flex justify-end'");
    expect(resultEditorSource).toContain("input: '!w-auto min-h-0 h-8 px-4 text-sm text-center justify-center'");
    expect(resultEditorSource).toContain(".merge-editor-result :deep([data-type='repeater'] .formkit-controls)");
    expect(resultEditorSource).toContain('flex: 0 0 1.75rem;');
  });
});
