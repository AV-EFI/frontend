---
name: security-monthly
description: Monatlicher Security-Check des AVefi-Frontends. Führt die automatischen Module aus (Abhängigkeiten, Header, XSS-Senken, Links, Nitro-Routen, Secrets, Container/CI), begleitet die manuelle OWASP-Prüfung und entwirft den Kommentar für Issue 250. Nur auf ausdrückliche Anfrage starten.
disable-model-invocation: true
argument-hint: "[--only=modul,modul] [--offline]"
---

# Monatlicher Security-Check

Grundlage ist `docs/security/monthly-check.md` (Module, Baseline, OWASP-Zuordnung, manuelle Checkliste). Lies zuerst den Abschnitt "Manuelle Prüfung" dort, nicht aus dem Gedächtnis.

## Ablauf

1. **Vorbereitung.** `git status --short` ausführen und den Stand nennen. Vorhandene Änderungen des Nutzers nicht anfassen. Danach `gh issue view 250 -R AV-EFI/AVefi-Issues --comments` lesen, um den letzten Monatsbericht und offene Punkte zu kennen.
2. **Automatische Module.** `corepack yarn security:monthly $ARGUMENTS` ausführen (mit `--offline`, wenn kein Netz). Den Bericht `logs/security/monthly-JJJJ-MM.md` lesen. Bei `status: skipped` oder `error` eines Moduls sagen, was nicht geprüft wurde.
3. **Befunde abarbeiten.** Pro offenem oder abgelaufenem Befund:
   - Ursache im Code prüfen, nicht nur das Muster.
   - Echter Fund: klein und gezielt beheben (AGENTS.md: kein Refactoring nebenbei), Test ergänzen, wo es passt.
   - Falscher Treffer oder bewusst akzeptiert: Vorschlag für einen Eintrag in `scripts/security/baseline.json` mit Grund und `reviewBy` (drei Monate). Einträge erst nach Rückfrage beim Nutzer schreiben. Ist die Heuristik des Moduls schuld, das Modul verbessern statt Ausnahmen zu sammeln.
   - Entscheidung liegt bei Backend/Infra: als `tracked` mit Verweis vorschlagen.
   - Abhängigkeiten: `corepack yarn why <paket>` je Advisory, gezielte Updates oder `resolutions`, danach `corepack yarn install` und erneuter Audit. Keine unverwandten Major-Upgrades.
4. **Manuelle Prüfung.** `changes-since-review` als Ausgangspunkt nehmen (Commits seit dem letzten Review). Die Checkliste aus `docs/security/monthly-check.md` Punkt für Punkt durchgehen: was sich im Repo prüfen lässt, selbst prüfen und mit Datei und Zeile belegen; was Login, Infrastruktur oder Backend braucht (z. B. Cookie-Attribute, Header-Entscheidung), ausdrücklich als "nicht geprüft" festhalten und den Nutzer fragen.
5. **Verifikation.** `corepack yarn lint`, `corepack yarn test:unit`, `corepack yarn knip:audit`; bei Server-, Such- oder Detail-Änderungen zusätzlich die nächstliegenden E2E-Tests (brauchen das Backend). Nicht lauffähige Prüfungen mit Grund nennen. Erfolg erst nach gelaufener Verifikation melden.
6. **Kommentar entwerfen.** Als `logs/security/issue-monthly-commentN.md` (nächste freie Nummer) auf Deutsch: Datum, Gemessenes (Audit-Zahl, Header, Anzahl `v-html`), behobene Punkte mit Dateien, akzeptierte und offene Punkte mit Grund, nicht geprüft, Verweise auf Folge-Issues. Faktisch und knapp, ohne Wertungen. Den Entwurf zeigen. **Nicht auf GitHub posten**, bevor der Nutzer ausdrücklich zustimmt.
7. **Abschluss.** Nach Freigabe: `lastReview` in `scripts/security/baseline.json` auf das heutige Datum setzen. Nichts committen oder pushen, ohne dass der Nutzer es verlangt (Commits klein, einer pro Senke; nur den genannten Branch pushen).

## Regeln

- Keine Exploit-Versuche gegen Live-Systeme. Die Header-Messung ist ein einfacher GET auf die Startseite.
- Werte von Secrets nie ausgeben, nur Schlüsselnamen und Fundstellen.
- Eine Ausnahme in der Baseline ist eine Entscheidung des Nutzers, nicht deine.
- Neue Prüfmodule als Datei in `scripts/security/modules/` anlegen (Vertrag in der Doku), nicht in den Runner einbauen.
- Zum Schluss auf `/clear` hinweisen, wenn danach etwas Unabhängiges ansteht.
