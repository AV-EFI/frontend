import pkg from 'vue-diff';
const { Diff } = pkg;
import 'vue-diff/dist/index.css';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component('Diff', Diff);
});