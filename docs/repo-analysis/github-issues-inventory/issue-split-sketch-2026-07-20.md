# Skizze: Parent-/Sub-Issue-Struktur für technisch blockierte Themen

Stand: 2026-07-20

Zweck: Lokaler Diskussionsentwurf für die Projektkoordination. Diese Datei beschreibt, wie einige offene, technisch blockierte oder fachlich/technisch vermischte Issues später in Parent-, Backend- und Frontend-Issues aufgeteilt werden könnten.

Wichtig: Dies ist kein Umsetzungsbeschluss. In GitHub wurden auf Basis dieser Skizze keine neuen Issues angelegt, keine Parent-/Child-Beziehungen gesetzt und keine Zuständigkeiten neu vergeben.

Scope-Grenze: Diese Skizze bezieht sich auf den bestehenden offenen GitHub-Bestand und insbesondere auf technisch blockierte bzw. gemischte Issues, die sinnvoll in Backend- und Frontend-Anteile getrennt werden könnten. Neue Themen, zusätzliche Liefergegenstände oder fachliche Erweiterungen werden daraus nicht abgeleitet.

## Leitprinzip

Eine Aufteilung ist sinnvoll, wenn ein Issue gleichzeitig fachliche Entscheidung, Backend-Grundlage und Frontend-Umsetzung enthält. Dann sollte das Parent-Issue den fachlichen Kontext halten, während Backend- und Frontend-Sub-Issues getrennt bearbeitbar werden.

Für die Übergabe ist besonders wichtig: technisch blockierte Issues sollten nicht als einzelne gemischte Aufgaben liegen bleiben, wenn Backend-Grundlage und Frontend-Integration getrennt bearbeitet werden müssen. Die sichere nächste Struktur wäre daher kein Massensplit, sondern eine abgestimmte Liste: bestehendes Issue -> Backend-Sub-Issue -> Frontend-Sub-Issue -> offene fachliche Entscheidung.

Empfohlenes Muster:

| Ebene | Inhalt |
| --- | --- |
| Parent | fachliches Ziel, bekannte Diskussion, offene Entscheidung, Links auf Teilissues |
| Backend-Sub-Issue | API, Datenmodell, Persistenz, Auth/Rollen, Validierung, Matching- oder Synchronisationslogik |
| Frontend-Sub-Issue | Anzeige, Interaktion, Fehler-/Leerzustand, Integration gegen definierte Schnittstelle, Abnahme |
| Fach-/Koordinationspunkt | Entscheidung, Priorität, Abnahme, Scope für AVefi plus |

## 1. Redaktion, Auth und geschuetzte Workflows

Bestehende Issues:

- `#129` RD-01 Rollen- & Rechteverwaltung
- `#130` RD-02 Aenderungs- und Versionshistorie
- `#131` RD-03 Konflikt-Handling bei paralleler Bearbeitung
- `#132` RD-04 Redaktionsmodus fuer Werk-, Manifestations- und Item-Metadaten
- `#133` RD-05 Validierungslogik fuer Pflicht- und Qualitaetsfelder
- `#134` RD-06 Redaktions-Dashboard
- `#136`, `#138`-`#141`, `#143`, `#144`
- `#153` BR-10 Bereitstellung GWDG Keycloak
- `#215` Editierbares Profil

Aktueller Befund:

- Die produktive Umsetzung ist weitgehend durch `#153` Authentifizierung blockiert.
- Mehrere Issues mischen fachliche Redaktionsprozesse, Backend-Vertraege, Rollen/Rechte und UI.
- Das Frontend kann Redaktions-UI vorbereiten, aber Rollen, Persistenz, Versionierung, Konflikte, Freigabe und Logging nicht allein verlaesslich loesen.

Moeglicher Zuschnitt:

| Vorschlag | Ausgangsissues | Inhalt | Abhaengigkeit |
| --- | --- | --- | --- |
| Parent: Redaktion und geschuetzte Workflows | `#129`-`#134`, `#136`, `#138`-`#144`, `#215` | fachlicher Gesamtprozess, Rollen, Freigabe, Abnahme | Projektkoordination / Produktentscheidung |
| Backend: Auth/Rollen/Session-Grundlage | `#153`, `#136`, `#144`, `#215` | Keycloak, Rollen, Profil-/Accountdaten, Zugriff auf interne Funktionen | GWDG/Backend |
| Backend: Redaktionelle Schreib- und Audit-APIs | `#130`, `#131`, `#138`-`#140`, `#143` | Update-Endpunkte, Versionierung, Konfliktstrategie, Auditlog, Freigabeprozess | Auth muss stehen |
| Backend/Fachlich: Validierungsregeln | `#133`, `#94` | Pflichtfelder, Qualitaetsfelder, Schema-/Backend-Validierung | Datenmodell/Fachregeln |
| Frontend: Redaktionsmodus und Dashboard | `#132`, `#134`, `#141`, `#215` | Editor-UI, Dashboard, Profilansicht, Fehler-/Validierungsanzeige | definierte Auth- und Backend-Vertraege |

