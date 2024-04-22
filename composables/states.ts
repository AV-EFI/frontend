//const { locale, availableLocales } = useI18n();
export const useColor = () => useState<string>('color', () => 'pink');
//export const useLocale = () => useState<string>('locale', () => useI18n().locale.value);