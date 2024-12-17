//import pkg from 'vue-diff/dist/index.umd.js'; // This is the path to the UMD build of vue-diff
//const Diff = pkg;//node_modules\vue-diff\dist\index.umd.js
//const Diff = pkg;
import {Diff} from 'vue-diff';
//const {Diff} = pkg.install;
import 'vue-diff/dist/index.css';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component('Diff', Diff);
});