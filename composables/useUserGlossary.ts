import { ref } from 'vue';

type UserGlossaryLocale = 'de' | 'en';

type UserGlossaryRow = {
  path: string;
  de?: string;
  en?: string;
};

const entries = ref<Record<string, Partial<Record<UserGlossaryLocale, string>>>>({});
const loaded = ref(false);
let loadPromise: Promise<void> | null = null;

export function useUserGlossary() {
  const ensureLoaded = async () => {
    if (loaded.value) {
      return;
    }

    loadPromise ??= $fetch('/api/cms/usertooltips')
      .then((response) => {
        const typedResponse = response as { entries: UserGlossaryRow[] };
        entries.value = Object.fromEntries(
          typedResponse.entries.map((entry: UserGlossaryRow) => [
            entry.path,
            {
              de: entry.de,
              en: entry.en,
            },
          ]),
        );
        loaded.value = true;
      })
      .catch((error) => {
        loadPromise = null;
        throw error;
      });

    await loadPromise;
  };

  const get = (path: string, locale: UserGlossaryLocale) => entries.value[path]?.[locale] ?? '';

  return {
    ensureLoaded,
    get,
  };
}
