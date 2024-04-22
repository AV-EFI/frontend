// plugins/myPiniaPlugin.ts
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

export default defineNuxtPlugin(({ $pinia }: any) => {
    $pinia.use(piniaPluginPersistedstate);
});