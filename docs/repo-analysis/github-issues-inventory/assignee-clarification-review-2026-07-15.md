# Issue Assignee and Clarification Review, 2026-07-15

Source: fresh read-only checks against `AV-EFI/AVefi-Issues` on 2026-07-15.

Scope: open GitHub issues were reviewed for likely wrong assignees, missing backend/auth prerequisites, duplicate backlog entries, and issues that need product or domain clarification before implementation.

Important process note: after the first cleanup pass, further GitHub issue changes are decision-gated. This document records analysis and decisions only.

## Current Snapshot

- Open issues after cleanup: 52.
- Closed as superseded/generic during cleanup:
  - `#58` Redaktionelle Bearbeitung von Datensaetzen, covered by `#138`, `#132`, and the RD issues.
  - `#61` Aehnliche Datensaetze / Empfehlungssystem, covered by `#145` to `#148`.
- `steffolino` assignments are now limited to a small set of frontend, review, low-priority, or consciously retained issues.

## Architecture Decision

For the editorial and protected-workflow features, the recommended sequence is:

1. Build and verify authentication and authorization first.
2. Define backend contracts for protected actions.
3. Implement frontend editing, validation display, conflict UI, and save flows against those stable contracts.

Reasoning:

- The frontend cannot reliably enforce roles, auditability, conflict prevention, versioning, or persistence by itself.
- Productive editorial features need backend support for update endpoints, permissions, validation, conflict responses, and logging.
- Frontend prototypes can exist, but production behavior should follow the auth/backend foundation.

## Decisions Already Reflected in Issues

### `#129` RD-01 Rollen- und Rechteverwaltung

Current assignee: `EOltmanns`.

Decision: assignment is correct. Required backend/auth prerequisites are missing.

### `#130` RD-02 Aenderungs- und Versionshistorie

Current assignee: `EOltmanns`.

Decision: assignment is correct. Required backend/versioning prerequisites are missing.

### `#131` RD-03 Konflikt-Handling bei paralleler Bearbeitung

Current assignee: `EOltmanns`.

Decision: cannot be solved frontend-only. A new comment records that backend must define how concurrent edits are detected and handled.

Frontend can show local warnings, same-browser tab warnings, and conflict UI. It cannot reliably detect other users editing, set locks, prevent stale updates, or enforce merge/block/overwrite behavior without backend support.

### `#134` RD-06 Redaktions-Dashboard

Current assignee: `EOltmanns`.

Decision: backend API points are missing. `steffolino` was removed.

### `#215` Editierbares Profil

Current assignee: `EOltmanns`.

Decision: first clarify authentication-system capabilities. `steffolino` was removed.

Note: the issue was originally created by `app/sync-by-unito` on 2024-06-20 and contains the Unito/Trello sync marker.

### `#65` Sortierung in der Suche

Current assignees: `EOltmanns`, `tennismann3000`.

Decision: `steffolino` was removed. The issue remains for renewed presentation to the metadata working group.

### `#170` Normdatenaustausch

Current assignees: `EOltmanns`, `tennismann3000`.

Decision: clarification is open whether Andreas should implement the next step. A comment was added to the issue.

### `#206` Legal/Lizenzen

Current assignee: `EOltmanns`.

Decision: `steffolino` was removed. Still waiting for license decision feedback.

## Remaining Decision Points

### `#132` RD-04 Redaktionsmodus fuer Werk-, Manifestations- und Item-Metadaten

Current assignees: `steffolino`, `EOltmanns`.

Status:

- Blocked by `#153` authentication.
- Productive implementation also needs update dataset endpoint(s), validation behavior, versioning, and save/conflict semantics.
- Existing editor components are prototype/merge-oriented and contain comments such as "disable until backend done" and "refactor when backend done".

Recommendation:

Keep `steffolino` only if the issue is intentionally kept as the later frontend implementation container. Otherwise remove frontend assignment until auth and update contracts exist.

### `#133` RD-05 Validierungslogik fuer Pflicht- und Qualitaetsfelder

Current assignees: `steffolino`, `EOltmanns`.

Decision from review:

`steffolino` should check whether required fields and other validation rules are derivable from the schema.

Technical note:

The schema contains signals such as `required: true`, `minLength`, and `maxLength` in `models/interfaces/schema/model.yaml`. The open question is whether these can be transformed into runtime FormKit/frontend rules or whether backend/schema validation remains the source of truth.