Naechster Klaerungsschritt:

Projektkoordination sollte entscheiden, ob ein gemeinsames Parent-Issue fuer Redaktion/Auth angelegt oder ein bestehendes Issue als Parent verwendet wird.

## 2. Recommendations, Disambiguierung und aehnliche Datensaetze

Bestehende Issues:

- `#145` RECS-01 Aehnliche Filme algorithmisch bestimmen
- `#146` RECS-02 Aehnliche Filme in der Werkansicht anzeigen
- `#147` RECS-03 Aehnlichkeitskriterien transparent darstellen
- `#148` RECS-04 API-Endpoint fuer Recommendations bereitstellen
- `#49` Aehnlichkeit von Datensaetzen pruefen
- `#93` Duplikate erkennen und anzeigen
- `#154` Match & Merge um Backend bereitstellen

Aktueller Befund:

- Die fachliche Grundidee einer Recommendations-Liste pro Datensatz wurde laut Diskussion grundsaetzlich bejaht.
- Offen ist, ob und wie das Thema fuer AVefi plus reaktiviert wird.
- Backend-Logik, transparente Kriterien, API und Frontend-Anzeige sind vermischt.
- `#61` wurde als generischer Sammler geschlossen; konkrete Teile laufen in `#145`-`#148` weiter.

Moeglicher Zuschnitt:

| Vorschlag | Ausgangsissues | Inhalt | Abhaengigkeit |
| --- | --- | --- | --- |
| Parent: Recommendations / aehnliche Datensaetze | `#145`-`#148`, ggf. `#49`, `#93`, `#154` | fachliches Ziel, Reaktivierung fuer AVefi plus, Abgrenzung zu Match & Merge | Projektkoordination |
| Backend: Aehnlichkeits- und Matching-Logik | `#145`, `#49`, `#93`, `#154` | Kriterien, Scoring, Datenbasis, Dedupe-/Match-Regeln | fachliche Regeln und Backend |
| Backend: Recommendations-API | `#148` | abrufbare Liste aehnlicher Datensaetze pro Datensatz | Matching-Logik muss definiert sein |
| Frontend: Anzeige aehnlicher Filme | `#146` | Darstellung in Werk-/Detailansicht, Leerzustand, Linkverhalten | API-Vertrag |
| Frontend/Fachlich: Transparenz der Kriterien | `#147` | erklaeren, warum Datensaetze aehnlich sind | definierte Kriterien |

Naechster Klaerungsschritt:

Entscheiden, ob Recommendations als eigenes AVefi-plus-Thema weitergefuehrt werden oder ob sie in Match & Merge / Disambiguierung aufgehen.

## 3. Match & Merge, Filmidentifikatoren und Dubletten

Bestehende Issues:

- `#49` Aehnlichkeit von Datensaetzen pruefen
- `#50` widerspruechliche Metadaten uebernehmen
- `#52` Daten uebernehmen
- `#91` Identifikatoren bearbeiten und verwalten
- `#93` Duplikate erkennen und anzeigen
- `#154` Match & Merge um Backend bereitstellen

Aktueller Befund:

- Mehrere Issues sind technisch blockiert und nicht als reine Frontend-Aufgaben bearbeitbar.
- `#154` ist der zentrale Backend-Blocker.
- `#50` ist primaer eine fachliche Entscheidung: Welche widerspruechlichen Metadaten duerfen uebernommen werden?

Moeglicher Zuschnitt:

| Vorschlag | Ausgangsissues | Inhalt | Abhaengigkeit |
| --- | --- | --- | --- |
| Parent: Match & Merge / Disambiguierung | `#49`, `#50`, `#52`, `#91`, `#93`, `#154` | Zielbild, Scope, fachliche Regeln, Grenzen zu Recommendations | Projektkoordination / Fachgruppe |
| Fachlich: Regeln fuer widerspruechliche Metadaten | `#50` | Entscheidungslogik, Quellenprioritaet, manuelle Uebernahme | Fachentscheidung |
| Backend: Match-&-Merge-Grundlage | `#154`, `#49`, `#52`, `#91`, `#93` | APIs, Persistenz, Identifikatoren, Merge-/Dedupe-Logik | Datenmodell/Auth |
| Frontend: Pruef-/Vergleichsansicht | `#49`, `#93` | read-only Vergleich, Anzeige von Aehnlichkeit/Dubletten | Backend-Datenbasis |
| Frontend: Uebernahme-/Merge-UI | `#50`, `#52`, `#91` | Interaktion fuer Uebernahme, Bearbeitung, Konfliktanzeige | Backend-Schreib- und Auth-Vertraege |

