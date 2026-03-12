// plugins/hydration-trace.client.ts
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.config.warnHandler = (msg, instance, trace) => {
    if (typeof msg === 'string' && msg.includes('Hydration')) {
      const i = instance as any;
      console.group('HYDRATION WARNING');
      console.log('msg:', msg);
      console.log('trace:', trace);
      console.log('name:', i?.$?.type?.name);
      console.log('file:', i?.$?.type?.__file);
      console.log('type:', i?.$?.type);
      console.groupEnd();
      debugger;
    }
  };
});