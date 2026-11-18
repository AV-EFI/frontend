import { ref, type Ref } from 'vue';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

const state = new Map<string, Ref<unknown>>();
const route = { fullPath: '/missing-page' };

vi.mock('#app', () => ({
  useRoute: () => route,
  useState: (key: string, init: () => unknown) => {
    if (!state.has(key)) state.set(key, ref(init()));
    return state.get(key);
  },
}));

const { useRandomFilmQuote } = await import('~/composables/useRandomFilmQuote');

describe('useRandomFilmQuote', () => {
  beforeEach(() => {
    state.clear();
    route.fullPath = '/missing-page';
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('picks a quote of the requested error type with its film details', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);

    const quote = useRandomFilmQuote('500').value;

    expect(quote).toMatchObject({ film: 'Das Cabinet des Dr. Caligari', year: '1919/1920' });
    expect(quote?.text).toContain('Cesare!');
  });

  test('keeps the pick of a page call, so hydration shows the server-rendered quote', () => {
    const random = vi.spyOn(Math, 'random').mockReturnValue(0);
    const serverQuote = useRandomFilmQuote('404').value;

    random.mockReturnValue(0.99);

    expect(useRandomFilmQuote('404').value).toEqual(serverQuote);
  });

  test('draws again for another error page call', () => {
    const random = vi.spyOn(Math, 'random').mockReturnValue(0);
    const firstQuote = useRandomFilmQuote('404').value;

    route.fullPath = '/another-missing-page';
    random.mockReturnValue(0.99);

    expect(useRandomFilmQuote('404').value).not.toEqual(firstQuote);
  });
});