Naechster Klaerungsschritt:

Erst fachliches Zielbild und Backend-Vertraege klaeren, dann Frontend-Sub-Issues konkretisieren.

## 4. PID-Verwaltung

Bestehende Issues:

- `#75` PID registrieren
- `#77` PID aufloesen
- `#78` Versionierung fuer PID-bezogene Metadatensaetze
- `#79` Dublettenpruefung ueber PID
- `#182` Highlighting/Scrolldown bei PID-Resolve

Aktueller Befund:

- `#75`, `#77`, `#78`, `#79` sind korrekt als Backend/PID-Themen geroutet.
- `#182` betrifft eher Frontend-/UX-Verhalten beim Aufloesen eines PIDs und sollte getrennt von Backend-Resolve betrachtet werden.

Moeglicher Zuschnitt:

| Vorschlag | Ausgangsissues | Inhalt | Abhaengigkeit |
| --- | --- | --- | --- |
| Parent: PID-Verwaltung | `#75`, `#77`, `#78`, `#79`, `#182` | PID-Zielbild und fachlich-technische Regeln | Projektkoordination / Backend |
| Backend: PID registrieren/resolve/versionieren | `#75`, `#77`, `#78` | Handle-System, Resolve, Versionierung | Backend/PID-Infrastruktur |
| Backend: PID-Dublettenpruefung | `#79` | Regeln und technische Pruefung | Datenmodell/Matching |
| Frontend: PID-Resolve UX | `#182` | Scroll/Highlighting, Screenreader-/Tastaturverhalten | Backend-Resolve muss stabil sein |

Naechster Klaerungsschritt:

Backend-PID-Themen getrennt vom Frontend-Resolve-Verhalten fuehren; `#182` nach aktuellem Stand gezielt testen.

## 5. Search, Facetten und Suchmodi

Bestehende Issues:

- `#65` Sortierung in der Suche
- `#155` Fuzzy Search
- `#156` Expertenmodus / einfacher Modus
- `#169` Clickable facets & entity names
- `#201` Hermann-Schlenker-Link im Carousel

Aktueller Befund:

- Suchverhalten, Facettenlogik, Query-Kommunikation und UI-Modi sind fachlich eng verbunden.
- `#155` ist als Backend/Search-Thema geroutet.
- `#169` wartet auf fachliche Rueckmeldung, besonders zur Kommunikation Facetten- vs. Query-Suche.
- `#201` ist sehr niedrig priorisiert, zeigt aber den Unterschied zwischen Volltextsuche und Facetten.

Moeglicher Zuschnitt:

| Vorschlag | Ausgangsissues | Inhalt | Abhaengigkeit |
| --- | --- | --- | --- |
| Parent: Search-Verhalten und Suchmodi | `#65`, `#155`, `#156`, `#169`, `#201` | Suchsemantik, Modi, Facetten-/Query-Kommunikation | Produkt-/UX-Entscheidung |
| Backend: Suchverhalten/Fuzzy Search | `#155`, ggf. `#65` | Suchlogik, Ranking, Sortierung, Umsetzbarkeit | Backend/Search |
| Frontend: Suchmodi und Kommunikation | `#156`, `#169`, `#201` | einfacher/Expertenmodus, UI-Texte, Facetteninteraktion, Linkziele | abgestimmte Suchsemantik |
| Fachlich/UX: Abnahme Suchverhalten | `#65`, `#169` | Erwartungen der Metadaten-/Domain-Gruppe | Fachreview |

Naechster Klaerungsschritt:

Metadaten-/UX-Gruppe sollte entscheiden, ob Suchmodi, Facettenkommunikation und Sortierung gemeinsam betrachtet werden.

## 6. Datenqualitaet, Schema und Datenlieferungen

Bestehende Issues:

- `#94` Vollstaendigkeitsindikator
- `#133` Validierungslogik
- `#151` Genre-Harmonisierung
- `#152` Groesse des Datenbestands
- `#161` Schema-Anpassungen
- `#170` Normdatenaustausch
- `#202` Duplikate Schlagworte
- `#207` fehlerhafte Zuordnung Normdaten-IDs

Aktueller Befund:

- Hier mischen sich fachliche Regeln, Datenmodell, Backend-/Indexing-Arbeit, Frontend-Anzeige und Abnahme.
- Einige Themen sind eher Datenpflege/Metadatengruppe, andere Backend/Schema, andere Frontend-Anzeige.
- `#207` ist produktiv deployed und wartet auf Test/Schliessung.

Moeglicher Zuschnitt:

| Vorschlag | Ausgangsissues | Inhalt | Abhaengigkeit |
| --- | --- | --- | --- |
| Parent: Datenqualitaet und Schema | `#94`, `#133`, `#151`, `#152`, `#161`, `#170`, `#202`, `#207` | Gesamtbild Datenqualitaet, Schema, Normdaten, Datenlieferungen | Metadatengruppe |
| Fachlich: Qualitaets-/Pflichtfeldregeln | `#94`, `#133` | Pflichtfelder, Score, Schwellenwerte, Validierung | Fachentscheidung |
| Backend/Data: Schema und Indexing | `#151`, `#152`, `#161`, `#202`, `#207` | Datenbereinigung, Mapping, Index, Normdaten-ID-Zuordnung | Backend/Data |
| Frontend: Anzeige von Datenqualitaet/Normdaten | `#94`, `#170` | UI-Anzeige, Erklaerung, Leer-/Fehlerzustaende | definierte Regeln/Daten |
| Abnahme: produktive Fixes pruefen | `#207` | Test und ggf. Schliessung | fachliche Abnahme |

Naechster Klaerungsschritt:

Unterscheiden, welche Issues Datenpflege/Metadatenentscheidung sind und welche als technische Backend-/Frontend-Aufgabe weiterlaufen sollen.

## 7. Export

Bestehendes Issue:

- `#150` Exportfunktionen definieren und vereinheitlichen

Aktueller Befund:

- Technische Exportfunktionen existieren teilweise.
- Offen ist vor allem die fachliche Definition der Exportfelder fuer Werk, Manifestation, Item und Trefferlisten.
- Das Thema ist fuer Hackathon-/Testkontexte weiter relevant.

Moeglicher Zuschnitt:

| Vorschlag | Ausgangsissues | Inhalt | Abhaengigkeit |
| --- | --- | --- | --- |
| Parent: Exportdefinition | `#150` | Exportziel, Formate, Feldumfang | fachliche Entscheidung |
| Fachlich: Exportfeldsets | `#150` | Felder fuer Werk, Manifestation, Item, Trefferliste | Metadatengruppe |
| Frontend/Backend: Exportumsetzung | `#150` | technische Umsetzung nach Felddefinition | definierte Feldsets |

Naechster Klaerungsschritt:

Issue vorerst als Parent/Definition behalten; erst nach Feldentscheidung technische Folgeissues schneiden.

## 8. Kleinere Frontend-/Abnahme-Themen

Bestehende Issues:

- `#128` Navigation zwischen Suchtrefferliste und Detailansicht
- `#187` Wartungshinweis
- `#201` Hermann-Schlenker-Link im Carousel

Aktueller Befund:

- `#128` wartet auf Abnahme.
- `#187` braucht eine Entscheidung ueber Steuerung des Wartungshinweises.
- `#201` ist sehr niedrig priorisiert, aber als Beispiel fuer Volltextsuche vs. Facette relevant.

Moeglicher Zuschnitt:

| Vorschlag | Ausgangsissues | Inhalt | Abhaengigkeit |
| --- | --- | --- | --- |
| Review/Acceptance | `#128` | Abnahme aktueller Navigation | tennismann3000 |
| Betriebsentscheidung + Frontend | `#187` | Steuerung Wartungshinweis, schlanker Fallback | Projektkoordination/Betrieb |
| Search-Link-Follow-up | `#201` | Linkziel Carousel und Such-/Facet-Kommunikation | Entscheidung zu Search-Semantik |

Naechster Klaerungsschritt:

Diese Issues muessen nicht zwingend gesplittet werden; sie sollten eher fachlich abgenommen, geparkt oder gezielt als kleine Follow-ups weitergefuehrt werden.

## Empfohlene Vorgehensweise

1. Diese Skizze fachlich gegenpruefen.
2. Pro Cluster entscheiden, ob ein Parent-Issue benoetigt wird oder ein bestehendes Issue Parent bleiben soll.
3. Nur fuer bestaetigte Cluster Sub-Issues anlegen.
4. Keine Akzeptanzkriterien erfinden; vorhandene Anforderungen uebertragen und offene Entscheidungen explizit markieren.
5. Bestehende Diskussionen in den alten Issues erhalten und die neuen Issues sauber zurueckverlinken.
