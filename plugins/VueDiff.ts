import { Diff } from 'vue-diff';
import 'vue-diff/dist/index.css';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component('Diff', Diff);
});