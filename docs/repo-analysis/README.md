# Repo Analysis

This directory documents the current state of the AVefi frontend repository as of 2026-04-16.

The repository already contains `docs/components/` and `docs/composables/`, but those appear to be generated or partially stale API-style docs. The files in `docs/repo-analysis/` are intended to be architecture and maintenance notes for humans.

Update 2026-07-27: for current UX/design handover, start with `../README.md`, `../../UX.md`, `../../DESIGN.md`, and `../components/handover-audit.md`. Some inventories below are older snapshots and should be checked against current source before deletion or refactoring decisions.

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
- `../components/handover-audit.md`: current handover map for high-value components, shared classes, stale generated docs, and test anchors
- `generation-and-schema.md`: schema sources, generation scripts, and generated outputs
- `issues-and-risks.md`: prioritized technical and architectural concerns
- `testing-strategy.md`: recommended test pyramid and rollout plan
- `behavior-baseline.md`: app-level behavior contract before refactoring
- `component-behavior-contracts.md`: high-risk component contracts and regression checks
- `test-contract-mapping.md`: mapping from behavior contracts to implemented unit/e2e/backend contract coverage

## Reading order

1. Read `architecture.md` for the current shape of the app.
2. Read `build-modes.md` before changing scripts, CI, or generation behavior.
3. Read `images.md` before cleaning `public/img` or changing `generate:images`.
4. Read `inventory.md` for the repo map and likely dead-code candidates.
5. Read `../components/handover-audit.md` before component or shared-class work.
6. Read `issues-and-risks.md` before making larger refactors.
7. Use `testing-strategy.md` to turn the findings into a safer migration plan.
8. Use `behavior-baseline.md` as functional contract during refactors.
9. Use `component-behavior-contracts.md` to derive regression tests.
10. Use `test-contract-mapping.md` to locate implemented test coverage and open gaps.
