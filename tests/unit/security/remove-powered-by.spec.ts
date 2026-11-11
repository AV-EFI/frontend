import { beforeEach, describe, expect, test, vi } from 'vitest';

const removeResponseHeader = vi.fn();
vi.mock('h3', () => ({ removeResponseHeader }));

type RenderResponseHook = (response: { headers?: Record<string, string> }, context: { event: object }) => void;

async function registerPlugin() {
  let hook: RenderResponseHook | undefined;
  const nitroApp = {
    hooks: {
      hook: (name: string, handler: RenderResponseHook) => {
        if (name === 'render:response') hook = handler;
      },
    },
  };
  vi.stubGlobal('defineNitroPlugin', (plugin: (app: typeof nitroApp) => void) => plugin);
  const { default: plugin } = await import('~/server/plugins/remove-powered-by');
  (plugin as unknown as (app: typeof nitroApp) => void)(nitroApp);
  return hook!;
}

describe('remove-powered-by plugin', () => {
  beforeEach(() => {
    vi.resetModules();
    removeResponseHeader.mockClear();
  });

  test('drops x-powered-by from the render response and keeps other headers', async () => {
    const hook = await registerPlugin();
    const response = { headers: { 'content-type': 'text/html;charset=utf-8', 'x-powered-by': 'Nuxt' } };

    hook(response, { event: {} });

    expect(response.headers).toEqual({ 'content-type': 'text/html;charset=utf-8' });
  });

  test('removes the header a streamed response already set on the event', async () => {
    const hook = await registerPlugin();
    const event = {};

    hook({}, { event });

    expect(removeResponseHeader).toHaveBeenCalledWith(event, 'x-powered-by');
  });
});
