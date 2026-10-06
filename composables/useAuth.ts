import type { AuthService } from '~/utils/auth/authService';

/** Session state and actions; the instance is created once per app by `plugins/auth.ts`. */
export function useAuth(): AuthService {
  // vue-tsc does not resolve plugin-provided `$` properties in this project (see scripts/typecheck.mjs).
  return useNuxtApp().$auth as AuthService;
}
