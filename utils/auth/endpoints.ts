/**
 * Backend auth routes. They are served un-prefixed at the site root (not under `/rest/v1`) and
 * routed to the backend by the reverse proxy, so they are the same in every environment.
 */
export const AUTH_ENDPOINTS = {
  session: '/auth/session',
  refresh: '/auth/refresh',
  signout: '/auth/signout',
  csrf: '/auth/csrf',
  signin: '/auth/signin/academiccloud',
} as const;
