# Domain Knowledge: Metadata → Development Contract (AVefi Frontend)

## 1. Purpose
This document defines **minimum requirements for translating metadata decisions into frontend development**.

Goal:
- ensure consistent UI behaviour
- avoid implicit assumptions in frontend code
- make domain knowledge directly usable

---

## 2. Core Principle

**Frontend must not interpret unclear domain logic.** [GESICHERT]

If a requirement is ambiguous:
- it is **not ready for implementation**

**Source:** Requirements Engineering, 2018

---

## 3. Source of Truth

### 3.1 Data Structure
- Defined in schema repository:
  https://github.com/AV-EFI/av-efi-schema

→ authoritative for:
- fields
- nesting
- data types

**Status:** [GESICHERT]

---

### 3.2 Missing Layer
Not covered by schema:
- behaviour
- interpretation
- UI implications

→ must be defined explicitly

**Status:** [GESICHERT]

---

## 4. Required Format for Dev-Ready Requirements

Every domain decision must be documented in a form that includes:

### 4.1 Definition
- What is the concept?
- What does the field represent?

---

### 4.2 Scope
- Which level?
  - Work
  - Manifestation
  - Item

---

### 4.3 Data Behaviour
- Single vs multiple values
- Optional vs required
- empty / missing handling

---

### 4.4 Relationships
- links to other entities
- cardinality (1:n, n:m)

---

### 4.5 Edge Cases
- missing data
- conflicting data
- duplicates (`same_as`)

---

### 4.6 UI Implication (mandatory)
- display rules
- grouping
- sorting
- filtering behaviour

**Without this → not implementable** [GESICHERT]

---

### 4.7 Example Data
- at least one real or realistic example

---

## 5. Non-Negotiable Frontend Constraints

### 5.1 No implicit assumptions
Frontend must not:
- guess meaning of fields
- infer relationships
- resolve ambiguity internally

**Status:** [GESICHERT]

---

### 5.2 No 1:1 assumptions
Unless explicitly defined:
- entities may have multiple relations

Example:
- Manifestation ↔ multiple Works

**Status:** [GESICHERT]

---

### 5.3 Robustness against incomplete data
UI must handle:
- missing fields
- partial records
- inconsistent entries

**Status:** [GESICHERT]

---

### 5.4 Consistency across views
Same concept must:
- behave identically in all components

**Source:** Consistency & Standards, 2019
**Status:** [GESICHERT]

---

## 6. Integration Rules (Frontend ↔ Domain)

### 6.1 Decision Traceability
Every implemented feature should be traceable to:
- a schema field
- a documented domain decision

**Status:** [BEGRENZT] (currently not always possible)

---

### 6.2 Blocking Rule
If a requirement is:
- unclear
- incomplete
- contradictory

→ implementation must be blocked until clarified

**Status:** [GESICHERT]

---

### 6.3 No Post-Hoc Fixes
Avoid:
- implementing assumptions and correcting later

→ leads to:
- technical debt
- inconsistent UX

**Status:** [GESICHERT]

---

## 7. Typical Failure Cases (Observed)

### 7.1 Undefined behaviour
- field exists, but:
  - no display rule
  - no fallback

---

### 7.2 Ambiguous relationships
- unclear mapping between:
  - Work / Manifestation / Item

---

### 7.3 Missing edge case definitions
- e.g.:
  - multiple matches
  - no matches

---

### 7.4 Inconsistent terminology
- same concept described differently

---

**Source:** Confluence Metadatenfachgruppe 2023–2026
**Status:** [GESICHERT]

---

## 8. Development Checklist

Before implementing any feature:

- [ ] Concept is clearly defined
- [ ] Scope (Work / Manifestation / Item) is known
- [ ] Data behaviour is specified
- [ ] Edge cases are defined
- [ ] UI behaviour is defined
- [ ] Example exists
- [ ] Decision is traceable

---

## 9. Risks if Ignored

- inconsistent UI
- incorrect data representation
- increased coordination effort
- hidden technical debt

**Source:** Requirements Engineering, 2018
**Status:** [GESICHERT]

---

## 10. Summary

The metadata domain provides:
- structured data (schema) ✔

But frontend requires:
- structured, implementable requirements ✔

→ Missing link must be addressed explicitly.

**Conclusion:**
Frontend quality depends on **strict, dev-ready domain specifications**, not on interpretation. [GESICHERT]

---

## 11. Transparency

- Based on:
  - Metadatenschema (GitHub)
  - Confluence documentation (2023–2026)
- Some gaps inferred from recurring patterns → [BEGRENZT]
