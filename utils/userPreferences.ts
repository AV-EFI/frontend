export type AvefiThemeMode = 'avefi_light' | 'avefi_dark';
export type SearchResultViewType = 'accordion' | 'flat' | 'table' | 'compact';
export type WorkFilterDropdownViewMode = 'list' | 'badges';

export interface AvefiUserPreferences {
  version: 1;
  appearance: {
    theme: AvefiThemeMode;
  };
  search: {
    resultViewType: SearchResultViewType;
  };
  workDetail: {
    navigationVisible: boolean;
    filterDropdownViewMode: WorkFilterDropdownViewMode;
  };
}

export type AvefiUserPreferencePatch = {
  appearance?: Partial<AvefiUserPreferences['appearance']>;
  search?: Partial<AvefiUserPreferences['search']>;
  workDetail?: Partial<AvefiUserPreferences['workDetail']>;
};

type StorageLike = Pick<Storage, 'getItem' | 'setItem'>;

export const USER_PREFERENCES_STORAGE_KEY = 'avefi.userPreferences.v1';

export const USER_PREFERENCE_LEGACY_KEYS = {
  theme: 'avefi-color-mode',
  searchResultViewType: 'avefi-search-viewTypeChecked',
  searchResultViewTypeSecondary: 'avefi-view-type',
  workNavigationVisible: 'avefi.work.navigationVisible',
  workFilterDropdownViewMode: 'avefi.work.filterDropdownViewMode',
} as const;

export const DEFAULT_USER_PREFERENCES: AvefiUserPreferences = {
  version: 1,
  appearance: {
    theme: 'avefi_light',
  },
  search: {
    resultViewType: 'accordion',
  },
  workDetail: {
    navigationVisible: true,
    filterDropdownViewMode: 'list',
  },
};

function cloneDefaultPreferences(): AvefiUserPreferences {
  return {
    version: DEFAULT_USER_PREFERENCES.version,
    appearance: {
      ...DEFAULT_USER_PREFERENCES.appearance,
    },
    search: {
      ...DEFAULT_USER_PREFERENCES.search,
    },
    workDetail: {
      ...DEFAULT_USER_PREFERENCES.workDetail,
    },
  };
}

function getBrowserStorage(): StorageLike | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isStoredThemeMode(value: unknown): value is AvefiThemeMode | 'dark' {
  return value === 'avefi_light' || value === 'avefi_dark' || value === 'dark';
}

function normalizeThemeMode(value: unknown): AvefiThemeMode | null {
  if (!isStoredThemeMode(value)) return null;
  return value === 'dark' ? 'avefi_dark' : value;
}

function isSearchResultViewType(value: unknown): value is SearchResultViewType {
  return value === 'accordion' || value === 'flat' || value === 'table' || value === 'compact';
}

function isWorkFilterDropdownViewMode(value: unknown): value is WorkFilterDropdownViewMode {
  return value === 'list' || value === 'badges';
}

function parseBoolean(value: string | null): boolean | null {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return null;
}

