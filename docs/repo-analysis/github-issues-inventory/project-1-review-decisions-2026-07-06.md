# Project 1 Review Decisions - 2026-07-06

Source batch: `project-1-review-batches.md`

This note records live GitHub updates made during the second cleanup pass. Generated inventory/batch files were refreshed after the updates so this pass can be resumed safely.

## Refreshed GitHub Snapshot

- Project 1 items exported: `140`
- Open issues in project snapshot after cleanup: `80`
- Closed issues in project snapshot after cleanup: `60`
- Missing labels after cleanup: `18`
- Missing project status after cleanup: `58`

No repository code was changed.

## GitHub Updates Applied

- Labeled and commented `AV-EFI/AVefi-Issues#153`: routed as auth/backend infrastructure, keep open pending productive Keycloak/Academic Cloud verification.
- Labeled and commented `AV-EFI/AVefi-Issues#188`: keep open; Vitest/Playwright/CI exist, but coverage threshold/reporting and flow coverage remain unresolved.
- Labeled and commented `AV-EFI/AVefi-Issues#187`: routed as frontend/user-story; needs decision on maintenance-banner control source and fallback behavior.
- Labeled and commented `AV-EFI/AVefi-Issues#98`: routed as data-quality/frontend/accessibility; needs definition of completeness scoring and color thresholds.
- Labeled and commented `AV-EFI/frontend#3`: keep open for now; needs canonical `AVefi-Issues` replacement or concrete detail-view acceptance criteria.
- Closed `AV-EFI/frontend#14`: superseded by canonical search backlog, especially `AV-EFI/AVefi-Issues#57`, `#155`, and `#191`.
- Closed `AV-EFI/frontend#1`: old Trello-synced search/filter container; active pieces are tracked in `AV-EFI/AVefi-Issues#63`, `#64`, `#65`, `#155`, `#156`, and `#169`.
- Closed `AV-EFI/frontend#5`: old Trello-synced search-preferences container; sorting remains in `AV-EFI/AVefi-Issues#65`, broader customization was represented by `AV-EFI/AVefi-Issues#19` and marked `WONTHAVE`.
- Commented on `AV-EFI/AVefi-Issues#64`: keep open as parent/container for facet finalization; `AV-EFI/AVefi-Issues#169` remains a separately discussed child/linked issue.
- Closed `AV-EFI/AVefi-Issues#209`: detail view is implemented; graph view work continues independently.
- Verified `AV-EFI/AVefi-Issues#210` is closed: implemented for Elasticsearch; graph view has separate follow-up work.
- Verified `AV-EFI/AVefi-Issues#213` is closed: implemented for Elasticsearch; graph work continues in new/separate issues.
- Removed `PUBLIC-RELEASE` from all `34` issues that still carried it, because the public release was completed in June 2026.
- Deleted the obsolete `PUBLIC-RELEASE` label from `AV-EFI/AVefi-Issues` after verifying no issues still used it.

## Frontend Repo Issue Transfer

All remaining `AV-EFI/frontend` issues were transferred to `AV-EFI/AVefi-Issues` so the frontend repository no longer acts as a separate issue tracker.

Open transfers:

| Old issue | New issue |
| --- | --- |
| `AV-EFI/frontend#3` | `AV-EFI/AVefi-Issues#209` |
| `AV-EFI/frontend#4` | `AV-EFI/AVefi-Issues#210` |
| `AV-EFI/frontend#6` | `AV-EFI/AVefi-Issues#211` |
| `AV-EFI/frontend#7` | `AV-EFI/AVefi-Issues#212` |
| `AV-EFI/frontend#8` | `AV-EFI/AVefi-Issues#213` |
| `AV-EFI/frontend#9` | `AV-EFI/AVefi-Issues#214` |
| `AV-EFI/frontend#11` | `AV-EFI/AVefi-Issues#215` |
| `AV-EFI/frontend#12` | `AV-EFI/AVefi-Issues#216` |
| `AV-EFI/frontend#13` | `AV-EFI/AVefi-Issues#217` |
| `AV-EFI/frontend#24` | `AV-EFI/AVefi-Issues#218` |
| `AV-EFI/frontend#25` | `AV-EFI/AVefi-Issues#219` |

Closed historical transfers:

| Old issue | New issue |
| --- | --- |
| `AV-EFI/frontend#1` | `AV-EFI/AVefi-Issues#220` |
| `AV-EFI/frontend#2` | `AV-EFI/AVefi-Issues#221` |
| `AV-EFI/frontend#5` | `AV-EFI/AVefi-Issues#222` |
| `AV-EFI/frontend#10` | `AV-EFI/AVefi-Issues#223` |
| `AV-EFI/frontend#14` | `AV-EFI/AVefi-Issues#224` |

## Current Follow-Up Queue

The refreshed frontend triage now starts with:

- `AV-EFI/AVefi-Issues#128` - keep; search/detail navigation context still needs UX proposal/implementation.
- `AV-EFI/AVefi-Issues#169` - active search/facet work; avoid cleanup edits unless owner asks.
- `AV-EFI/AVefi-Issues#155` - active fuzzy-search behavior; likely needs acceptance criteria/test evidence.
- `AV-EFI/AVefi-Issues#201` - linked active carousel issue; keep as context.
- `AV-EFI/AVefi-Issues#166` - already rewritten as interaction epic; remains open for child-issue linking.
- `AV-EFI/AVefi-Issues#206` - legal/meta license cleanup; keep routed out of frontend triage.
- `AV-EFI/AVefi-Issues#188` and `#187` - commented/routed today; no close action yet.
- `AV-EFI/AVefi-Issues#64` - keep as parent for facet finalization, especially linked discussion in `#169`.
- `AV-EFI/AVefi-Issues#211` and `AV-EFI/AVefi-Issues#171` - next likely frontend-triage review targets.

Owner-routing still contains several keep/decision issues: `#102`, `#107`, `#147`, `#149`, `#156`, `#199`, `#212`, `#66`, `#98`, and `#99`.
