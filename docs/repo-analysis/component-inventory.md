# Component Inventory

This file used to contain a static usage snapshot for every file under `components/`. That snapshot named files that have since been removed, so it is no longer kept as a detailed inventory.

## Current Status

As of the 2026-08-13 source check:

- `components/` contains 100 Vue components.
- `components/global/ThemeSwitch.cy.ts` is the only non-Vue file directly under the component tree.
- `docs/components/` contains 99 generated component pages, excluding `index.md` and `handover-audit.md`.
- `components/global/MaintenanceBanner.vue` is the one current Vue component without a matching generated component page.

## Current Sources Of Truth

- Use `../components/handover-audit.md` for the current component handover map, shared-class reference, and generated-doc freshness status.
- Use `inventory.md` for current directory counts, route surfaces, generated artifacts, and known stale-file candidates.
- Use source search (`rg`) before deleting or refactoring any component. Nuxt auto-imports, dynamic components, and aliases can hide usage from simple static inventories.

## Regeneration Note

Do not manually recreate the old detailed list without also documenting the script or process used to generate it. A future maintained inventory should be generated from the current source tree and checked against `docs/components/` in the same run.
