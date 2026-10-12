# Monatlicher Security-Check

Der Check besteht aus automatischen Modulen und einer manuellen Prüfung. Beides orientiert sich an den OWASP Top 10:2025 und am OWASP Developer Guide. Ergebnisse gehen als Kommentar in Issue 250 (AVefi-Issues). Die Regeln für Änderungen stehen in `guidelines.md`.

## Starten

- In Claude Code: `/security-monthly`. Der Skill führt durch alle Schritte (siehe `.claude/skills/security-monthly/SKILL.md`).
- Nur die automatischen Module: `corepack yarn security:monthly`. Ohne Netzwerk: `corepack yarn security:monthly:offline`.
- Einzelne Module: `node scripts/security/monthly.mjs --only=xss-sinks,links` oder `--skip=live-headers`. Liste: `corepack yarn security:monthly:list`.

Der Lauf schreibt `logs/security/monthly-JJJJ-MM.md` und `.json` (das Verzeichnis `logs/` ist nicht versioniert). Exit-Code 1 bedeutet: es gibt offene oder abgelaufene Befunde der Stufe `critical` oder `high`.

## Module

| Modul | Prüft | OWASP Top 10:2025 | Developer Guide |
|---|---|---|---|
| `dependencies` | `yarn npm audit` | A03 Software Supply Chain Failures | Implementation › Dependencies |
| `live-headers` | Security-Header von www und testbed | A02 Security Misconfiguration | Operations |
| `xss-sinks` | `v-html` ohne Escaping, `innerHTML`, `eval` | A05 Injection | Implementation › Secure Libraries |
| `links` | `target="_blank"` ohne `rel`, `window.open`, iframes ohne `sandbox`, gebundenes `href` ohne `safeHref` | A05, A02 | Implementation › Secure Libraries |
| `server-routes` | neue Nitro-Routen, Schreibzugriff ohne Auth und Rate-Limit, Body ohne Validierung, `debug: true` | A01, A06, A07 | Design › Threat modeling |
| `secrets` | Schlüssel, Tokens, Zugangswerte in versionierten Dateien | A04, A02 | Implementation |
| `container-ci` | Dockerfile, `.dockerignore`, Compose, `.gitlab-ci.yml` | A02, A03 | Operations › DevSecOps Guideline |
| `changes-since-review` | Commits seit dem letzten Review in sicherheitsrelevanten Pfaden | A06, A08 | Design › Threat modeling |

Die Module prüfen mit Mustern. Ein leerer Bericht heißt nicht, dass nichts offen ist, sondern dass keines der Muster anschlägt.

## Baseline

`scripts/security/baseline.json` hält fest, was bewusst nicht als offen gilt:

- `accepted`: begründet akzeptiert, mit `reason` und `reviewBy` (Standard: drei Monate). Nach `reviewBy` zählt der Befund wieder als offen.
- `tracked`: bekannt, die Entscheidung liegt woanders (`ref` nennt wo). Erscheint im Bericht, blockiert aber nicht.
- `id` darf `*` enthalten, um mehrere Befunde zu erfassen.
- Veraltete Einträge, zu denen es keinen Befund mehr gibt, listet der Bericht auf. Dann entfernen.
- `config.reviewedRoutes` ist die Liste der geprüften Nitro-Routen. Neue Routen erscheinen als Befund, bis sie geprüft und eingetragen sind.
- `lastReview` wird erst nach abgeschlossenem Review gesetzt.

Einen Befund nicht beheben und nur eintragen darf man erst nach Prüfung der Ursache. Der Grund muss sagen, warum es unkritisch ist, nicht nur dass es bekannt ist.

## Neues Modul

Eine Datei in `scripts/security/modules/<id>.mjs` genügt, der Runner findet sie selbst:

```js
export default {
  id: 'mein-modul',
  title: 'Anzeigename',
  owasp: ['A05'],
  devGuide: 'Kapitel › Abschnitt',
  network: false, // true: wird bei --offline übersprungen
  async run({ baseline }) {
    return { findings: [finding(`mein-modul:schluessel`, 'medium', 'Titel', { detail: '…' })], notes: [] };
  },
};
```

Die Befund-ID muss über Läufe hinweg stabil sein (keine Zeilennummern, wenn der Code sich oft verschiebt), sonst greift die Baseline nicht. Stufen: `critical`, `high`, `medium`, `low`, `info`.

## Abdeckung der OWASP Top 10:2025

| Kategorie | automatisch | manuell |
|---|---|---|
| A01 Broken Access Control | `server-routes` | Rollen und Institutionsfilter neuer Seiten und Routen |
| A02 Security Misconfiguration | `live-headers`, `container-ci`, `links` | Build-Flags, Deploy-Variablen |
| A03 Software Supply Chain Failures | `dependencies`, `container-ci` | neue Abhängigkeiten, Basis-Images, Dependabot |
| A04 Cryptographic Failures | `secrets` | Cookie-Attribute, TLS bei Mail, Rotation |
| A05 Injection | `xss-sinks`, `links` | neue Eingabepunkte |
| A06 Insecure Design | `server-routes`, `changes-since-review` | Threat Modeling neuer Funktionen |
| A07 Authentication Failures | `server-routes` | Login, Session, CSRF |
| A08 Software or Data Integrity Failures | `changes-since-review` | CI-Änderungen, Remote-Inhalte |
| A09 Security Logging and Alerting Failures | – | Logging und Alarmierung |
| A10 Mishandling of Exceptional Conditions | – | Fehlerbehandlung |

