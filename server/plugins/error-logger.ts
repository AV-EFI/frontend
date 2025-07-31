export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('error', (error, { event }) => {
    console.error('Event:', event)
    console.error('🚨 Nitro error stack:', error.stack || error);
  });
});