# AVefi Issues Consolidation Report

Generated: 2026-07-06

Updated: 2026-07-14 after duplicate/orphan cleanup, frontend/owner triage, and the `#153` blocked-assignment pass.

This report consolidates context from the AV-EFI Phase 1 proposal, the AVefi Plus Phase 2 proposal, the Phase 1 project/time-plan attachment, and the current GitHub Project 1 issue inventory. Project 1 means `AVefi User Stories Kanban (ALL User Stories)`, not the Public Release Board. It is intended as a proposal for the next cleanup batch.

## Sources

- `docs/repo-analysis/AV-EFI-Projektantrag_Beschreibung_des_Vorhabens (2).pdf`
- `docs/repo-analysis/Anlage_AV-EFI_-_Projekt-_und_Zeitplanung.pdf`
- `docs/repo-analysis/AVefi_plus_-_Beschreibung _des _Vorhabens.pdf`
- `docs/repo-analysis/github-issues-inventory/project-1-items.json`
- `docs/repo-analysis/github-issues-inventory/project-1-classified.json`
- `docs/repo-analysis/github-issues-inventory/project-1-code-cross-check.json`
- Live GitHub label list for `AV-EFI/AVefi-Issues`

The PDF extraction was text-based via `pypdf`; page references are approximate because PDF text flow is not always linear.

## Current Backlog Snapshot

Project 1 / `AVefi User Stories Kanban (ALL User Stories)` snapshot after the latest cleanup refresh:

- Project items: `145`
- Open issues in Project 1: `56`
- Closed issues in Project 1: `89`
- Repository coverage: all Project 1 items are now in `AV-EFI/AVefi-Issues`
- Missing assignees: `0`
- Missing labels: `17`
- Missing milestone: `122`
- Missing project status: `41`

Important board hygiene finding:

- Transferred issues `#217`, `#218`, and `#219` were reviewed on 2026-07-13.
- `#218` was selected as the canonical `SEARCH-01` facet-count issue, assigned to `steffolino`, added to Project 1, and later closed on 2026-07-13 because the original bug was fixed.
- `#219` was closed as an exact duplicate of `#218`.
- `#217` was closed as a malformed transferred duplicate/orphan: its title duplicated closed `#220`, while its body mapped to export work already represented by open `#150` and historical closed `#221`.
- Project 3 / `AVefi: Public Release Board` is no longer the working board after the June 2026 public release. On 2026-07-06, open Project 3 issues `#152`, `#158`, `#161`, `#182`, `#194`, `#202`, `#203`, and `#207` were confirmed in/transferred to Project 1, commented in German with the cleanup rationale, and removed from Project 3. Project 3 now has `0` open issues; remaining items are closed/historical and were left untouched in that pass.
- Old `sync-by-unito[bot]` imported issues were assigned to `steffolino` and received a German audit comment. The original bot author cannot be replaced in GitHub, so this records practical ownership instead.
- On 2026-07-14, open redaction/auth-dependent issues `#129`-`#134`, `#136`, `#138`-`#141`, and `#143`-`#146` were documented as blocked by `#153` and assigned to `EOltmanns`. A mistaken same treatment of already-closed `#121`, `#122`, `#123`, `#126`, and `#127` was undone the same day.
- Also on 2026-07-14, `#148`, `#150`, `#151`, `#152`, `#153`, `#154`, `#161`, `#170`, and `#182` were documented as already routed, active, waiting for other groups, implemented/low-priority, or not Stefan-owned. `#174` was verified as already closed. A last comment by `steffolino` is not treated as ownership when an issue is assigned elsewhere.
- Later on 2026-07-14, `#194`, `#202`, and `#207` were documented as low-priority/as-is, not Stefan-owned, or already assigned to `tennismann3000`; `#214` was verified closed; `#215` was commented as blocked by `#153`, assigned to `EOltmanns`, and labeled `B L O C K E D`.
- A final strict routing pass on 2026-07-14 closed obsolete `#46`, routed backend/blocker work (`#49`, `#52`, `#75`, `#77`, `#78`, `#79`, `#91`, `#93`) to `EOltmanns`, and routed domain/product-decision work (`#50`, `#60`, `#81`, `#86`, `#94`) to `C-Stemmler`/`tennismann3000` as appropriate. The generated owner-routing batch is now empty.
- A read-only content-to-assignee check on 2026-07-14 identified follow-up candidates for 2026-07-15: `#58` is also blocked by Keycloak/Auth integration; `#61`, `#62`, and `#63` need ownership/scope review; Stefan co-assignment on backend/auth-heavy `#129`, `#130`, `#131`, `#133`, and `#215` should be reviewed.

