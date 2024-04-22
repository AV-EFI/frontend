import {defineStore} from 'pinia';
const { locale, locales, setLocale } = useI18n();

export const useLocaleStore = defineStore({
    id: 'localeStore',
    state: () => ({
        locale: locale || 'de',
        localesAvail: locales ||['de', 'en']
    }),
    actions: {
        setLocale(locale:string) {
            this.locale = locale;
            setLocale(locale);
            //locales.value = locale;
        }
    },
    getters: {
        getLocale: (state) => {
            return state.locale;
        },
        getAllLocalesAvail: () => {
            return (locales.value).filter(i => i !== locale.value);
        }
    }
});
