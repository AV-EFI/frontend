# Frontend Test Skeleton

This folder is the first regression safety-net scaffold mapped to:

- `docs/repo-analysis/behavior-baseline.md`
- `docs/repo-analysis/component-behavior-contracts.md`

## Structure

- `tests/e2e/`: Playwright smoke + SEO behavior checks
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

## Environment knobs

- `PLAYWRIGHT_BASE_URL`: override target app URL
- `PLAYWRIGHT_NO_WEBSERVER=true`: skip auto-starting `yarn dev:local`
- `E2E_DETAIL_PATH`: stable detail path used by smoke detail test

Default detail route:

- `/res/21.11155/A37FAC2F-2527-4DFE-94FB-5C18D2569406`