## Phase 1 AP Extraction

Phase 1 was the initial AV-EFI build-up phase. Public release is completed as of June 2026, so Phase 1 items should now mostly be treated as implemented, closed, historical, or follow-up only if still relevant after launch.

| AP | Title | Main intent | Issue-mapping implications |
| --- | --- | --- | --- |
| AP1 | Konzeption, Anforderungsanalyse, Koordination | Governance, guidelines, user stories, requirements, sustainability planning, project communication. | Map old user-story collectors, governance, legal/operations, and requirements issues here only when they are not implementable frontend/backend tasks. |
| AP1.1 | Grundbedingungen in Richtlinien | Collaboration principles, metadata handling, transparency, FAIR principles, editorial principles. | Related to `#199`, legal/license/governance issues, editorial rules, and data-use principles. |
| AP1.2 | Anforderungsanalyse Forschungscommunity und Archive | User stories, archive/research requirements, editorial requirements, service-level requirements. | Explains many old Trello-style user-story issues; use this as historical source rather than keeping vague duplicates open. |
| AP1.3 | Kostenkalkulation und Verstetigung | Sustainability, operational cost, long-term operation. | Product/domain or project-ops area, not frontend. |
| AP1.4 | Projektmanagement und Projektkommunikation | Project coordination, workshops, stakeholder communication. | Usually out of implementation backlog unless it became a concrete platform feature. |
| AP2 | Metadatenmanagement | Selection and analysis of holdings, schema work, matching/disambiguation, PID interfaces, documentation. | Maps to metadata model, data quality, duplicate detection, similarity, PID, and backend/data issues. |
| AP2.1 | Kriterien fuer Bestandsauswahl | Criteria for selecting and analyzing specific holdings. | Product/domain decision area. |
| AP2.2 | Fassungen, Gattungen, analoge Objekte; Schemaerweiterung | Schema extension and conceptual modeling. | Maps to data model and detail-display issues; not pure frontend unless fields are already defined. |
| AP2.3 | Abgleichkonzeption und Aehnlichkeitsparameter | Matching concept, similarity parameters, thresholds. | Maps to duplicates, recommendations, match/merge, `#49/#216`, `#61`, `#147`, `#154`. |
| AP2.4 | Auswahl Praxispartner-Bestaende | Selecting practice-partner holdings and institutional connection. | Maps to data acquisition/import and source institution display. |
| AP2.5 | Schnittstellen ins PID-System | Technical PID-system interfaces. | Maps to PID and backend/API issues. |
| AP2.6 | Dokumentation und Evaluation | Documentation/evaluation of metadata work. | Usually documentation/QA, not feature implementation. |
| AP3 | Technischer Systementwurf | PID infrastructure, service layer, central system integration, synchronization workflows, documentation. | Maps to backend/API/indexing, PID, Elasticsearch/Neo4j, sync/import. |
| AP3.1 | PID-Infrastruktur | PID base service. | PID issues and persistent identifier display/querying. |
| AP3.2 | Service-Ebene fuer Validierung | Validation service based on schemas and rules. | Backend/data-quality issues; possibly `#99`, `#144`, `#153` depending on auth. |
| AP3.3 | Integration der Datensaetze | Integration in central system, PID output, generated metadata. | Backend/data import and indexing. |
| AP3.4 | Synchronisationsworkflows | Synchronization routines and coordination. | Backend/data import; not frontend unless status/progress must be shown. |
| AP3.5 | Dokumentation und Evaluation | Technical documentation and evaluation. | Documentation and QA. |
| AP4 | GUI-Entwicklung | Low-fidelity prototype, usability tests, functional GUI prototype, responsive design integration, summative evaluation. | Maps to current frontend/UI issues, but many Phase 1 GUI stories are now launch-complete and should be closed, linked, or rewritten. |
| AP4.1 | Low-fidelity prototype | Wireframes for search, detail/identifier views, landing/project pages, later editorial area. | Historical origin of search/detail/landing/editorial issues. |
| AP4.2 | Formative usability testing | Test users and feedback-driven prototype adjustment. | Usability issues should reference concrete findings; vague UX collectors should close or become parent issues. |
| AP4.3 | Functional prototype | Search, browsing, facets, short/detail views, local source links, editorial user area. | Maps to search/facets/detail/navigation/editorial UI issues. |
| AP4.4 | Design integration | Responsive design/template development. | Most likely implemented; remaining issues need specific defects or acceptance criteria. |
| AP4.5 | Summative usability testing | Final evaluation and documentation. | QA/usability area. |

