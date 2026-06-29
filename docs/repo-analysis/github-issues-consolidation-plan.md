# GitHub Issues Consolidation Plan

This guide documents the planned consolidation work for the AV-EFI GitHub issue backlog and project boards. It is intended to keep the cleanup reproducible, evidence-based, and safe to resume over multiple sessions.

Last checked: 2026-06-29.

## Scope

Primary project:

- GitHub organization: `AV-EFI`
- Issue repository: `AV-EFI/AVefi-Issues`
- Project board: `AVefi User Stories Kanban (ALL User Stories)`
- Project URL: `https://github.com/orgs/AV-EFI/projects/1`

Secondary project for comparison/release planning:

- Project board: `AVefi: Public Release Board`
- Project URL: `https://github.com/orgs/AV-EFI/projects/3`

The local frontend repository remains GitLab-first:

- `origin` must remain `git@gitlab.gwdg.de:av-efi/frontend.git`
- GitHub remote `github` is used only for GitHub extension/context integration.

## Verified GitHub Facts

The active GitHub token must include `read:project` for Project v2 access.

Verified token scopes after refresh:

- `gist`
- `read:org`
- `read:project`
- `repo`
- `workflow`

Verified Project v2 mapping:

| Project number | Title | URL | Project items |
| --- | --- | --- | ---: |
| `1` | `AVefi User Stories Kanban (ALL User Stories)` | `https://github.com/orgs/AV-EFI/projects/1` | `139` |
| `3` | `AVefi: Public Release Board` | `https://github.com/orgs/AV-EFI/projects/3` | `59` |

Important: GitHub issue search counts and Project v2 item counts can differ. Project v2 can include closed issues, draft items, mixed repositories, and field metadata that is not visible through ordinary issue search.

## Goals

1. Build a reliable inventory of all Project 1 items.
2. Classify each item by current actionability and relationship to the frontend codebase.
3. Identify duplicates, stale items, already implemented work, underspecified work, and missing business/domain logic.
4. Assign issues that need business or domain decisions to the right owners.
5. Prepare safe issue/project updates in batches with review checkpoints.

## Current Progress

Step 1 inventory started on 2026-06-29.

Generated files:

- `docs/repo-analysis/github-issues-inventory/project-1-items.json`
- `docs/repo-analysis/github-issues-inventory/project-1-items.csv`
- `docs/repo-analysis/github-issues-inventory/project-1-summary.md`

Current inventory snapshot:

- Project items reported by GitHub: `139`
- Project items exported: `139`
- Issue items exported: `139`
- Open issues in project snapshot: `94`
- Closed issues in project snapshot: `45`
- Missing assignees: `29`
- Missing labels: `21`
- Missing milestone: `116`
- Missing project status: `61`
- Duplicate issue references in project snapshot: `0`

No GitHub issues, labels, assignees, milestones, or project fields were changed during this inventory pass.

## Non-Goals

- Do not close issues during the inventory pass.
- Do not bulk-edit labels, assignees, statuses, or milestones without a review batch.
- Do not treat the GitHub board as the source of truth. Treat it as backlog data to reconcile against product state, domain rules, backend contracts, and frontend implementation.
- Do not rename or replace the GitLab `origin` remote.

## Step 1: Inventory

Create a machine-readable snapshot of Project 1.

Recommended output files:

- `docs/repo-analysis/github-issues-inventory/project-1-items.json`
- `docs/repo-analysis/github-issues-inventory/project-1-items.csv`
- `docs/repo-analysis/github-issues-inventory/project-1-summary.md`

Required fields per project item:

- Project item ID
- Project title
- Project URL
- Project field values, especially `Status`
- Content type: issue, pull request, draft item, or other
- Repository
- Issue number
- Issue URL
- Issue title
- Issue state
- Labels
- Assignees
- Milestone
- Created date
- Updated date
- Closed date
- Body excerpt or body hash
- Linked pull requests if available
- Parent issue / sub-issue signals if available

Recommended GraphQL source:

```graphql
query($org: String!, $num: Int!, $cursor: String) {
  organization(login: $org) {
    projectV2(number: $num) {
      id
      title
      url
      items(first: 100, after: $cursor) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          type
          fieldValues(first: 50) {
            nodes {
              ... on ProjectV2ItemFieldTextValue {
                text
                field { ... on ProjectV2FieldCommon { name } }
              }
              ... on ProjectV2ItemFieldSingleSelectValue {
                name
                field { ... on ProjectV2FieldCommon { name } }
              }
              ... on ProjectV2ItemFieldDateValue {
                date
                field { ... on ProjectV2FieldCommon { name } }
              }
              ... on ProjectV2ItemFieldMilestoneValue {
                milestone { title dueOn }
                field { ... on ProjectV2FieldCommon { name } }
              }
              ... on ProjectV2ItemFieldRepositoryValue {
                repository { nameWithOwner url }
                field { ... on ProjectV2FieldCommon { name } }
              }
              ... on ProjectV2ItemFieldLabelValue {
                labels(first: 20) { nodes { name color } }
                field { ... on ProjectV2FieldCommon { name } }
              }
              ... on ProjectV2ItemFieldUserValue {
                users(first: 20) { nodes { login name } }
                field { ... on ProjectV2FieldCommon { name } }
              }
            }
          }
          content {
            ... on Issue {
              number
              title
              url
              state
              createdAt
              updatedAt
              closedAt
              body
              repository { nameWithOwner url }
              labels(first: 30) { nodes { name color } }
              assignees(first: 20) { nodes { login name } }
              milestone { title dueOn }
            }
            ... on PullRequest {
              number
              title
              url
              state
              createdAt
              updatedAt
              closedAt
              repository { nameWithOwner url }
            }
            ... on DraftIssue {
              title
              body
              createdAt
              updatedAt
            }
          }
        }
      }
    }
  }
}
```

