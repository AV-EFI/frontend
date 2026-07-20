# GitHub-Issue-Bestand: Konsolidierung und Übergabe 2026-07-20

Quelle: Live-Abgleich mit `gh issue list/view` gegen `AV-EFI/AVefi-Issues` am 2026-07-20, ergänzt durch die bestehenden Review-Notizen und das zentrale GitHub Project.

Diese Übergabe dokumentiert die technische und redaktionelle Konsolidierung des GitHub-Issue-Bestands. Ziel war ein belastbarer Single Source of Truth für die weitere Projektkoordination: zentralisiert, auditierbar, entscheidungsneutral und mit klarer Trennung zwischen umsetzbaren Aufgaben, technischen Blockern und fachlichem Klärungsbedarf.

Am 2026-07-20 wurden keine offenen Projektentscheidungen stellvertretend getroffen, keine fachlichen Prioritäten gesetzt und keine neuen Parent-/Child-Strukturen in GitHub angelegt. Der Bestand wurde bewusst so vorbereitet, dass die nächste Governance-Schicht auf einer sauberen Datengrundlage entscheiden kann.

Aktueller offener Bestand: 51 Issues.

## Executive Summary

Der GitHub-Bestand ist für die Übergabe fachlich nicht finalisiert, aber operativ deutlich anschlussfähiger als zuvor. Die wesentlichen Hygiene-Themen sind abgearbeitet: harte Duplikate sind geschlossen, obsolete Sammler reduziert, Board-Reste aus dem Public Release Board in den zentralen Arbeitsbestand überführt und technische Blocker sichtbar gemacht.

Die verbleibenden offenen Punkte sind nicht primär ein Aufräumproblem, sondern ein Steuerungsthema: Es braucht AP-Zuordnung, fachliche Priorisierung, Abnahmen und eine saubere Schnittstellenklärung zwischen Backend, Frontend und Projektkoordination.

## 1. Durchgeführte Konsolidierungen

| Issue | Änderung | Begründung / Beleg |
| --- | --- | --- |
| `#216` -> `#49` | `#216` als Duplikat geschlossen; `#49` bleibt kanonisch. | Inhaltlich identisches Match-and-Merge-/Ähnlichkeits-Thema; relevante Notiz wurde in `#49` übernommen. |
| `#219` -> `#218` | `#219` als Duplikat geschlossen; `#218` blieb zunächst kanonisch. | Beide Issues betrafen denselben SEARCH-01/Facet-Count-Sachverhalt. |
| `#217` | Als malformed transfer duplicate/orphan geschlossen. | Titel duplizierte geschlossenes `#220`; Body-Inhalt war bereits durch `#150` und historisch `#221` abgedeckt. |
| `#218` | Nach kanonischer Prüfung als erledigt geschlossen. | Originaler Facet-Count-Bug war laut dokumentierter Review-Notiz behoben. |
| `#46` -> `#75` | `#46` als obsolete Vorgängerin geschlossen. | PID-Registrierung wird in `#75` weitergeführt. |
| `#58` | Als zu generisch/superseded geschlossen. | Konkretere Redaktions-/Backend-Issues `#138`, `#132` und RD-Issues decken den Inhalt ab. |
| `#61` | Als veraltet und zu generisch geschlossen. | Empfehlungssystem wird durch `#145` bis `#148` weitergeführt. |
| `#62` | Geschlossen. | Public-Release-Optimierung dokumentiert; erneuter Erklärungsbedarf soll als neues Issue erfasst werden. |
| `#63` | Geschlossen. | Altes Search-Epic war laut Kommentar veraltet. |
| `#81` | Geschlossen. | Test war erfolgreich; Dropdown, alphabetische Sortierung und Icons wurden laut Kommentaren umgesetzt. |
| `#119`, `#125` -> `#128` | Bereits konsolidiert. | Navigationskontext wird in `#128` weitergeführt. |
| `#157` -> `#158`/`#159` | Vager SEO-Collector geschlossen. | Konkrete SEO-/Content-/Technikthemen bleiben in `#158` und `#159` nachvollziehbar. |
| `#129`-`#134`, `#136`, `#138`-`#146`, `#215` | Blocker sichtbar gemacht. | Als durch `#153` Authentifizierung blockiert dokumentiert; keine weitere Frontend-/Produkt-Triage bis zur Klärung. |
| `#49`, `#52`, `#91`, `#93`, `#147` | Backend-/Redaktions-/Match-and-Merge-Blocker sichtbar gemacht. | Dokumentierte Abhängigkeiten zu Backend, Auth, Match and Merge und Redaktionsworkflow. |
| `#152`, `#158`, `#161`, `#182`, `#194`, `#202`, `#203`, `#207` | Offene Issues aus Project 3 in Project 1 überführt bzw. dort bestätigt; aus Project 3 entfernt. | Public Release Board ist nach Juni 2026 nicht mehr aktiver Arbeitsbestand. |
| `#60`, `#201` | Passende bestehende Labels ergänzt. | `#60`: `UserStory`, `Epic:Herausgeber`; `#201`: `COULDHAVE`, `UserStory`, `Search`, `Frontend`. |

