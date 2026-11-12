import { beforeEach, describe, expect, test, vi } from 'vitest';

const responseHeaders = new Map<string, string>();
vi.mock('h3', () => ({
  getResponseHeader: (_event: object, name: string) => responseHeaders.get(name),
  setResponseHeader: (_event: object, name: string, value: string) => responseHeaders.set(name, value),
}));

async function runBeforeResponseHook() {
  let hook: ((event: object) => void) | undefined;
  const nitroApp = {
    hooks: {
      hook: (name: string, handler: (event: object) => void) => {
        if (name === 'beforeResponse') hook = handler;
      },
    },
  };
  vi.stubGlobal('defineNitroPlugin', (plugin: (app: typeof nitroApp) => void) => plugin);
  const { default: plugin } = await import('~/server/plugins/security-headers');
  (plugin as unknown as (app: typeof nitroApp) => void)(nitroApp);
  hook!({});
}

describe('security-headers plugin', () => {
  beforeEach(() => {
    vi.resetModules();
    responseHeaders.clear();
  });

  test('sets nosniff, referrer policy and permissions policy', async () => {
    await runBeforeResponseHook();

    expect(Object.fromEntries(responseHeaders)).toEqual({
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    });
  });

  test('keeps a value a route already set', async () => {
    responseHeaders.set('Referrer-Policy', 'no-referrer');

    await runBeforeResponseHook();

    expect(responseHeaders.get('Referrer-Policy')).toBe('no-referrer');
  });

  test('does not restrict framing or force HTTPS, which are still open decisions', async () => {
    await runBeforeResponseHook();

    expect([...responseHeaders.keys()].map((name) => name.toLowerCase())).not.toEqual(
      expect.arrayContaining(['strict-transport-security']),
    );
    expect(responseHeaders.has('X-Frame-Options')).toBe(false);
    expect(responseHeaders.has('Content-Security-Policy')).toBe(false);
  });
});
