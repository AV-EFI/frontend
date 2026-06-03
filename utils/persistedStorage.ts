type PersistedStorage = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
};

export const persistedLocalStorage: PersistedStorage = {
  getItem: (key) => import.meta.client ? window.localStorage.getItem(key) : null,
  setItem: (key, value) => {
    if (import.meta.client) {
      window.localStorage.setItem(key, value);
    }
  },
};

export const persistedSessionStorage: PersistedStorage = {
  getItem: (key) => import.meta.client ? window.sessionStorage.getItem(key) : null,
  setItem: (key, value) => {
    if (import.meta.client) {
      window.sessionStorage.setItem(key, value);
    }
  },
};