## AVefi Plus AP Extraction

AVefi Plus is Phase 2 and should become the main organizing context for future-facing work. Issues that were "later" or "folgeantrag" candidates should be checked against these APs.

| AP | Title | Main intent | Issue-mapping implications |
| --- | --- | --- | --- |
| AP1 | Projektmanagement und Datenakquise | Operating model, risk analysis, further data-source acquisition, project communication. | Maps to operating model, partner/data-source acquisition, and project communications. |
| AP1.1 | Organisatorisches Betriebsmodell inkl. Risikoanalyse | Establish sustainable operating model, roles, responsibilities, funding, risk analysis. | Governance/project-ops issues; not frontend. |
| AP1.2 | Datenakquise | Acquire additional data deliveries, especially film-related materials and further AV holdings. | Data acquisition/import, partner onboarding, source institutions. |
| AP1.3 | Projektmanagement und Kommunikation | Coordination, workshops, implementation plan, metadata-delivery coordination. | Project management/ops. |
| AP2 | Metadatenmanagement | Extend metadata model to film-related materials, support data delivery, improve normdata/GND linkage, documentation. | Major future backlog source. |
| AP2.1 | Filmbegleitende Materialien | Requirements and concept for research/display of film-related materials such as posters, photos, production files, textiles. | Real gap: no strong issue coverage for LIDO/film-related-materials scope. |
| AP2.2 | Ausweitung des Datenschemas | Extend AVefi schema for relationships between works, manifestations, items, and film-related materials; LIDO mapping. | Real gap: create/route schema/model issues before UI work. |
| AP2.3 | Support bei Datenlieferung und Schnittstellenanbindung | Mapping support, controlled vocabulary, data transfer/export/import workflows. | Backend/data and documentation; possible partner support tooling. |
| AP2.4 | Enge Normdatenanbindung mit Fokus GND | GND-linked records, BEACON file, future display in GND Explorer, stronger linked-open-data integration. | Partial coverage through `#170`; needs stronger GND/BEACON/LOD tracking. |
| AP2.5 | Dokumentation und Evaluation | Extend interface/data-model documentation for film-related materials. | Documentation/QA. |
| AP3 | Community Building und Datenkompetenzfoerderung | Data sprints, webinars/talks, open self-learning materials, documentation/evaluation. | Mostly not product backlog unless platform pages or learning materials need implementation. |
| AP3.1 | Community Events | Data sprints and community events. | Project/community label, not frontend by default. |
| AP3.2 | Offene Selbstlernmaterialien/OER | Develop and distribute learning material. | Documentation/content; possible website/content issue if platform-hosted. |
| AP3.3 | Dokumentation und Evaluation | Evaluate and document AP3. | Documentation. |
| AP4 | Backend-Infrastruktur | Backend changes for extended data model, matching/sync algorithms, more datasets, graph data APIs, documentation. | Major backend/API/indexing scope. |
| AP4.1 | Backend an erweitertes Datenmodell anpassen | Backend changes for AP2 schema/model. | Backend/data, Elasticsearch/Neo4j, indexing. |
| AP4.2 | Abgleich- und Synchronisationsalgorithmen ausbauen | Better matching/sync for works and film-related materials. | Dedupe/match/merge/similarity issues; backend/data. |
| AP4.3 | Weitere Datensaetze integrieren | More dataset integration and application support. | Data import/indexing/support. |
| AP4.4 | APIs fuer graphenbasierten Datenzugang | External graph API and graph access. | Real gap: current graph issues are mostly UI-ish or closed; needs explicit backend/API graph issue. |
| AP4.5 | Dokumentation und Evaluation | Backend/API documentation and evaluation. | Docs/QA. |
| AP5 | GUI-Entwicklung | Redaction/content management, extended display/search/interaction with graph view, semantic markup, usability tests/docs. | Main frontend future scope. |
| AP5.1 | Redaktionssystem und Inhaltsverwaltung | Redaction system/content management, protected workflows. | Maps to `#58`, `#129`-`#144`, `#214`, `#215`; needs clear auth/roles epic. |
| AP5.2 | Erweiterte Anzeige-, Such- und Interaktionsfunktionen mit Graphendarstellung | Graph display, extended search/display, interaction/support/feedback features. | Maps to `#166`, `#169`, `#170`, `#212`, future graph issues, interaction/feedback. |
| AP5.3 | Semantisches Markup und optimierte Frontend-Struktur | Structured data, machine-readable metadata, search engines and AI services. | Partial coverage through `#158/#159`; likely needs future structured-data/SEO issue if Phase 2 continues. |
| AP5.4 | Usability-Tests und Dokumentation | UX evaluation, interaction design, documentation for use/code reuse. | Gap: no clear active usability-testing parent issue. |

