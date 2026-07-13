# Project 1 Review Batches

Generated: 2026-07-13T15:32:53.157Z

Project: [AVefi User Stories Kanban (ALL User Stories)](https://github.com/orgs/AV-EFI/projects/1)

## Snapshot

- Source items: 145
- Proposed review items: 16
- Batch size limit: 10
- GitHub changes made: none

## Batch Counts

| Batch | Count |
| --- | --- |
| Verification Candidates | 0 |
| Frontend Triage | 6 |
| Owner Routing | 10 |

## Verification Candidates

These are open issues with local evidence that may support a keep/close decision after manual acceptance review. Weak files such as scripts, docs, generated schema files, and generic i18n strings are separated from stronger runtime/test evidence.

No issues selected for this batch.

## Frontend Triage

These are open frontend-scope issues where the local evidence suggests either missing work or partial implementation.

| Issue | Bucket | State | Owner area | Evidence score | Strong evidence files | Proposed review action |
| --- | --- | --- | --- | --- | --- | --- |
| AV-EFI/AVefi-Issues#128 | qa_or_acceptance_needed | partial | Accessibility/QA | 12 | .\components\detail\InstitutionListComp.vue<br>.\components\detail\PaginationComp.vue<br>.\components\global\BreadcrumbsComp.vue<br>.\components\global\ComparisonDrawer.vue | Define remaining acceptance criteria and split backend/domain dependencies from frontend work. |
| AV-EFI/AVefi-Issues#169 | frontend_work | partial | Frontend/UI | 11 | .\app.vue<br>.\components\detail\HasAgentComp.vue<br>.\components\detail\HasEventComp.vue<br>.\components\detail\InstitutionListComp.vue | Define remaining acceptance criteria and split backend/domain dependencies from frontend work. |
| AV-EFI/AVefi-Issues#201 | frontend_work | partial | Frontend/UI | 10 | .\assets\scss\main.scss<br>.\components\detail\FilmRelatedMaterialsComp.vue<br>.\components\global\BaseCarousel.vue<br>.\components\global\CardList.vue | Define remaining acceptance criteria and split backend/domain dependencies from frontend work. |
| AV-EFI/AVefi-Issues#206 | qa_or_acceptance_needed | partial | Accessibility/QA | 9 | .\app.vue<br>.\components\global\VocabViewer.vue<br>.\MATOMO_SETUP.md<br>.\nuxt.config.ts | Define remaining acceptance criteria and split backend/domain dependencies from frontend work. |
| AV-EFI/AVefi-Issues#187 | frontend_work | partial | Frontend/UI | 7 | .\components\micro\ContactForm.vue<br>.\pages\accessibility.vue<br>.\pages\faq.vue<br>.\pages\vocab.vue | Define remaining acceptance criteria and split backend/domain dependencies from frontend work. |
| AV-EFI/AVefi-Issues#171 | frontend_work | not_found | Frontend/UI | 0 | (weak evidence only) | Manually verify whether the issue is obsolete, external, or still missing in the frontend. |

## Owner Routing

These are open issues outside the frontend evidence scope that are missing routing metadata or need a product/domain/backend decision before implementation cleanup.

| Issue | Bucket | State | Owner area | Evidence score | Strong evidence files | Proposed review action |
| --- | --- | --- | --- | --- | --- | --- |
| AV-EFI/AVefi-Issues#147 | backend_or_data_needed | blocked_external | Backend/API/indexing | 0 | (weak evidence only) | Assign owner area and ask for decision or acceptance criteria before implementation cleanup. |
| AV-EFI/AVefi-Issues#155 | backend_or_data_needed | blocked_external | Backend/API/indexing | 0 | (weak evidence only) | Assign owner area and ask for decision or acceptance criteria before implementation cleanup. |
| AV-EFI/AVefi-Issues#156 | backend_or_data_needed | blocked_external | Backend/API/indexing | 0 | (weak evidence only) | Assign owner area and ask for decision or acceptance criteria before implementation cleanup. |
| AV-EFI/AVefi-Issues#121 | domain_logic_needed | blocked_external | Product/domain decision | 0 | (weak evidence only) | Assign owner area and ask for decision or acceptance criteria before implementation cleanup. |
| AV-EFI/AVefi-Issues#122 | domain_logic_needed | blocked_external | Product/domain decision | 0 | (weak evidence only) | Assign owner area and ask for decision or acceptance criteria before implementation cleanup. |
| AV-EFI/AVefi-Issues#123 | domain_logic_needed | blocked_external | Product/domain decision | 0 | (weak evidence only) | Assign owner area and ask for decision or acceptance criteria before implementation cleanup. |
| AV-EFI/AVefi-Issues#126 | domain_logic_needed | blocked_external | Product/domain decision | 0 | (weak evidence only) | Assign owner area and ask for decision or acceptance criteria before implementation cleanup. |
| AV-EFI/AVefi-Issues#127 | domain_logic_needed | blocked_external | Product/domain decision | 0 | (weak evidence only) | Assign owner area and ask for decision or acceptance criteria before implementation cleanup. |
| AV-EFI/AVefi-Issues#129 | domain_logic_needed | blocked_external | Product/domain decision | 0 | (weak evidence only) | Assign owner area and ask for decision or acceptance criteria before implementation cleanup. |
| AV-EFI/AVefi-Issues#130 | domain_logic_needed | blocked_external | Product/domain decision | 0 | (weak evidence only) | Assign owner area and ask for decision or acceptance criteria before implementation cleanup. |

## Notes

- This is a review proposal only. No GitHub issues, labels, assignees, milestones, or project fields were changed.
- Evidence quality is a ranking aid, not proof of completion.
- Suggested next step: review one batch at a time, then prepare an explicit GitHub update batch with comments/status/labels.
