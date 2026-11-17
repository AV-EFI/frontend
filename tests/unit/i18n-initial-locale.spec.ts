import { beforeEach, describe, expect, test, vi } from 'vitest';

type SwitchData = { newLocale: string };
type SwitchHook = (switchData: SwitchData) => void;
type PluginDefinition = { enforce?: string; setup: (nuxtApp: unknown) => void };

async function registerPlugin(cookieLocale: string | undefined) {
  let hook: SwitchHook | undefined;
  const nuxtApp = {
    $i18n: { defaultLocale: 'de', getLocaleCookie: () => cookieLocale },
    hook: (name: string, handler: SwitchHook) => {
      if (name === 'i18n:beforeLocaleSwitch') hook = handler;
    },
  };
  vi.stubGlobal('defineNuxtPlugin', (plugin: PluginDefinition) => plugin);
  const { default: plugin } = await import('~/plugins/i18n-initial-locale');
  const definition = plugin as unknown as PluginDefinition;
  definition.setup(nuxtApp);
  return { definition, switchLocale: (locale: string) => {
    const switchData = { newLocale: locale };
    hook!(switchData);
    return switchData.newLocale;
  } };
}

describe('i18n-initial-locale plugin', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  test('runs before the i18n plugins so the initial switch is caught', async () => {
    const { definition } = await registerPlugin(undefined);

    expect(definition.enforce).toBe('pre');
  });

  test('ignores the browser language and starts in the default locale without a cookie', async () => {
    const { switchLocale } = await registerPlugin(undefined);

    expect(switchLocale('en')).toBe('de');
  });

  test('starts in the locale chosen with the language switch', async () => {
    const { switchLocale } = await registerPlugin('en');

    expect(switchLocale('de')).toBe('en');
  });

  test('leaves later switches from the language switch unchanged', async () => {
    const { switchLocale } = await registerPlugin(undefined);

    switchLocale('en');

    expect(switchLocale('en')).toBe('en');
  });
});