## Proposed Bounded-Context Epic Labels

The current label set mixes old flat labels such as `Filmrecherche`, `Filmanzeige`, `Performance Technisch`, and `Allgemein Rechtlich Pflicht` with newer labels such as `Epic:Navigation`, `Epic:Datenqualität`, and `Epic:Redaktion`.

Recommendation: standardize on `Epic:<Name>` for backlog contexts. Keep priority labels (`MUSTHAVE`, `SHOULDHAVE`, `COULDHAVE`, `WONTHAVE`) and type/status labels (`UserStory`, `bug`, `UNSCHARF`, `Technical-Blocker`) separate from epics.

Candidate bounded contexts:

| Proposed epic label | Purpose | Existing labels to merge/replace |
| --- | --- | --- |
| `Epic:ProjektBetrieb` | Governance, operating model, sustainability, project communication. | `folgeantrag` may remain as status/type, not epic. |
| `Epic:Datenakquise` | Partner/data-source acquisition, import support. | None consistently used. |
| `Epic:Metadatenmodell` | Schema, data model, work/manifestation/item rules. | Some `Epic:Werk`, `Epic:ManifestationItem`. |
| `Epic:FilmbegleitendeMaterialien` | LIDO/material extensions in AVefi Plus. | New. |
| `Epic:Normdaten` | GND, BEACON, linked-open-data integration. | Partly `Epic:Filmidentifikatoren`, scattered normdata issues. |
| `Epic:PID-Verwaltung` | PID issuance, lookup, display, persistence. | Existing `PID Verwaltung`, `Epic:PID-Verwaltung`. |
| `Epic:BackendAPI` | Backend, APIs, indexing, sync, Elasticsearch/Neo4j. | `Backend`, `Performance Technisch` in some cases. |
| `Epic:Search` | Search semantics, query behavior, fuzzy/exact search. | `Filmrecherche`, `Search`. |
| `Epic:Facets` | Facet definition, counts, ordering, clickable facets. | `Filmrecherche`, `Search`; parent issue `#64`. |
| `Epic:Navigation` | Search/detail navigation, breadcrumbs, tabs, scroll/URL state. | Existing `Epic:Navigation`. |
| `Epic:Detailansicht` | Work/manifestation/item detail display. | `Filmanzeige`, `Epic:ManifestationItem`. |
| `Epic:Graph` | Graph view and graph data/API access. | New/partial; closed `#213` is not enough for AVefi Plus. |
| `Epic:Redaktion` | Editorial workflows, editing, approval, logging. | Existing `Epic:Redaktion`, old `Filmidentifikatorenansicht & Redaktionssystem`. |
| `Epic:BenutzerRollenRedaktion` | Auth, roles, Keycloak, protected internal functions. | Existing `Epic:BenutzerRollenRedaktion`, `Backend` for auth pieces. |
| `Epic:Datenqualität` | Completeness, quality indicators, missing fields, data-quality feedback. | Existing `Epic:Datenqualität`, `Datenqualität`. |
| `Epic:SEO` | SEO, structured data, JSON-LD, AI crawler readability. | Existing `SEO`. |
| `Epic:LizenzenRecht` | Licenses, rights, legal/static compliance. | `Allgemein Rechtlich Pflicht`, `Epic:Lizenzen`. |
| `Epic:InteraktionFeedback` | Collections, feedback, annotations, "My AVefi", interaction primitives. | `Hilfe Feedback Kommunikation`, `Epic:Recommendations`, `#166`. |

