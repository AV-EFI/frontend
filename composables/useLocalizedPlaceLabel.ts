import { computed } from 'vue';

type NamedValue = {
    has_name?: string;
    label?: string;
};

export type PlaceValue = {
    has_name?: string;
    has_alternate_name?: Array<string | NamedValue> | string | NamedValue;
};

const extractLabel = (value: string | NamedValue | null | undefined): string => {
  if (!value) return '';
  if (typeof value === 'string') return value.trim();
  return String(value.has_name || value.label || '').trim();
};

export const useLocalizedPlaceLabel = () => {
  const { locale } = useI18n();

  const isEnglish = computed(() => {
    const localeValue = typeof locale === 'string' ? locale : locale?.value;
    return String(localeValue || '').toLowerCase().startsWith('en');
  });

  const getLocalizedPlaceLabel = (place?: PlaceValue | null): string => {
    if (!place) return '';

    const primary = String(place.has_name || '').trim();
    const alternate = Array.isArray(place.has_alternate_name)
      ? place.has_alternate_name.map(extractLabel).find(Boolean) || ''
      : extractLabel(place.has_alternate_name);

    if (isEnglish.value) {
      return alternate || primary;
    }

    return primary || alternate;
  };

  return {
    getLocalizedPlaceLabel
  };
};
