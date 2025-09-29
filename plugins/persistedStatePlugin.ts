/* eslint-disable @typescript-eslint/no-explicit-any */
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

export default defineNuxtPlugin(({ $pinia }: any) => {
    $pinia.use(piniaPluginPersistedstate);
    return {
        provide: {
            persistedState: piniaPluginPersistedstate
        }
    };
});