Cross-cutting labels that should not become epics:

- `Accessibility`
- `Frontend`
- `Backend`
- `Technical-Blocker`
- `UNSCHARF`
- `UserStory`
- `bug`
- `MUSTHAVE`, `SHOULDHAVE`, `COULDHAVE`, `WONTHAVE`

## AP-to-Issue Mapping

This is a first-pass mapping. It is meant to guide cleanup; it is not a completion claim.

| Context | Relevant APs | Representative issues | Suggested cleanup action |
| --- | --- | --- | --- |
| Search parent | Phase 1 AP4.3; AVefi Plus AP5.2 | `#63`, `#155`, `#156`, `#171`, closed `#218` | Keep one search parent. `#218` was the canonical facet-count blocker and is now closed as fixed; `#217/#219` are closed. |
| Facets | Phase 1 AP4.3; AVefi Plus AP5.2 | closed `#64`, `#169`, `#101`, `#200`, closed `#218` | `#64` and `#218` were closed on 2026-07-13; keep `#169` open for domain feedback/query-search review. |
| Navigation | Phase 1 AP4.3/AP4.4 | `#120`-`#128`, plus closed `#119`, `#125` | Keep `#128` as current search/detail context issue; review whether `#120`-`#127` remain distinct or should be children of one navigation parent. |
| Detail display | Phase 1 AP4.1/AP4.3 | `#62`, `#81`-`#88`, closed `#209`, `#210`, `#213` | Mark completed where implemented; remaining open detail issues need precise acceptance criteria. |
| Metadata/data model | Phase 1 AP2; AVefi Plus AP2 | `#60`, `#62`, `#97`, `#99`, `#152`, `#170` | Route to domain/data owners before UI work. |
| Film-related materials/LIDO | AVefi Plus AP2.1/AP2.2/AP4.1/AP5.2 | no strong current issue found | Create a parent issue or label proposal before implementation. |
| Normdata/GND/LOD | Phase 1 EPT3/AP2; AVefi Plus AP2.4 | `#170`, partial `#11`, maybe normdata code/tests | Expand `#170` or create children for GND/BEACON/LOD deliverables. |
| PID | Phase 1 AP3.1/AP2.5 | `#43`, `#76`, `#79`, PID-related closed issues | Mostly implemented/closed; keep only active PID gaps. |
| Backend/API/indexing | Phase 1 AP3; AVefi Plus AP4 | `#99`, closed `#102`, closed `#107`, `#147`, closed `#149`, closed `#212` | Use `Epic:BackendAPI`; avoid putting these in frontend triage. `#102/#107/#212` were closed during 2026-07-13 triage; `#147` remains backend-blocked. |
| Graph | AVefi Plus AP4.4/AP5.2 | closed `#213`, possibly `#61`, `#147` | Create or identify explicit graph API + graph UI issues; do not reuse closed `#213`. |
| Editorial/redaction | Phase 1 AP1.2/AP4.1/AP4.3; AVefi Plus AP5.1 | `#58`, `#129`-`#144`, `#214`, `#215`, `#35`, `#50`, `#52` | Consolidate into `Epic:Redaktion` and `Epic:BenutzerRollenRedaktion`; split domain, backend, UI. |
| Auth/roles | Phase 1 AP4.1/AP4.3; AVefi Plus AP5.1 | `#136`, `#141`, `#144`, `#153`, `#215` | Create/confirm explicit auth/roles parent. |
| Data quality/completeness | Phase 1 AP2/AP3; AVefi Plus AP2/AP4/AP5.2 | `#94`, `#95`, `#97`, closed `#98`, `#99`, `#134` | `#98` was closed as partially implemented/future consideration. Remaining scoring/domain questions should be handled in concrete data-quality follow-ups. |
| SEO/structured data | AVefi Plus AP5.3 | `#158`, `#159`, `#157` | Technical SEO done in `#159`; content/structured data follow-up remains in `#158` or a new AP5.3 issue. |
| Legal/licenses/static pages | Phase 1 AP4.1/AP4.4; AVefi Plus AP5.3 maybe | closed `#149`, `#206`, closed `#211` | Keep `#206` as legal/product pending license decision feedback; public-release label is gone. |
| Interaction/feedback/collections | AVefi Plus AP5.2 | closed `#166`, old closed feedback issues `#7`, `#18`, `#27`, recommendations `#61/#147` | `#166` was closed; create new concrete children only after a broader overview of open work and APs. |
| Usability/documentation | Phase 1 AP4.2/AP4.5; AVefi Plus AP5.4 | `#128`, closed `#188`, testing docs | `#188` was closed because the initial automated test base exists. Create explicit usability-testing/documentation parent only if still planned for AVefi Plus. |
| Community/OER | AVefi Plus AP3 | no strong current issue found | Likely project/content work, not frontend backlog unless hosted in platform. |

