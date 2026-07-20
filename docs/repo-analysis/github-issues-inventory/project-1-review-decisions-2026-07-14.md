# Project 1 Review Decisions - 2026-07-14

Source batch: `project-1-review-batches.md`

This note records the follow-up consolidation after the 2026-07-13 consolidation pass.

## Refreshed GitHub Snapshot

- Project 1 items exported: `145`
- Open issues in project snapshot after consolidation: `56`
- Closed issues in project snapshot after consolidation: `89`
- Missing labels after consolidation: `17`
- Missing project status after consolidation: `41`

No repository product code was changed.

## Automation Update

- Added `docs/repo-analysis/github-issues-inventory/project-1-triage-decisions.json`.
- Updated `scripts/github-project-review-batches.mjs` so open issues recorded in that file are skipped by generated review batches.
- Purpose: already-decided, waiting, parked, very-low-priority, or blocked issues should not reappear in future generated triage batches unless new information arrives.

## GitHub Updates Applied

- Correction after live review: `#121`, `#122`, `#123`, `#126`, and `#127` were already closed before the `#153` assignment pass. The mistaken `EOltmanns` assignment and `B L O C K E D` label were removed again, and the misleading triage comments were deleted.
- Commented on `AV-EFI/AVefi-Issues#129`, `#130`, `#131`, `#132`, and `#133`: all are blocked by `#153` / authentication.
- Assigned those open issues directly to `EOltmanns`.
- Added `B L O C K E D` to those open issues.
- Verified `#121`, `#122`, `#123`, `#126`, and `#127` are closed and no longer assigned to `EOltmanns`.
- Verified `#129`, `#130`, `#131`, `#132`, and `#133` remain open, assigned to `EOltmanns`, and blocked.
- Commented on `AV-EFI/AVefi-Issues#134`, `#136`, `#138`, `#139`, `#140`, `#141`, `#143`, `#144`, `#145`, and `#146`: all are blocked by `#153` / authentication.
- Assigned those issues directly to `EOltmanns`.
- Added `B L O C K E D` to those issues.
- Verified `#134`, `#136`, `#138`, `#139`, `#140`, `#141`, `#143`, `#144`, `#145`, and `#146` remain open, assigned to `EOltmanns`, and blocked.
- Recorded triage decisions for `#148`, `#150`, `#151`, `#152`, `#153`, `#154`, `#161`, `#170`, and `#182`; no GitHub issue metadata was changed for those because they are active, assigned elsewhere, waiting for other groups, or already correctly routed.
- Verified `#174` is already closed, so no GitHub change was needed.
- Recorded triage decisions for `#194`, `#202`, and `#207`; no GitHub issue metadata was changed because `#194` works as-is/low priority, `#202` is not Stefan-owned, and `#207` was already commented and assigned to `tennismann3000`.
- Verified `#214` is already closed.
- Commented on `AV-EFI/AVefi-Issues#215`: blocked by `#153` / authentication and editable-profile definition still needed.
- Assigned `#215` to `EOltmanns` and added `B L O C K E D`.
- Strict routing pass after escalation:
  - Closed `#46` as obsolete predecessor of `#75`.
  - Routed `#49` and `#52` to `EOltmanns` only, kept/added `B L O C K E D`, and documented that these are backend/match-and-merge/redaction-workflow blockers, not frontend tasks.
  - Routed `#50` and `#60` to `C-Stemmler` and `tennismann3000` because the remaining work is fachliche/product decision, not Stefan implementation.
  - Recorded `#75`, `#77`, `#78`, and `#79` as correctly assigned PID/backend issues.
  - Recorded `#81` as already assigned to `C-Stemmler` and `tennismann3000`, not Stefan-owned.
- Final routing consolidation for the remaining generated owner-routing items:
  - Routed `#86` to `C-Stemmler` and `tennismann3000`; the UI shape/scope/interaction is still undefined.
  - Marked `#91` and `#93` as backend/redaction/match-and-merge blockers, kept with `EOltmanns`, and added `B L O C K E D`.
  - Removed `steffolino` from `#94`; the completeness score needs data-quality definition first, so it is routed to `C-Stemmler`, `tennismann3000`, and `EOltmanns`.

## Current Generated Batch

The current generated review batch contains:

- Verification candidates: `0`
- Frontend triage: `0`
- Owner routing: `0`
- Open issues skipped by documented triage decisions: `50`

After applying the latest triage decisions, current owner-routing candidates are:
No issues selected for this batch.

## Wiedervorlage 2026-07-15

Read-only content-to-assignee check after the strict routing pass. Do not treat this as completed triage; these are tomorrow's focused follow-up candidates.

- `#58`: Redaktionsbearbeitung von Datensaetzen is also blocked by Keycloak/Auth integration. Current assignee/content shape should be revisited; this is not Stefan-only implementation work.
- `#61`: Recommendation system is frontend/domain-looking but needs product/domain/backend split before implementation ownership.
- `#62`: Manifestation tektonik display is frontend/domain-looking and overlaps conceptually with `#86`; needs a clear UI/domain decision before implementation ownership.
- `#63`: Search epic / gezielte Suche reads more like search/backend/product coordination than a concrete Stefan frontend task.
- `#129`, `#130`, `#131`, `#133`: Stefan is still co-assigned, but the content is backend/auth/redaction logic and already blocked. Check whether Stefan should be removed.
- `#215`: Stefan is still co-assigned, but the issue is Keycloak/Auth/profile-definition blocked. Check whether Stefan should be removed.

Lower-risk/context notes for tomorrow:

- `#65`: Sorting in search remains mixed UI/backend/UX decision; do not let it fall back to Stefan-only.
- `#141`, `#146`, `#182`: frontend-looking, but currently blocked or assigned elsewhere; revisit only if the blocker is resolved or ownership changes.
- `#169`, `#170`, `#202`, `#206`: not urgent frontend consolidation; keep as routed/waiting unless new information arrives.
