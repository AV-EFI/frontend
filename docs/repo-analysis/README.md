# Repo Analysis

This directory documents the current state of the AVefi frontend repository as of 2026-03-16.

The repository already contains `docs/components/` and `docs/composables/`, but those appear to be generated or partially stale API-style docs. The files in `docs/repo-analysis/` are intended to be architecture and maintenance notes for humans.

## Quick facts

- Framework: Nuxt 4, Vue 3, Nitro, Pinia, Nuxt i18n, Tailwind 4, DaisyUI, FormKit
- Source size snapshot:
  - `components/`: 117 files
  - `pages/`: 33 files
  - `layouts/`: 13 files
  - `plugins/`: 14 files
  - `composables/`: 22 files
  - `stores/`: 6 files
  - `server/api/`: 30 files
  - `scripts/`: 14 files
- Existing docs snapshot:
  - `docs/components/`: 82 files
  - `docs/composables/`: 36 files

## Files in this folder

- `architecture.md`: runtime architecture and data flow
- `build-modes.md`: local-vs-CI build behavior and generation cost
- `images.md`: image usage audit, stale asset candidates, and generator cleanup plan
- `inventory.md`: route, component, generated-file, and stale-file inventory
- `component-inventory.md`: full component list with static usage signals
- `generation-and-schema.md`: schema sources, generation scripts, and generated outputs
- `issues-and-risks.md`: prioritized technical and architectural concerns
- `testing-strategy.md`: recommended test pyramid and rollout plan
- `behavior-baseline.md`: app-level behavior contract before refactoring
- `component-behavior-contracts.md`: high-risk component contracts and regression checks
- `test-contract-mapping.md`: mapping from behavior contracts to the initial automated test skeleton

## Reading order

1. Read `architecture.md` for the current shape of the app.
2. Read `build-modes.md` before changing scripts, CI, or generation behavior.
3. Read `images.md` before cleaning `public/img` or changing `generate:images`.
4. Read `inventory.md` for the repo map and likely dead-code candidates.
5. Read `issues-and-risks.md` before making larger refactors.
6. Use `testing-strategy.md` to turn the findings into a safer migration plan.
7. Use `behavior-baseline.md` as functional contract during refactors.
8. Use `component-behavior-contracts.md` to derive regression tests.
9. Use `test-contract-mapping.md` to locate implemented test coverage and open gaps.
