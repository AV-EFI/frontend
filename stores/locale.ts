import {defineStore} from 'pinia';
const { locale, locales, setLocale } = useI18n();
type LocaleCode = 'de' | 'en';
const localeCodes = () => locales.value.map((entry) => typeof entry === 'string' ? entry : entry.code) as LocaleCode[];

export const useLocaleStore = defineStore('localeStore', {
  state: () => ({
    locale: (locale.value || 'de') as LocaleCode,
    localesAvail: localeCodes()
  }),
  actions: {
    setLocale(nextLocale: LocaleCode) {
      this.locale = nextLocale;
      setLocale(nextLocale);
      //locales.value = locale;
    }
  },
  getters: {
    getLocale: (state) => {
      return state.locale;
    },
    getAllLocalesAvail: () => {
      return localeCodes().filter(i => i !== locale.value);
    }
  }
});
