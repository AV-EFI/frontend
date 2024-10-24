import useColorMode from '@nuxtjs/color-mode';
/*
        preference: 'avefi_light',
        classSuffix: '',
        dataValue: 'theme',
        storageKey: 'avefi-color-mode'
*/
export const avefi_useColorMode = () => {
 const colorModeConfig = useNuxtApp().vueApp.config.globalProperties.$colorMode;
 console.log(colorModeConfig);
 return colorModeConfig;
}