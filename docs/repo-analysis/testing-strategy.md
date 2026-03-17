# Testing Strategy

## Current state

The repository has almost no dependable automated safety net.

What exists today:

- `vitest.config.ts`, but no real Vitest suite
- one Cypress-style component spec: `components/global/ThemeSwitch.cy.ts`
- node-based script tests under `scripts/tests/`
- one package script: `npm run test:normdata`

What is missing:

- unit tests for utilities, composables, stores, and server helpers
- integration tests for Nitro handlers
- e2e tests for core user journeys
- CI stages that run those tests consistently

## Recommended scheme

Use a three-layer strategy plus one separate data-quality lane.

### 1. Unit tests

Tooling:

- `vitest`
- `@vue/test-utils`
- `happy-dom` or `jsdom`

Target first:

- pure utils in `utils/`
- pure helpers in `composables/`
- Pinia stores in `stores/`
- schema/path helpers in `server/utils/`

Good first files:

- `composables/useCurrentUrlState.ts`
- `composables/useSearchHistory.ts`
- `composables/useSearchSuggestions.ts`
- `composables/useNormdataUrl.ts`
- `utils/highlight.ts`
- `utils/getDataSet.ts`
- `server/utils/pathMapping.ts`
- `server/utils/fallbackStore.ts`

### 2. Integration tests for Nitro handlers

Tooling:

- `vitest`
- `@nuxt/test-utils` for Nuxt/Nitro-aware bootstrapping

Test with mocked dependencies, not live Elasticsearch.

Target first:

- `server/api/mail/contact.post.ts`
- `server/api/log/client.post.ts`
- `server/api/cms/modeltree.get.ts`
- `server/api/cms/modelhints.get.ts`
- `server/api/cms/usertooltips.get.ts`
- `server/api/poc/*`
- `server/api/elastic/*` wrappers with fetch mocked

The goal is to verify request validation, response shape, and error handling.

### 3. End-to-end tests

Preferred tooling:

- Playwright

Reason:

- the repo already lacks Cypress setup
- Playwright is strong for SSR + routing + preview-build testing
- it works well for "build once, test real routes" flows

Core smoke flows:

- home page loads and search mode switch works
- search page accepts a query and renders a result list
- detail page loads for a known stable handle
- compare page handles both invalid and valid query params
- press page renders and download links exist
- vocab page renders and search query state is synced
- unauthenticated access to `/protected/*` redirects away
- `/admin/*` is denied once auth is added

## Separate lane: data-quality and network smoke tests

Keep the current node-based tests, but treat them as a separate class:

- `scripts/tests/normdata-identifiers.test.mjs`
- `scripts/tests/suggest-normdata-matching.test.mjs`

These should not block fast unit-test feedback unless they are run against stable fixtures or a dedicated nightly job.

## Suggested CI pipeline

### Pull request / merge request

- lint
- typecheck
- unit tests
- Nitro integration tests

### Main branch or nightly

- build preview artifact
- Playwright smoke suite
- optional live data-quality tests

## Scripts worth adding

- `test`: run all fast Vitest suites
- `test:unit`
- `test:integration`
- `test:e2e`
- `typecheck`: `nuxt typecheck` or equivalent

## Rollout order

1. Add `typecheck` and a real `vitest` baseline.
2. Cover the pure server utilities and stores first.
3. Add mocked Nitro handler tests.
4. Add a tiny Playwright smoke suite for public routes.
5. Only after that, start deleting or refactoring legacy code.
