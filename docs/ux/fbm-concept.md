# Filmbegleitende Materialien (FBM): Anpassungen am Bestand

Stand: 2026-11-16. Arbeitsgrundlage für Issue #243 (FBM-01) und #244 (IMG-01). Die bestehende Darstellung (Liste, Filter, Karten, Reiter am Werk) ist mit den Fachexperten abgestimmt und bleibt die Grundlage. Dieses Dokument listet nur, was sich aus den neuen Beschlüssen, dem erweiterten Schema und dem neuen Mockup ergibt. Es trifft keine Produkt- oder Gestaltungsentscheidungen. Offene Punkte sind als **Offen** markiert.

## 1. Quellen

| Quelle | Stand |
| --- | --- |
| Issue #243, Update vom 2026-11-04 (Metadatenfachgruppe 2026-10-29) | Beschluss |
| Protokollauszug "Suche und Darstellung filmbegleitender Materialien" | Beschluss / offen |
| Mail der Deutschen Kinemathek: neues Mockup, Schema-Branch `film-related-materials-extension` | Mockup liegt dem Repo noch nicht vor |
| Issue #244 (Bildcaching), Kommentar vom 2026-11-10 | Konzept |

Der Schema-Branch wurde über den Diff gegen `main` gelesen (`model.yaml`, `vocab.yaml`). Das neue Mockup wurde nicht geprüft.

## 2. Bestand

- Reiter "Filmbegleitmaterialien" in `WorkViewCompAVefi.vue`, nur auf `/filmrel/:prefix/:id` (noindex, siehe `tests/unit/source-guards/route-seo.contract.spec.ts`).
- `components/detail/FilmRelatedMaterialsComp.vue`: Suchfeld, Filter (Materialart, Datensatztyp, Institution), Sortierung, Paginierung, Karten mit Vorschaubild und Fallback.
- `composables/useFilmRelatedMaterials.ts` importiert statisch Mockup-JSON. Es gibt kein Backend. `server/api/film-related-materials/[prefix]/[id].get.ts` wird von keiner Komponente aufgerufen.
- `docs/components/FilmRelatedMaterialsComp.md` beschreibt noch ein Karussell und ein altes Mockup.

## 3. Beschlüsse und Bestand

| Beschluss | Bestand | Aufgabe |
| --- | --- | --- |
| Inventarnummer wird gespeichert, aber nicht angezeigt | `getListFacts` zeigt sie | Anzeige entfernen, Test ergänzen. Sie fließt auch in die Listensuche ein. **Offen:** ob sie dort durchsuchbar bleibt. |
| Freitext ohne Normdaten-URI ist der Normalfall | Erfüllt | Gegen neues Schema prüfen. |
| Vorschaubild optional, Fallback nötig | Erfüllt | Keine. |
| Link nur auf die Landingpage des Datengebers | Erfüllt | **Offen:** Beschriftung "Datensatz öffnen" (Copy, Handbuch). |
| Sammlung und Provenienz getrennt, Collection mit Notiz | Keine Darstellung | Ergänzen, sobald das Mockup vorliegt. |
| Physical Characteristics als wiederholbare Gruppen | Material, Technik, Maße als getrennte Zeilen | Auf Gruppen umstellen. **Offen:** Zusammenfassung mehrerer Gruppen auf der Karte. |
| Zugangsstatus berücksichtigen | Nicht vorhanden | Darstellung analog Exemplar (`has_access_status`). **Offen:** Feld im FBM-Schema. |
| Kein Filter "Nur Materialien mit Bild", kein Ranking-Bonus | Nicht vorhanden | Nichts zu tun. |
| FBM sind eigene Datensätze auf Exemplarebene | Reiter auf Werkebene | **Offen:** ob die Reiter-Position der Ebene entspricht. |

Kleinere Befunde:

- Objektkategorie (`avefi:Stills` usw.) und Typ (`Single Object`, `Set`) erscheinen als Rohwerte. Deutsche Bezeichnungen kommen aus Handbuch oder Fachgruppe, Werk/Manifestation/Exemplar-Terminologie beachten.
- Die Oberfläche sagt "Filmbegleitmaterialien", Issues und Protokoll "filmbegleitende Materialien". **Offen:** einheitliche Schreibweise.
- Alle Vorschaubilder eines Datensatzes laden gleichzeitig und direkt beim Datengeber. Das ist Thema von #244.

## 4. Schema-Erweiterung

Aus dem Diff gelesen:

- `FilmRelatedMaterial` mit Pflichtfeldern `described_by`, `has_primary_title`, `type`.
- Neu: `has_identifier`, `has_record_type`, `has_object_type`, `is_part_of_collection`, `has_webresource`, `has_mediaresource` (mit Rechteereignis), `is_part_of`, `has_subject`, `has_note`.
- `PhysicalCharacteristics` mit `has_name`, `has_extent` (mehrfach), `has_material`, `has_technique`. Das Mockup enthält laut Mail 272 benannte Gruppen.
- Neue Ereignisse `ProvenanceEvent` und `ProvenanceActivity`.

Folgen:

1. Das TypeScript-Modell in `useFilmRelatedMaterials.ts` folgt dem alten Mockup (`has_object_category`, `has_dimensions`, `has_resource_representation`) und wird auf das neue Schema umgestellt.
2. `has_mediaresource` und `has_webresource` beantworten vermutlich die Frage aus #243 nach Vorschaubild und Webressource. Mit der Fachgruppe bestätigen.
3. Rechteangaben pro Mediendatei berühren die Lizenzanzeige (#149, geschlossen) und die Frage, ob ein Bild eingebettet werden darf.

## 5. Arbeitspakete

Unabhängig von offenen Beschlüssen:

1. Inventarnummer von der Karte entfernen, Test ergänzen.
2. `docs/components/FilmRelatedMaterialsComp.md` neu erzeugen.

Mit neuem Mockup:

3. Datenmodell auf das neue Schema umstellen, Mockup einbinden.
4. Physical-Characteristics-Gruppen anzeigen.
5. Sammlung (mit Notiz) und Provenienz getrennt anzeigen.

Abhängig von Entscheidungen:

6. Zugangsstatus anzeigen.
7. Bildkomponente mit serverseitigem Caching (#244, neue Dependency `@nuxt/image` nötig).
8. Beschriftungen für Objektarten und Typ.

Die Suche bleibt bis zum Konzepttermin (Dezember/Januar) unverändert: keine Änderung an `searchConfig_avefi.ts` oder `InstantSearchTemplateAVefi.vue`.

## 6. Fragen an Fachgruppe und Team

1. Welches Feld trägt den Zugangsstatus bei FBM, und gibt es Werte im Mockup?
2. Gelten `has_mediaresource` als Vorschau und `has_webresource` als Webressource?
3. Welche deutschen Bezeichnungen gelten für die sieben Objektkategorien und für Konvolut/Set/Einzelobjekt?
4. Gibt es Testdaten mit echten Bildlinks (Picsum reicht für Layout, nicht für Fehlerfälle)?