## 2. Bewusst unverändert gelassene Issues

| Issue | Grund für die Zurückhaltung |
| --- | --- |
| `#128` | Implementierung scheint vorhanden, aber explizite Abnahme durch `tennismann3000` ist offen. |
| `#132`, `#133` | Beide sind durch `#153` blockiert; zusätzlich sind Backend-Verträge, Validierung und produktive Redaktionslogik nicht entscheidbar. |
| `#169` | Rückmeldung zu noch offenem Punkt 8 und Zusammenspiel mit `#155` steht aus. |
| `#187` | Low-Prio; unklar ist, wo der Wartungshinweis gesteuert werden soll. |
| `#194` | Inhaltliche Darstellung für Kübelkind/Manifestation/Exemplar ist noch nicht abschließend entschieden. |
| `#201` | Sehr niedrige Priorität; Zusammenhang mit Search-/Facet-Verhalten ist dokumentiert, aber keine klare Umsetzungsentscheidung. |
| `#207` | Produktiv deployt, aber Test und ggf. Schließung durch `tennismann3000` sind explizit offen. |

## 3. Entscheidungsbedarf für die Projektkoordination

| Issue | Fehlende Entscheidung | Dokumentierte Abhängigkeit | Nächster Klärungsschritt |
| --- | --- | --- | --- |
| `#129`-`#134`, `#136`, `#138`-`#146`, `#215` | Reihenfolge und Umfang der Redaktions-/Profilfunktionen. | `#153` Authentifizierung; Backend-Update-Endpunkte, Rollen, Versionierung, Konfliktverhalten, Logging. | Auth-/Backend-Grundlage bestätigen, danach Frontend-Container und Akzeptanz prüfen. |
| `#50`, `#60`, `#86`, `#94` | Fachliche Regeln für Metadatenübernahme, Herkunftsanzeige, Tektonik und Vollständigkeitsscore. | Datenmodell, Felddefinitionen, Scoring-/Anzeige-Regeln. | Fachliche Entscheidung dokumentieren, dann erst Implementierungsaufgaben ableiten. |
| `#128` | Abnahme der aktuellen Navigation. | Aktuelle Umsetzung mit Suchkontext und Multi-Tab-Sync ist dokumentiert. | Review durch `tennismann3000`; danach schließen oder konkreten Restpunkt formulieren. |
| `#147`, `#148`, `#154`, `#155` | Schnitt zwischen Empfehlung, Match and Merge und Search-Backend. | Backend/API und Matching-Logik fehlen bzw. sind in Arbeit. | Backend-fähigen Scope bestätigen und ggf. konkrete Folgeissues schneiden. |
| `#169` | Kommunikation von Facetten- vs. Query-Suche. | Beziehung zu `#155`; Rückfrage von `C-Stemmler` am 2026-07-13. | Entscheiden, ob Restpunkt geschlossen, im Issue gekürzt oder separat weitergeführt wird. |
| `#187` | Betriebs-/Steuerungsmodell für Wartungshinweis. | Config, CMS, Feature Flag oder statischer Fallback offen. | Schlanken Betriebsweg festlegen. |
| `#194` | Gewünschte Darstellung von Manifestation/Exemplar bei Sonderfällen. | Metadatengruppe hat fachlichen Wunsch formuliert; technische Umsetzung nicht entschieden. | Fachliches Zielbild bestätigen und gegen aktuelle Detailansicht prüfen. |
| `#206` | Lizenz-/Rechtsentscheidung. | Warten auf Lizenzfeedback. | Entscheidung dokumentieren und Issue danach schließen oder konkretisieren. |
| `#207` | Abnahme nach Produktiv-Deploy. | Fix ist laut Kommentar produktiv deployed. | Test durch `tennismann3000`; bei Erfolg schließen. |

