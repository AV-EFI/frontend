# Issues And Risks

This list is prioritized for later cleanup. It is intentionally biased toward architecture, security, and maintenance risk rather than style issues.

## Recently addressed on this branch

- sensitive Elasticsearch credentials and mail-related config are no longer mirrored into `runtimeConfig.public`
- `/admin/*` is now covered by `middleware/auth.global.ts`
- CMS mutation routes now enforce an interim server-side auth session check
- public runtime config now has canonical keys for major URL concepts: `siteUrl`, `apiUrl`, `elasticApiBase`, `searchApiPath`, `searchRouteBase`
- auth integration follows the new backend contract (read-only `GET /auth/session`, `POST /auth/refresh`, `POST /auth/signout`, CSRF double-submit) and lives in `utils/auth/*` behind `plugins/auth.ts`; `AuthProvider.vue` was removed
- local-vs-CI build modes now exist so normal frontend work does not always trigger full generation, prerender, and link checking

## Critical

### 1. External data access is inconsistent and leaks infrastructure shape

Examples:

- `pages/res/[prefix]/[id].vue` still fetches directly from public `elasticApiBase`
- `searchConfig_avefi.ts` hard-codes an Elasticsearch host IP
- other flows go through Nitro endpoints

Impact:

- impossible to reason about one consistent trust boundary
- harder to secure, mock, or move backends
- frontend becomes coupled to backend topology

## High

### 2. Runtime config still carries compatibility aliases

The public runtime layer now has canonical keys, but it still exposes legacy aliases for compatibility:

- `AVEFI_INTERNAL_API`
- `AVEFI_ELASTIC_API`
- `PUBLIC_AVEFI_ELASTIC_API`
- `AVEFI_ELASTIC_API_SEARCH_ENDPOINT`
- `AVEFI_SEARCH`
- `SEARCH_URL`
- `AVEFI_SEARCH_URL`

Impact:

- new code can still pick the wrong name
- the repo can drift back into inconsistent usage unless aliases are removed after migration

### 3. Legacy and active code are mixed in the same source tree

Symptoms:

- `/protected/*` tools still ship with the public app
- old FormKit schema JSON still present
- Vuex-era `stores/index.ts` remains
- one orphan Cypress component spec remains: `components/global/ThemeSwitch.cy.ts`

Impact:

- slower onboarding
- higher regression risk during refactors
- no clear boundary between production code and archival code

### 4. Generated docs and generated files are mixed with handwritten code

Symptoms:

- `docs/components/` and `docs/composables/` look generated
- generated schema data and generated TS sit inside normal source folders

Impact:

- easy to edit the wrong file
- hard to trust documentation freshness
- PR diffs become noisy

### 5. Auth integration: known gaps

State, keepalive, CSRF handling and cross-tab sync are separated into `utils/auth/*` (unit-tested without Nuxt) and wired by `plugins/auth.ts`; `composables/useAuth.ts` is a thin accessor. The previous module-level singleton state and per-call storage listeners are gone. Remaining gaps, checked against the backend repository (`app/routers/auth.py`, `app/helpers/auth.py`):

Backend behavior (owner: backend)

- `POST /auth/refresh` only exchanges tokens when the access token has already expired (`classify() == "refreshable"`). For an active token it returns the unchanged session. The effective lifetime is therefore the fixed refresh-token expiry; activity does not slide it, and inactivity does not shorten it. This contradicts the intended behavior "inactivity expires the session, activity extends it". A sliding inactivity limit would need its own backend field.
- `expires_at` is `refresh_expires_at`, or `access_expires_at` when no refresh expiry is known. In the second case a session counts as `refreshable` after the access token expired, so `GET /auth/session` reports `authenticated: true` with an `expires_at` in the past. The frontend mitigates this (re-check at most once per minute, renewal only through activity), but the contract should state whether such a session is valid.
- `GET /auth/csrf` is declared `-> CsrfToken` but returns a `JSONResponse`; the body matches the schema, the declaration does not.

Frontend

- Not verified end to end: only unit tests and an SSR start were run. Login, refresh, sign-out, multi-tab behavior and the 403 retry have not been exercised in a browser against the testbed backend, whose rollout was reported as not yet error-free.
- The keepalive throttle is a fixed 60 seconds. The real session lifetime is not documented; a lifetime close to or below one minute would not be covered.
- Other tabs learn about a renewed session only at their next expiry check, not immediately.
- Sign-out clears local state even when `POST /auth/signout` fails, so a still-valid server session can reappear on the next load.
- The CSRF token is cached in memory; the backend cookie expires after one hour, which is covered by the single retry on 403.
- `useAuth()` casts `useNuxtApp().$auth` because vue-tsc does not resolve plugin-provided `$` properties in this project (see `scripts/typecheck.mjs`).
- The auth endpoints are fixed constants in `utils/auth/endpoints.ts` (backend names such as `/auth/signin/academiccloud`). The former `AUTH_*_ENDPOINT` environment overrides no longer exist, so the paths must change together with the backend and the reverse-proxy `/auth/` rule.
- `stores/index.ts` still contains an unused Vuex-style `isAuthenticated` getter (`state.auth.loggedIn`).
- `me.vue` shows the locally anchored expiry (`expiresAtLocal`), which can be in the past for a refreshable session (see above).

