const STORAGE_KEY = 'latest-search-query';

declare global {
    interface Window {
        __avefiSearchSyncPatched?: boolean;
    }
}

export default defineNuxtPlugin(() => {
    if (!import.meta.client) {
        return;
    }

    const writeToStorage = () => {
        if (typeof window === 'undefined') {
            return;
        }
        try {
            localStorage.setItem(STORAGE_KEY, window.location.search || '');
        } catch (error) {
            console.error('Failed to persist latest search query', error);
        }
    };

    type HistoryMethod = typeof window.history.pushState;

    const patchHistoryMethod = (method: 'pushState' | 'replaceState') => {
        const original = window.history[method] as HistoryMethod;
        if (typeof original !== 'function') {
            return;
        }

        window.history[method] = function (...args: Parameters<HistoryMethod>) {
            const result = original.apply(this, args);
            queueMicrotask(writeToStorage);
            return result;
        } as HistoryMethod;
    };

    if (!window.__avefiSearchSyncPatched) {
        window.__avefiSearchSyncPatched = true;
        patchHistoryMethod('pushState');
        patchHistoryMethod('replaceState');
        window.addEventListener('popstate', () => queueMicrotask(writeToStorage));
    }

    writeToStorage();
});