## 4. Strukturierungsempfehlung für die nächste Iteration

Bei technisch blockierten bestehenden Issues sollte die Projektkoordination prüfen, ob eine spätere Aufteilung in Parent-, Backend- und Frontend-Issues sinnvoll ist. Das betrifft vor allem Issues, die fachliche Entscheidung, Backend-Grundlage und Frontend-Umsetzung in einem Ticket vermischen.

Das ist kein Vorschlag für eine großflächige Reorganisation, sondern ein kontrollierter Portfolio-Schnitt: erst fachlichen Kontext stabilisieren, dann Backend-Verträge klären, anschließend Frontend-Integration und Abnahme operationalisieren.

Besonders naheliegende Cluster:

- Redaktion/Auth und geschützte Workflows: `#129`-`#134`, `#136`, `#138`-`#144`, `#153`, `#215`
- Recommendations / ähnliche Datensätze: `#145`-`#148`, ggf. `#49`, `#93`, `#154`
- Match and Merge / Disambiguierung: `#49`, `#50`, `#52`, `#91`, `#93`, `#154`
- PID: `#75`, `#77`, `#78`, `#79`, `#182`
- Search / Facetten / Suchmodi: `#65`, `#155`, `#156`, `#169`, `#201`
- Datenqualität / Schema / Normdaten: `#94`, `#133`, `#151`, `#152`, `#161`, `#170`, `#202`, `#207`

Die lokale Skizze `docs/repo-analysis/github-issues-inventory/issue-split-sketch-2026-07-20.md` beschreibt dafür ein konservatives Muster: bestehendes Issue als fachlicher Kontext, Backend-Sub-Issue für API/Datenmodell/Auth/Logik, Frontend-Sub-Issue für Anzeige/Interaktion/Integration, und separater Klärungspunkt für offene fachliche Entscheidungen. In GitHub wurden daraus noch keine neuen Issues, Parent-/Child-Beziehungen oder Zuständigkeiten angelegt.

## Übergabestatus

Der Bestand ist technisch nachvollziehbar und für die Übergabe belastbar: harte Duplikate und obsolete Sammler sind geschlossen, belegte technische Blocker sind sichtbar, Reste aus dem Public Release Board wurden in den zentralen Bestand überführt, und die übrigen offenen Punkte sind als Abnahme-, Backend-, Auth-, Fach- oder Projektkoordinationsthemen erkennbar.

Die Qualität des Boards ist damit gut bis sehr gut für eine Übergabe an die Projektkoordination. Der nächste Hebel liegt nicht in weiterer Einzelpflege, sondern in einer kurzen, bewussten Governance-Entscheidung: AP-Labels, Project-Status, Abnahmen, Priorisierung und Backend-/Frontend-Schnittstellen sollten in einem abgestimmten Folgeschritt festgelegt werden.