### 6. Encoding problems are already visible in source strings

Many files contain mangled text such as `Ã¼`, `â€¦`, and similar artifacts in comments and some user-facing strings.

Impact:

- SEO metadata and UI copy can degrade
- maintainers lose confidence in file encoding safety

## Medium

### 7. There are concrete stale or placeholder files

- `composables/useMail.ts` is empty
- `types/AVefiUser.ts` is empty
- `config/metaIconConfig.json` is empty
- `pages/nuxt.config.ts` is effectively a no-op

### 8. Test coverage exists but is still uneven

Current state:

- Vitest unit/source-guard coverage exists for components, composables, stores, middleware, and API handlers
- Playwright smoke, SEO, contact, and live backend API contract suites exist
- data-quality reporting suites exist and are intentionally report-first
- CI runs zero-warning lint + unit contracts, typecheck, accessibility smoke, and backend API contracts as required gates
- one orphan Cypress component spec: `components/global/ThemeSwitch.cy.ts`
- coverage remains thinner for protected/internal tooling, POC explorer surfaces, and broad visual regressions beyond the basic accessibility smoke

### 9. Generation scripts still carry surprising side effects

`scripts/generate-interfaces.mjs` does more than pure generation:

- it manages a temporary git clone
- it performs hard resets inside that clone
- it prepends eslint-disable headers across all `models/**/*.ts`

That is too much hidden behavior for a script that sounds like interface generation only.

Related issue:

- the repository now has a fast local build mode, but the strict build path is still expensive because generation itself has not been made incremental yet
- even the fast path still performs a real SSR production build, so local iteration should continue to prefer `npm run dev`

### 10. The image pipeline has drifted away from runtime usage

Observed in `public/img`, `scripts/optimize-images.mjs`, and homepage media usage:

- generator widths do not match the widths that `pages/index.vue` actually requests
- stale generated families remain in `public/img`
- legacy logo derivative names (`-h80`, `-80`) are no longer used
- `report-image-metadata.mjs` maintains a second stale target list

Impact:

- unnecessary repository weight and larger public asset footprint
- difficult to know which files are source assets vs generated outputs
- future image changes are likely to keep producing more dead files unless generation becomes manifest-driven

### 11. Facet state has no single owner

Snapshot date: 2026-10-06. Proposed, not decided; needs a product/engineering decision before work starts.

Where applied-facet state is read or written today:

- `components/search/InstantSearchTemplateAVefi.vue` (about 1700 lines): reads the production-year range from the URL, derives `currentRefinements`, and builds the router state mapping (`stateToRoute`).
- `components/input/VueSlider.vue`: keeps its own applied range and "production year only" state.
- `components/search/PanelRefinementListComp.vue` and `composables/useSearchFacetToggle.ts`: set list refinements.
- `composables/searchRefinementCoordinator.ts`: coordinates refinement actions.
- `composables/useIsFacetRefined.ts`: reads "is this facet filtered" from the URL query for the active-facet dot in the panel header.

Symptoms and evidence:

- `ais-panel`'s `hasRefinements` only means that the facet offers values, so it cannot mark active facets. It is true for almost every panel.
- `inject('$_ais_state')` in `InstantSearchTemplateAVefi.vue` resolves to nothing with the installed `vue-instantsearch`, so `currentRefinements` and the `aisState` branches there are effectively dead code.
- "Is a filter applied" therefore has to be rebuilt per consumer from the URL or from component-local state. These sources can disagree, for example while the router update is pending.

Proposed direction:

1. Inventory first (no code change): who reads and writes facet state, and which unit, contract and e2e tests cover it.
2. Read side: one shared composable or store exposes the applied filters, `isRefined(attribute)` and the active-facet list. The URL stays the persisted form.
3. Write side: move setting and clearing filters behind the same module once tests cover it.

Risks and constraints:

- InstantSearch keeps its own state. A second source of truth is worse than the current spread, so the store must be driven through `stateMapping` or `onStateChange`.
- Search and routing are sensitive surfaces (see `AGENTS.md`). Run the closest unit, contract and e2e coverage; the e2e checks need the backend.
- Do this as its own ticket and branch, not alongside UI changes.

## Lower-priority but worth tracking

- public and protected UX live in the same deployment artifact
- plugin injection is used where composables would likely be simpler
- there is a mix of Options API and Composition API without a clear rule
- `docs/` was already populated before this analysis, but without a clear docs ownership model

## Good candidates for first cleanup passes

1. Remove legacy public runtime-config aliases once all consumers are migrated.
2. Standardize on Nitro as the only external-data boundary.
3. Split active app code from legacy/protected/internal tooling.
4. Replace the interim frontend auth guard with the final backend/Keycloak-backed authorization model.
5. Replace the hardcoded image generator with a shared image manifest plus a cleanup mode.
6. Expand targeted tests before large structural refactors, especially for protected/internal tooling and POC surfaces.
7. Give facet state a single owner (see item 11), starting with an inventory.