## Concrete Duplicate and Consolidation Candidates

Hard duplicates or already-consolidated duplicates:

| Candidate | Current state | Recommendation |
| --- | --- | --- |
| `#49` and `#216` | `#49` open; `#216` closed on 2026-07-13 as duplicate. | `#49` remains canonical. The useful read-only note from `#216` was copied into `#49`. |
| `#57` and `#224` | Both closed; same User Story ID 2/title. | Historical duplicate only; no action unless cleaning old transferred issue metadata. |
| `#25` and `#105` | Both closed; same User Story ID 44/theme: filter by source/issuing institution. | Historical duplicate; no action required. |
| `#217` and `#220` | `#217` closed on 2026-07-13; `#220` closed earlier. | No further action unless historical metadata cleanup is desired. |
| `#218` and `#219` | Both closed; `#219` duplicate of `#218`, `#218` closed as fixed on 2026-07-13. | No further duplicate action needed. |

Consolidation clusters already partly handled:

- `#119` and `#125` were closed in favor of `#128`.
- `#157` was closed as a vague SEO collector; concrete SEO remains in `#158`/`#159`.
- `#209`, `#210`, `#213` are closed; graph work should continue independently.

## Real Feature Gaps Against AVefi Plus

These are not necessarily missing from code; they are missing as clear, bounded GitHub backlog items.