A09 und A10 sind bisher nur manuell abgedeckt.

## Manuelle Prüfung

Pro Punkt: geprüft, Ergebnis kurz notieren. Die Liste der Commits aus `changes-since-review` ist der Ausgangspunkt.

**A01 Zugriffskontrolle**
- [ ] Neue oder geänderte Seiten unter `protected/` und `admin/` sowie Routen: Wer darf was? Wird das serverseitig erzwungen, nicht nur in der Oberfläche?
- [ ] Institutionsbezogene Filter (`msearch_inst`, FBM-Ansichten): Sieht ein Nutzer nur Daten der eigenen Institution?
- [ ] `CMS_MUTATIONS_ENABLED` und `CMS_ALLOW_USERTOOLTIP_EDITS` in den Deploy-Variablen: Wert pro Umgebung wie gewollt?

**A02 Fehlkonfiguration**
- [ ] Stand der Security-Header-Entscheidung (Traefik oder `routeRules`), CSP Report-Only.
- [ ] Deploy-Variablen: `NUXT_PUBLIC_LOGIN_ENABLED`, `NUXT_PUBLIC_RELEASE_MODE`, Rate-Limit-Flag, Debug-Ausgaben.
- [ ] Neue Konfigurationsschalter: sicherer Standard?

**A03 Lieferkette**
- [ ] Dependabot-Bericht (`logs/security/dependabot-weekly-report.md`) abgearbeitet?
- [ ] Neue direkte Abhängigkeiten seit dem letzten Review: Herkunft, Pflege, Bedarf. Lockfile-Diff auf unerwartete Pakete und Install-Skripte ansehen.
- [ ] Basis-Image (`node:…-slim`): aktuelle Patch-Version?

**A04 Kryptografie und Geheimnisse**
- [ ] Attribute des Cookies `auth:token` (Secure, SameSite, Lebensdauer), nur eingeloggt prüfbar.
- [ ] Mail-Versand: TLS erzwungen (`MAIL_REQUIRE_TLS`)?
- [ ] Rotation von `NUXT_SECRET`, Mail- und Elastic-Zugängen nach Personalwechsel oder Vorfall.

**A05 Injection**
- [ ] Neue Eingabepunkte: URL-Parameter der Suche, Formulare, CMS-Felder. Wird jeder Wert vor Ausgabe oder Weitergabe behandelt?
- [ ] Backend: feste Highlight-Tags, Escaping indexierter Felder (Abstimmung mit dem Backend).

**A06 Unsicheres Design**
- [ ] Neue Funktionen seit dem letzten Review: Was kann ein Angreifer damit tun? Missbrauch durch Automatisierung (Kontaktformular, Suche)?

**A07 Authentifizierung**
- [ ] Login-Weiterleitung und Abmeldung, Verhalten bei abgelaufener Sitzung (401).
- [ ] CSRF-Token-Ablauf unverändert?
- [ ] Entscheidung zu personenbezogenen Daten in `localStorage['auth_session']`.

**A08 Integrität**
- [ ] Änderungen an `.gitlab-ci.yml`, Dockerfile, Deploy-Skripten: wer kann was auslösen, welche Variablen sind geschützt?
- [ ] Remote-Inhalte (Schema-Seite auf `av-efi.github.io`, News-Feed, Matomo): Quelle unverändert, Auslieferung begrenzt?

**A09 Logging und Alarmierung**
- [ ] Enthalten Logs personenbezogene Daten oder Geheimnisse (Kontaktformular, Client-Log)?
- [ ] Gibt es Alarme bei Fehlerspitzen oder Ausfällen, und liest sie jemand?

**A10 Ausnahmen**
- [ ] Fehlerantworten der Routen und Fehlerseiten: keine Stacktraces, Pfade oder Zugangsdaten?
- [ ] Verhalten bei Backend- oder Elasticsearch-Ausfall: leerer Zustand statt Absturz oder offener Fehlerpfad?

## Abschluss

1. `corepack yarn lint`, `corepack yarn test:unit`, `corepack yarn knip:audit` laufen sauber.
2. Bericht und manuelle Ergebnisse als Kommentar in Issue 250 eintragen (Entwurf liegt in `logs/security/`, Veröffentlichung nur nach Freigabe).
3. Offene Punkte als Folge-Issue verlinken oder in `baseline.json` mit Grund eintragen.
4. `lastReview` in `scripts/security/baseline.json` auf das Datum setzen.

## Quellen

- OWASP Top 10:2025: https://top10.owasp.org/2025
- OWASP Developer Guide: https://devguide.owasp.org/
