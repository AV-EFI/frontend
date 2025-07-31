// plugins/nitroLogger.ts
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('error', (error, { event }) => {
    console.error('🚨 Nitro error:', error.stack || error, 'URL:', event.path);
  });
});
