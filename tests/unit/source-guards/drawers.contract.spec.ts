import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, test } from 'vitest';

const contactSource = readFileSync(
  resolve(process.cwd(), 'components/global/ContactDrawer.vue'),
  'utf8'
);
const comparisonSource = readFileSync(
  resolve(process.cwd(), 'components/global/ComparisonDrawer.vue'),
  'utf8'
);

describe('Drawer contract guards', () => {
  test('CBC-CONTACT-001 keeps window event contract', () => {
    expect(contactSource).toContain('toggle-contact-drawer');
    expect(contactSource).toContain('open-contact-drawer');
    expect(contactSource).toContain('close-contact-drawer');
    expect(contactSource).toContain('open-contact-form');
  });

  test('CBC-CONTACT-002 keeps Escape close + body-scroll lock behavior', () => {
    expect(contactSource).toContain("if (e.key === 'Escape')");
    expect(contactSource).toContain("document.body.style.overflow = value ? 'hidden' : ''");
  });

  test('CBC-COMPARISON-001 keeps compare action guard for exactly 2 items', () => {
    expect(comparisonSource).toContain('objectListStore.objects.length !== 2');
    expect(comparisonSource).toContain('if (objectIds.length === 2)');
  });

  test('CBC-COMPARISON-002 keeps tab semantics and aria bindings', () => {
    expect(comparisonSource).toContain('role="tab"');
    expect(comparisonSource).toContain('role="tabpanel"');
    expect(comparisonSource).toContain(':aria-selected');
  });
});
