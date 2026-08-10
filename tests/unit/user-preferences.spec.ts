import { describe, expect, test } from 'vitest';
import {
  DEFAULT_USER_PREFERENCES,
  USER_PREFERENCES_STORAGE_KEY,
  USER_PREFERENCE_LEGACY_KEYS,
  patchUserPreferences,
  readUserPreferences,
} from '~/utils/userPreferences';

function createStorage(initial: Record<string, string> = {}): Storage {
  const values = new Map(Object.entries(initial));

  return {
    get length() {
      return values.size;
    },
    clear: () => values.clear(),
    getItem: (key: string) => values.get(key) ?? null,
    key: (index: number) => Array.from(values.keys())[index] ?? null,
    removeItem: (key: string) => {
      values.delete(key);
    },
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
  };
}

describe('user preference storage', () => {
  test('returns default preferences without browser storage', () => {
    expect(readUserPreferences(null)).toEqual(DEFAULT_USER_PREFERENCES);
  });

  test('migrates legacy preference keys into the unified object shape', () => {
    const storage = createStorage({
      [USER_PREFERENCE_LEGACY_KEYS.theme]: 'avefi_dark',
      [USER_PREFERENCE_LEGACY_KEYS.searchResultViewType]: 'table',
      [USER_PREFERENCE_LEGACY_KEYS.workNavigationVisible]: 'false',
      [USER_PREFERENCE_LEGACY_KEYS.workFilterDropdownViewMode]: 'badges',
    });

    expect(readUserPreferences(storage)).toEqual({
      version: 1,
      appearance: {
        theme: 'avefi_dark',
      },
      search: {
        resultViewType: 'table',
      },
      workDetail: {
        navigationVisible: false,
        filterDropdownViewMode: 'badges',
      },
    });
  });

  test('patches unified preferences and mirrors legacy keys during transition', () => {
    const storage = createStorage();

    const next = patchUserPreferences({
      search: {
        resultViewType: 'flat',
      },
      workDetail: {
        navigationVisible: false,
      },
    }, storage);

    expect(next.search.resultViewType).toBe('flat');
    expect(next.workDetail.navigationVisible).toBe(false);
    expect(JSON.parse(storage.getItem(USER_PREFERENCES_STORAGE_KEY) || '{}')).toEqual(next);
    expect(storage.getItem(USER_PREFERENCE_LEGACY_KEYS.searchResultViewType)).toBe('flat');
    expect(storage.getItem(USER_PREFERENCE_LEGACY_KEYS.searchResultViewTypeSecondary)).toBe('flat');
    expect(storage.getItem(USER_PREFERENCE_LEGACY_KEYS.workNavigationVisible)).toBe('false');
  });
});