Inventory quality checks:

- Count project items and compare with Project v2 total.
- Count content types.
- Count items without issue content.
- Count issues not in `AV-EFI/AVefi-Issues`.
- Count missing assignees, labels, milestone, status, and body.
- Detect duplicate issue numbers inside the same project snapshot.

## Step 2: Initial Classification

Classify every inventory row into review buckets. This first pass should be heuristic and reversible.

Suggested fields to add to the inventory:

- `audit_bucket`
- `audit_confidence`
- `audit_reason`
- `suggested_action`
- `suggested_owner_area`
- `code_search_terms`
- `needs_human_review`

Primary buckets:

| Bucket | Meaning | Suggested action |
| --- | --- | --- |
| `actionable` | Clear issue, likely still valid | Keep and later verify against code |
| `implemented_candidate` | Title/body suggests current code may already implement it | Cross-check code and tests |
| `partial_candidate` | Some implementation likely exists, but acceptance criteria may be incomplete | Cross-check code and clarify remaining work |
| `obsolete_candidate` | Issue appears superseded by product/project direction | Mark for human review before closing |
| `duplicate_candidate` | Likely overlaps another issue | Link candidates, do not close automatically |
| `needs_clarification` | Too vague or missing acceptance criteria | Request clarification or rewrite |
| `domain_logic_needed` | Needs archival/domain/business decision before implementation | Assign to domain owner |
| `backend_or_data_needed` | Depends on API, indexing, backend, or data model | Assign to backend/data owner |
| `frontend_work` | Clear frontend implementation task | Assign to frontend owner |
| `qa_or_acceptance_needed` | Implementation may exist but needs verification/test criteria | Add QA checklist |

Heuristic signals:

- Domain/business logic:
  - `Normdaten`, `GND`, `Identifier`, `PID`, `Redaktion`, `FIAF`, `Archiv`, `Datenmodell`, `Mapping`, `Dublette`, `Disambiguierung`
- Backend/data:
  - `API`, `Elasticsearch`, `Index`, `Import`, `Aggregation`, `Query`, `Search backend`, `METS`, `OAI`, `Endpoint`
- Frontend:
  - `UI`, `Layout`, `Button`, `Filter`, `Suche`, `Detailseite`, `Carousel`, `Tab`, `Modal`, `Responsive`
- QA/acceptance:
  - `Test`, `Akzeptanz`, `Validierung`, `Smoke`, `Regression`, `A11y`
- Possible duplicate/stale:
  - Duplicate labels, same normalized title, same issue body summary, same component/route mentioned, old updated date with no assignee or status.

## Step 3: Codebase Cross-Check

This step comes after the initial inventory/classification.

For each actionable or implementation-related issue:

1. Extract search terms from title/body.
2. Search the frontend repository with `rg`.
3. Record matching files, routes, components, stores, server endpoints, tests, and docs.
4. Mark implementation state:
   - `not_found`
   - `implemented`
   - `partial`
   - `implemented_but_untested`
   - `unclear`
   - `blocked_external`

Evidence should reference local files and line numbers where possible.

## Step 4: Ownership Model

Before assigning issues, create a simple responsibility map.

Suggested owner areas:

- Frontend/UI
- Search and filters
- Detail pages
- Normdata and identifiers
- Film-related materials
- Editorial workflow
- Backend/API/indexing
- Data import/modeling
- Accessibility/QA
- Product/domain decision

For each issue with missing business/domain logic, assign an owner area first. Only assign a person once the area mapping is agreed.

## Step 5: Safe Update Batches

After review, produce batches instead of direct one-off edits.

Each batch should contain:

- Issue numbers
- Proposed labels
- Proposed assignees
- Proposed project status
- Proposed comment text
- Proposed close/duplicate action if any
- Evidence summary

Apply only after review.

Recommended batch sizes:

- 10 to 20 issues for label/status cleanup.
- 5 to 10 issues for assignee/domain-decision updates.
- 1 to 5 issues for closing or duplicate consolidation.

## Planned Changes

Initial planned changes, pending inventory:

1. Normalize labels around type, area, status, and priority.
2. Split actionable frontend work from domain/business-decision work.
3. Add missing assignees based on agreed ownership.
4. Add clarifying comments to vague issues.
5. Mark implemented candidates for verification instead of immediately closing.
6. Consolidate duplicates only after linking evidence.
7. Keep Project 1 as the broad user-story backlog and Project 3 as public release planning.

## Working Rules

- Every issue update should have a reason.
- Every close action should have a linked replacement, implementation reference, or explicit decision.
- Every assignment should be tied to an owner area.
- Avoid changing board status and issue labels in the same batch unless the relationship is obvious.
- Preserve history: comment before closing when the reason is not trivial.

## Current VS Code Issues View

The local VS Code Issues view is configured in `.vscode/settings.json`.

Current intended mapping:

- `AVefi User Stories Kanban (ALL User Stories)` uses `project:AV-EFI/1`
- `AVefi: Public Release Board` uses `project:AV-EFI/3`

Only the GitHub remote named `github` should be used by the VS Code GitHub extension to avoid duplicate query contexts. GitLab remains `origin`.