function readStoredPreferences(storage: StorageLike): Partial<AvefiUserPreferences> {
  const raw = storage.getItem(USER_PREFERENCES_STORAGE_KEY);
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw);
    return isRecord(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function normalizePreferences(value: Partial<AvefiUserPreferences>): AvefiUserPreferences {
  const appearance: Record<string, unknown> = isRecord(value.appearance) ? value.appearance : {};
  const search: Record<string, unknown> = isRecord(value.search) ? value.search : {};
  const workDetail: Record<string, unknown> = isRecord(value.workDetail) ? value.workDetail : {};

  return {
    version: 1,
    appearance: {
      theme: normalizeThemeMode(appearance.theme) ?? DEFAULT_USER_PREFERENCES.appearance.theme,
    },
    search: {
      resultViewType: isSearchResultViewType(search.resultViewType)
        ? search.resultViewType
        : DEFAULT_USER_PREFERENCES.search.resultViewType,
    },
    workDetail: {
      navigationVisible: typeof workDetail.navigationVisible === 'boolean'
        ? workDetail.navigationVisible
        : DEFAULT_USER_PREFERENCES.workDetail.navigationVisible,
      filterDropdownViewMode: isWorkFilterDropdownViewMode(workDetail.filterDropdownViewMode)
        ? workDetail.filterDropdownViewMode
        : DEFAULT_USER_PREFERENCES.workDetail.filterDropdownViewMode,
    },
  };
}

function applyLegacyPreferences(
  preferences: AvefiUserPreferences,
  storage: StorageLike,
  storedPreferences: Partial<AvefiUserPreferences>
): AvefiUserPreferences {
  const storedAppearance = isRecord(storedPreferences.appearance) ? storedPreferences.appearance : null;
  const storedSearch = isRecord(storedPreferences.search) ? storedPreferences.search : null;
  const storedWorkDetail = isRecord(storedPreferences.workDetail) ? storedPreferences.workDetail : null;
  const next: AvefiUserPreferences = {
    version: 1,
    appearance: {
      ...preferences.appearance,
    },
    search: {
      ...preferences.search,
    },
    workDetail: {
      ...preferences.workDetail,
    },
  };

  if (!storedAppearance || !('theme' in storedAppearance)) {
    const legacyTheme = normalizeThemeMode(storage.getItem(USER_PREFERENCE_LEGACY_KEYS.theme));
    if (legacyTheme) next.appearance.theme = legacyTheme;
  }

  if (!storedSearch || !('resultViewType' in storedSearch)) {
    const legacyViewType =
      storage.getItem(USER_PREFERENCE_LEGACY_KEYS.searchResultViewType) ??
      storage.getItem(USER_PREFERENCE_LEGACY_KEYS.searchResultViewTypeSecondary);
    if (isSearchResultViewType(legacyViewType)) next.search.resultViewType = legacyViewType;
  }

  if (!storedWorkDetail || !('navigationVisible' in storedWorkDetail)) {
    const legacyNavigationVisible = parseBoolean(storage.getItem(USER_PREFERENCE_LEGACY_KEYS.workNavigationVisible));
    if (legacyNavigationVisible !== null) next.workDetail.navigationVisible = legacyNavigationVisible;
  }

  if (!storedWorkDetail || !('filterDropdownViewMode' in storedWorkDetail)) {
    const legacyFilterMode = storage.getItem(USER_PREFERENCE_LEGACY_KEYS.workFilterDropdownViewMode);

    if (isWorkFilterDropdownViewMode(legacyFilterMode)) next.workDetail.filterDropdownViewMode = legacyFilterMode;
  }

  return next;
}

function mirrorLegacyPreferences(preferences: AvefiUserPreferences, storage: StorageLike) {
  storage.setItem(USER_PREFERENCE_LEGACY_KEYS.theme, preferences.appearance.theme);
  storage.setItem(USER_PREFERENCE_LEGACY_KEYS.searchResultViewType, preferences.search.resultViewType);
  storage.setItem(USER_PREFERENCE_LEGACY_KEYS.searchResultViewTypeSecondary, preferences.search.resultViewType);
  storage.setItem(USER_PREFERENCE_LEGACY_KEYS.workNavigationVisible, String(preferences.workDetail.navigationVisible));
  storage.setItem(USER_PREFERENCE_LEGACY_KEYS.workFilterDropdownViewMode, preferences.workDetail.filterDropdownViewMode);
}

export function readUserPreferences(storage = getBrowserStorage()): AvefiUserPreferences {
  if (!storage) return cloneDefaultPreferences();

  const storedPreferences = readStoredPreferences(storage);
  return applyLegacyPreferences(
    normalizePreferences(storedPreferences),
    storage,
    storedPreferences
  );
}

export function saveUserPreferences(
  preferences: AvefiUserPreferences,
  storage = getBrowserStorage()
): AvefiUserPreferences {
  const normalized = normalizePreferences(preferences);
  if (!storage) return normalized;

  storage.setItem(USER_PREFERENCES_STORAGE_KEY, JSON.stringify(normalized));
  mirrorLegacyPreferences(normalized, storage);
  return normalized;
}

export function patchUserPreferences(
  patch: AvefiUserPreferencePatch,
  storage = getBrowserStorage()
): AvefiUserPreferences {
  const current = readUserPreferences(storage);
  const next: AvefiUserPreferences = {
    version: 1,
    appearance: {
      ...current.appearance,
      ...patch.appearance,
    },
    search: {
      ...current.search,
      ...patch.search,
    },
    workDetail: {
      ...current.workDetail,
      ...patch.workDetail,
    },
  };

  return saveUserPreferences(next, storage);
}
