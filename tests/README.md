# Frontend Test Skeleton

This folder is the first regression safety-net scaffold mapped to:

- `docs/repo-analysis/behavior-baseline.md`
- `docs/repo-analysis/component-behavior-contracts.md`

## Structure

- `tests/e2e/`: Playwright smoke + SEO behavior checks
- `tests/e2e/api/`: live backend contract suites (OpenAPI/search/detail/negative/edge)
- `tests/e2e/seo/`: SEO + sitemap runtime route/API checks
- `tests/e2e/utils/`: strict runtime payload validators used by e2e suites
- `tests/unit/components/`: component-level interaction tests with Vue Test Utils
- `tests/unit/api/internal/`: API contract tests for Nuxt-owned handlers
- `tests/unit/api/outbound/`: API wrapper tests for calls that fan out to external services (Python backend / ES)
- `tests/unit/source-guards/`: Vitest contract guards against critical source-level regressions

## Commands

- `yarn test`: run all Vitest tests from `tests/unit`
- `yarn test:unit`: run unit contract guards
- `yarn test:unit:watch`: watch-mode unit contract guards
- `yarn test:e2e:list`: list Playwright tests
- `yarn test:e2e`: run Playwright tests
- `yarn test:e2e:smoke`: browser smoke + SEO canonical tests
- `yarn test:e2e:api`: backend OpenAPI contract suite
- `yarn test:e2e:api:edge`: backend edge-case contract suite
- `yarn test:e2e:api:openapi`: OpenAPI document/path/schema checks
- `yarn test:e2e:api:detail`: detail endpoint contract checks
- `yarn test:e2e:api:search`: search endpoint contract checks
- `yarn test:e2e:api:search-matrix`: sitemap-derived search URL matrix checks
- `yarn test:e2e:api:negative`: invalid request/path negative checks
- `yarn test:e2e:api:health`: health endpoint checks
- `yarn test:ci:fast`: required lint + unit lane used in CI
- `yarn test:ci:lint`: lint-only helper command
- `yarn test:ci:api`: backend API contract lane used in CI

## Environment knobs

- `PLAYWRIGHT_BASE_URL`: override target app URL
- `PLAYWRIGHT_NO_WEBSERVER=true`: skip auto-starting `yarn dev:local`
- `E2E_DETAIL_PATH`: stable detail path used by smoke detail test

Default detail route:

- `/res/21.11155/A37FAC2F-2527-4DFE-94FB-5C18D2569406`
