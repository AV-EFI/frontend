import { DiffMatchPatch } from "diff-match-patch-ts";

export default defineNuxtPlugin((nuxtApp) => {
    //return nuxtApp.provide('diffMatchPatch', DiffMatchPatch);
    //nuxtApp.vueApp.use('')
    return {
        provide: {
            diffMatchPatch: DiffMatchPatch
        }
    };
});