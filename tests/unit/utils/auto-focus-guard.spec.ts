import { afterEach, describe, expect, test, vi } from 'vitest';
import { canAutoFocus, SKIP_LINK_ID } from '~/utils/autoFocusGuard';

function stubDocument(activeElement: unknown) {
  const body = { id: '' };
  const documentElement = { id: '' };
  vi.stubGlobal('document', {
    body,
    documentElement,
    activeElement: activeElement === 'body' ? body : activeElement,
  });
}

describe('canAutoFocus', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test('is false without a document', () => {
    expect(canAutoFocus()).toBe(false);
  });

  test('allows focus while nothing has been focused yet', () => {
    stubDocument('body');
    expect(canAutoFocus()).toBe(true);
    stubDocument(null);
    expect(canAutoFocus()).toBe(true);
  });

  test('allows focus while the skip link, the first tab stop, holds it', () => {
    stubDocument({ id: SKIP_LINK_ID });
    expect(canAutoFocus()).toBe(true);
  });

  test('never steals focus from any other element', () => {
    stubDocument({ id: 'header-link' });
    expect(canAutoFocus()).toBe(false);
  });
});
