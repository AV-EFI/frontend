export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('error', (error, { event }) => {
    const statusCode = Number(
      (error as { statusCode?: number; status?: number })?.statusCode ??
      (error as { statusCode?: number; status?: number })?.status ??
      event?.node?.res?.statusCode,
    );

    if (statusCode === 429) {
      console.warn('Nitro rate limit:', {
        method: event?.method,
        path: event?.path,
        statusCode,
      });
      return;
    }

    console.error('Nitro error:', {
      method: event?.method,
      path: event?.path,
      statusCode: Number.isFinite(statusCode) ? statusCode : undefined,
    });
    console.error('Nitro error stack:', error.stack || error);
  });
});