Recommendation:

Keep as a small research/TODO item. If backend validation is needed, keep `EOltmanns` involved.

### `#156` SEARCH-08 Expertenmodus und Einfacher Modus

Current assignee: `steffolino`.

Decision:

Assignment is acceptable. May need later detailed clarification.

### `#128` Navigation zwischen Suchtrefferliste und Detailansicht

Current assignees: `steffolino`, `tennismann3000`.

Status:

Known points were implemented, including multi-tab sync. Final check by `tennismann3000` is requested.

Recommendation:

If only acceptance is open, `steffolino` can be removed after confirmation or the issue can be closed after successful review.

### `#169` SEARCH-11 Clickable facets and entity names

Current assignees: `steffolino`, `tennismann3000`, `C-Stemmler`.

Status:

Latest discussion suggests most points may be solved. Remaining open scope appears to be point 8 and possibly relation to `#155`, especially how to communicate facet vs query search behavior.

Recommendation:

Decide whether to:

- close if accepted,
- keep only the unresolved facet/query communication point,
- or split remaining behavior into a smaller follow-up issue.

### `#187` Wartungshinweis bei Service-Unterbrechung

Current assignees: `steffolino`, `JStratil`.

Status:

Very low priority. Implementation needs a decision on where the maintenance notice is controlled.

Recommendation:

Keep parked/low priority. Do not treat as active frontend work.

### `#201` Hermann-Schlenker-Link im Carousel

Current assignees: `steffolino`, `JStratil`.

Status:

Very low priority.

Recommendation:

Keep parked or close if no longer relevant. Do not treat as active frontend work.

## Still Worth Checking for Close / Acceptance

### `#207` Fehlerhafte Zuordnung der Normdaten-IDs

Current assignee: `tennismann3000`.

Status:

Productively deployed; needs test and possible close.

### `#81` Items gefiltert und konsistent zur Manifestation anzeigen

Current assignees: `tennismann3000`, `C-Stemmler`.

Status:

Comment says testing was successful and MUSTHAVE was removed.

Recommendation:

Check whether any residual work exists. If not, close.

### `#194` Kuebelkind Exemplar Aufloesung

Current assignees: `JStratil`, `tennismann3000`.

Status:

Last visible state is backlog cleanup; earlier discussion contains substantive design questions.

Recommendation:

Needs current status: still desired, covered elsewhere, or should be split/closed.

## Superseded Issues

### `#58` Redaktionelle Bearbeitung von Datensaetzen

Closed as covered by more specific editorial/backend issues:

- `#138`
- `#132`
- related RD issues for roles, versioning, validation, and dashboard

### `#61` Aehnliche Datensaetze / Empfehlungssystem

Closed as generic/obsolete. Continued by:

- `#145` algorithmic basis logic
- `#146` display in work view
- `#147` transparent similarity criteria
- `#148` recommendations API endpoint

## Issues That Look Correctly Routed

- `#49` Backend/Match-and-Merge blocker, depends on `#154`.
- `#50` domain decision for conflicting metadata.
- `#52` backend/editorial workflow.
- `#60` product/domain decision for data provenance display.
- `#75` PID registration.
- `#77` PID resolve.
- `#78` PID versioning definition.
- `#79` PID duplicate detection definition.
- `#86` conceptual/domain decision for manifestation/item topology.
- `#91` identifier editing in editorial system.
- `#93` duplicate detection and matching rules.
- `#94` completeness indicator, needs field and scoring rules.
- `#136`, `#138`, `#139`, `#140`, `#141`, `#143`, `#144` auth/backend/editorial workflow cluster.
- `#145`, `#146`, `#147`, `#148` recommendations cluster.
- `#150` export scope definition.
- `#151` genre harmonization/domain decision.
- `#152` data-stock sizing/data strategy.
- `#153` GWDG Keycloak/auth.
- `#154` Match and Merge backend.
- `#155` backend/search behavior.
- `#161` schema/data-delivery adjustments.
- `#170` normdata follow-up, pending Andreas clarification.
- `#182` PID resolve/highlighting, mixed domain/technical.
- `#202` ingest/data cleanup for duplicate subjects.
- `#206` license decision.
- `#215` auth-system profile capabilities.
