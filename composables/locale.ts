import type { Ref } from 'vue';

export const useDefaultLocale = (fallback = 'de') => {
    const locale = ref(fallback);
    if (process.server) {
        const reqLocale = useRequestHeaders()['accept-language']?.split(',')[0];
        console.log(reqLocale);
        if (reqLocale) {
            locale.value = reqLocale;
        }
    } else if (process.client) {
        const navLang = navigator.language;
        console.log(navLang);
        if (navLang) {
            locale.value = navLang;
        }
    } else {
        console.log("nah");
    }
    return locale;
};

export const useLocales = () => {
    const locale = useLocale();
    const locales = ref<LocaleInstance & RtlInstance>([
        'en',
        'de'
    ]);

    if (!locales.value.includes(locale)) {
        locales.value.unshift(locale);
    }
    return locales;
};

export const useLocaleDate = (date: Ref<Date> | Date, locale = useLocale()) => {
    return computed(() => new Intl.DateTimeFormat(locale.value, { dateStyle: 'full' }).format(unref(date)));
};