| Gap | Source AP | Current issue coverage | Proposed action |
| --- | --- | --- | --- |
| LIDO / film-related materials parent | AVefi Plus AP2.1, AP2.2, AP4.1, AP5.2 | No strong issue found by title/body search. | Create `Epic:FilmbegleitendeMaterialien` parent and children for schema, import/mapping, search/display. |
| GND / BEACON / linked-open-data integration | AVefi Plus AP2.4 | Partial `#170`; weak scattered normdata references. | Expand `#170` or create children for BEACON export, GND Explorer integration, display/API implications. |
| External graph API | AVefi Plus AP4.4 | `#213` closed; no explicit graph API issue found. | Create `Epic:Graph` issue for backend graph API and separate frontend graph UI issue if needed. |
| Semantic structured markup beyond technical SEO | AVefi Plus AP5.3 | `#159` closed technical SEO; `#158` content SEO open. | Decide whether AP5.3 needs new structured-data issue for schema.org/JSON-LD at record level. |
| Auth/roles parent | AVefi Plus AP5.1; Phase 1 AP4.1/AP4.3 | Many BR/RD issues exist, but parent relationship is unclear. | Confirm `Epic:BenutzerRollenRedaktion` as parent and map `#136`, `#141`, `#144`, `#153`, `#215`. |
| Usability testing / documentation parent | AVefi Plus AP5.4 | closed `#188` covered automated tests, not usability testing. | Create or identify AP5.4 issue if formal usability/documentation deliverable remains. |
| Dedupe / match / merge parent | Phase 1 AP2.3; AVefi Plus AP4.2 | `#49`, `#93`, `#147`, `#154`, closed `#216`, `#79`. | Create/confirm one parent for similarity/match/merge; exact duplicate `#216` is already closed. |

## Suggested Cleanup Plan

Do not apply labels or close issues directly from this report. Use it as the proposal for the next reviewed batch.

1. Board hygiene first:
   - Done on 2026-07-13 for `#217`, `#218`, and `#219`: `#217/#219` are closed and `#218` was closed as fixed after being selected as canonical.
   - Project 3 / `AVefi: Public Release Board` no longer has open issues after the 2026-07-06 transfer; only closed/historical Project 3 items remain for optional archival cleanup.

2. Normalize epic labels:
   - Approve the `Epic:<Name>` bounded-context list.
   - Create missing labels only after approval.
   - Map old flat epic labels to new labels in a batch.

3. Close or link hard duplicates:
   - Done on 2026-07-13 for `#49/#216`, `#217/#220`, and `#218/#219`.

4. Create or rewrite AVefi Plus parent issues:
   - Film-related materials/LIDO
   - Graph API / graph view split
   - GND/BEACON/LOD
   - Auth/roles parent
   - Usability/documentation parent
   - Match/merge parent

5. Then continue issue cleanup in AP order:
   - Phase 1 closed/implemented cleanup first.
   - AVefi Plus future scope second.
   - Product/domain decision issues routed before implementation labels.

## Proposed Next Human Review Questions

1. Should `#217`, `#218`, and `#219` be added to Project 1, or should they be closed as transferred duplicates?
2. Is the `Epic:<Name>` label list acceptable, or should German names be preferred?
3. Should AVefi Plus become a label, a milestone, or just a planning context?
4. Which AVefi Plus APs are expected to be represented in GitHub now, before implementation starts?
5. Should the old flat labels `Filmrecherche`, `Filmanzeige`, `PID Verwaltung`, `Performance Technisch`, `Allgemein Rechtlich Pflicht`, and `Filmidentifikatorenansicht & Redaktionssystem` be retired after migration?
