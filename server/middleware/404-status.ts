import { defineEventHandler, setResponseStatus, getRequestURL } from 'h3';

export default defineEventHandler((event) => {
  const url = getRequestURL(event);
  const path = url.pathname;
  
  console.log('[404 Middleware] Checking path:', path);
  
  // Check if this is a catch-all route that should return 404
  // Exclude known valid routes
  const validPrefixes = [
    '/search',
    '/res/',
    '/film/',
    '/serial/',
    '/normdata/',
    '/protected/',
    '/admin/',
    '/contact',
    '/vocab',
    '/imprint',
    '/dataprotection',
    '/signout',
    '/compare_altern',
    '/_nuxt/',
    '/api/',
    '/img/',
    '/vid/',
    '/favicon',
    '/robots',
  ];
  
  // Root path is valid
  if (path === '/') {
    return;
  }
  
  // If path doesn't match any valid prefix and isn't a file, it's a 404
  const isValidRoute = validPrefixes.some(prefix => path.startsWith(prefix));
  const isFile = path.includes('.');
  
  if (!isValidRoute && !isFile) {
    console.log('[404 Middleware] Setting 404 status for:', path);
    setResponseStatus(event, 404);
  }
});
