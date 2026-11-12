import { getResponseHeader, setResponseHeader } from 'h3';

// Headers that need no product decision: AVefi uses no camera, microphone or location, and
// browsers should not guess content types. Route rules that set one of them explicitly win.
const SECURITY_HEADERS: Readonly<Record<string, string>> = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('beforeResponse', (event) => {
    for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
      if (getResponseHeader(event, name) === undefined) {
        setResponseHeader(event, name, value);
      }
    }
  });
});
