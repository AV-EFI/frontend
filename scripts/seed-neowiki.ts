/**
 * One-time seed of a local NeoWiki instance with AVefi Schema:/Help: pages.
 *
 * Not part of the app build or runtime — run manually against a running
 * NeoWiki instance (see ../../neowiki, `make demo` equivalent):
 *
 *   tsx scripts/seed-neowiki.ts
 *
 * Reads NEOWIKI_BASE_URL / NEOWIKI_ADMIN_USER / NEOWIKI_ADMIN_PASSWORD from
 * .env.local, defaulting to NeoWiki's own `make demo` defaults.
 *
 * Schema: pages are NeoWiki's structured content type (JSON: description +
 * propertyDefinitions), generated from models/interfaces/schema/model.yaml —
 * the actual upstream av-efi-schema LinkML source, not this app's static
 * schema-explorer model. Help: pages are plain wikitext, hand-extracted from
 * public/doc/AVefi-Manual.pdf (cited per page below) — adapted, not invented.
 *
 * Both content types are created via the standard MediaWiki action=edit API,
 * not the NeoWiki-specific /neowiki/v0/subjects endpoint: that endpoint
 * creates graph Subjects (structured data instances), which is a different
 * concern from creating these Schema/Help content pages.
 */

import fs from 'node:fs'
import path from 'node:path'
import yaml from 'js-yaml'

const NEOWIKI_BASE_URL = process.env.NEOWIKI_BASE_URL ?? 'http://localhost:8484'
const NEOWIKI_ADMIN_USER = process.env.NEOWIKI_ADMIN_USER ?? 'AdminName'
const NEOWIKI_ADMIN_PASSWORD = process.env.NEOWIKI_ADMIN_PASSWORD ?? 'AdminPassword'
const API_URL = `${NEOWIKI_BASE_URL}/w/api.php`

const MODEL_PATH = path.resolve('models/interfaces/schema/model.yaml')

const SLICE_CLASS_IDS = ['WorkVariant', 'Manifestation', 'Item', 'Event', 'Activity', 'Agent', 'Genre'] as const
type SliceClassId = (typeof SLICE_CLASS_IDS)[number]

// Slots whose value references another record. Only mapped to a NeoWiki
// "relation" property when the target is also in our slice; otherwise left
// as text (below) since there is no Schema page yet to relate to.
const RELATION_TARGETS: Partial<Record<string, SliceClassId>> = {
  is_variant_of: 'WorkVariant',
  is_part_of: 'WorkVariant',
  is_manifestation_of: 'WorkVariant',
  has_item: 'Item',
  is_item_of: 'Manifestation',
  has_event: 'Event',
  has_activity: 'Activity',
  has_agent: 'Agent',
  has_genre: 'Genre',
}

interface YamlAlias {
  literal_form: string
  in_language: string
}

interface YamlSlot {
  description?: string
  range?: string
  multivalued?: boolean
}

interface YamlClass {
  is_a?: string
  abstract?: boolean
  slots?: string[]
  description?: string
  structured_aliases?: YamlAlias[]
  related_mappings?: string[]
  close_mappings?: string[]
  broad_mappings?: string[]
}

interface AvefiModel {
  classes: Record<string, YamlClass>
  slots: Record<string, YamlSlot>
}

function loadModel(): AvefiModel {
  const text = fs.readFileSync(MODEL_PATH, 'utf-8')
  return yaml.load(text) as AvefiModel
}

function resolveSlotNames(model: AvefiModel, className: string): string[] {
  const names = new Set<string>()
  let current: string | undefined = className
  while (current) {
    const cls: YamlClass | undefined = model.classes[current]
    if (!cls) break
    for (const slot of cls.slots ?? []) names.add(slot)
    current = cls.is_a
  }
  return [...names]
}

function aliasSuffix(aliases?: YamlAlias[]): string {
  if (!aliases?.length) return ''
  return ` (${aliases.map((a) => `${a.in_language}: ${a.literal_form}`).join(', ')})`
}

function mappingsSuffix(cls: YamlClass): string {
  const all = [...(cls.related_mappings ?? []), ...(cls.close_mappings ?? []), ...(cls.broad_mappings ?? [])]
  if (!all.length) return ''
  return ` Related ontology terms: ${all.join(', ')}.`
}

function buildSchemaJson(model: AvefiModel, className: SliceClassId): string {
  const cls = model.classes[className]
  if (!cls) throw new Error(`Class not found in model.yaml: ${className}`)

  const description = `${(cls.description ?? '').trim()}${aliasSuffix(cls.structured_aliases)}${mappingsSuffix(cls)} See also: Help:${className}.`.trim()

  const propertyDefinitions: Record<string, unknown> = {}
  for (const slotName of resolveSlotNames(model, className)) {
    const slot = model.slots[slotName]
    if (!slot) continue
    const target = RELATION_TARGETS[slotName]
    if (target) {
      propertyDefinitions[slotName] = {
        type: 'relation',
        relation: slotName,
        targetSchema: target,
        description: (slot.description ?? '').trim(),
      }
    } else {
      propertyDefinitions[slotName] = {
        type: 'text',
        ...(slot.multivalued ? { multiple: true } : {}),
        // Text, not date: AVefi dates are EDTF-style and may carry '?'/'~'
        // qualifiers or intervals that a typed date field cannot hold
        // losslessly (see Help:Dates).
        description: (slot.description ?? '').trim(),
      }
    }
  }

  return JSON.stringify({ description, propertyDefinitions }, null, 2)
}

// Hand-extracted from public/doc/AVefi-Manual.pdf (Vorabversion 2.2), cited
// per page. Adapted for wiki formatting only; terminology and examples are
// preserved from the source.
const HELP_PAGES: Record<string, string> = {
  'Help:Data_model': `Source: AVefi-Manual, §3.2 "AVefi-Datenmodell" (p. 3-5).

== Werk, Variante, Manifestation, Exemplar ==

The AVefi data model distinguishes three (optionally four) levels, following FIAF terminology:

* '''Werk (Work)''': the film as an abstract entity — its intellectual/artistic content and the process of its realisation (what it's called, when and by whom it was made). These core facts typically don't change across manifestations.
* '''Variante (Variant)''': a version of a work created through substantial reworking (cutting, re-editing, dubbing). The line between a new variant and a new work is fluid; describing variants is optional in AVefi.
* '''Manifestation''': a specific version of a work, represented by items in a collection. Describes what the associated items ideally should be, independent of what actually survives in the archive.
* '''Exemplar (Item)''': a concrete physical (or digital) object in a film collection — the physical product of a manifestation. Can consist of one or more components (e.g. one reel, or five).

An Item cannot stand alone in AVefi: it is always tied to a Manifestation and its Work. Conversely, only Works and Manifestations that have Items are recorded.

== Deliberate deviation from FIAF ==

'''Important''': AVefi's model deviates slightly from FIAF's recommendations on where technical properties live. For reasons of data purity, colour, sound and duration are recorded '''only at the Item level''', not at Manifestation — because practice partners generally document these on the physical copy, not the idealised manifestation, and because of AVefi's strong collection-holdings focus. Concretely: the ''actual'' properties of the copy are captured, not the idealised technical properties of the manifestation.

See also: [[Schema:WorkVariant]], [[Schema:Manifestation]], [[Schema:Item]].`,

  'Help:Dates': `Source: AVefi-Manual, §5.4 "Jahr" (p. 8), and models/interfaces/schema/model.yaml (ISODate type).

== Date format ==

AVefi dates follow ISO 8601-2019, specifically the Extended Date/Time Format (EDTF) from the Library of Congress. All Level 0 notations are permitted, plus two qualifiers:

* '''?''' for an uncertain date (±5 years)
* '''~''' for an approximate date (±1 year)

A date field holding "unbekannt" (unknown) counts as unset.

Examples:
* <code>2015-04-24</code> — complete date (year, month, day)
* <code>2015-04</code> — year and month
* <code>2015</code> — year only
* <code>2015~</code> — approximately 2015, between 2014 and 2016
* <code>2015?</code> — uncertain 2015, somewhere between 2010 and 2020
* <code>2015/2016</code> — an interval from 2015 to 2016
* <code>2015-04-24/2016-06</code> — an interval from 24 April 2015 to June 2016

== Why dates are stored as text ==

A ±1 year deviation is tolerated during automated work-matching (with the exception of amateur films, see §5.8). Because EDTF strings can carry qualifiers and intervals that a strict date type cannot represent without loss, AVefi date fields (e.g. <code>has_date</code> on an Event) are modelled as plain text here, not a typed date — the original string is preserved losslessly rather than coerced into an exact value.

See also: [[Schema:Event]].`,

  'Help:Agents': `Source: AVefi-Manual, §5.5 "Regieangaben" (p. 9).

== Naming convention ==

Directors ("Regie") are recorded as "Nachname, Vorname" (family name, given name). Using a GND identifier is recommended, since it helps with work disambiguation — e.g. when a name is spelled differently across sources. A value of "unbekannt" (unknown) counts as unset. Multiple directors are possible.

Besides the classic director role, a work can also record a "Filmemacher" (filmmaker) — a term mainly relevant for amateur films, describing a person responsible for both concept and execution of all aspects of the film. A filmmaker is treated as equivalent to a director when matching works.

Examples:
* Regie: Troller, Georg Stefan
* Regie: Petzold, Christian (GND ID: http://d-nb.info/gnd/134218272)
* Regie: Wachowski, Lana (GND ID: http://d-nb.info/gnd/122552571)
* Regie: Unbekannt
* Filmemacher: Förster, Werner

See also: [[Schema:Agent]], [[Schema:Activity]], [[Help:Identifiers]].`,

  'Help:Identifiers': `Source: AVefi-Manual, §5.6 "Identifikatoren und Normdaten" (p. 9).

== Authority files by entity type ==

In the spirit of Linked Open Data, AVefi metadata references established identifier and authority systems wherever possible. Using authority identifiers is not mandatory, but strongly encouraged — it enables more stable automated matching.

* '''People and subject terms''': GND (Gemeinsame Normdatei), via https://lobid.org/gnd. Up to 99 subject terms can technically be delivered per work.
* '''People (additional supported authorities)''': Filmportal, VIAF (Virtual International Authority File), Wikidata.
* '''Places''': Getty Thesaurus of Geographic Names (TGN), https://www.getty.edu/research/tools/vocabularies/tgn/.
* '''Dates''': the EDTF standard (Library of Congress) — see [[Help:Dates]].

These identifiers are recorded via the <code>same_as</code> property on the relevant record or embedded structure (Agent, GeographicName, Genre, Subject, etc.).

See also: [[Schema:Agent]], [[Help:Dates]].`,

  'Help:Titles': `Source: AVefi-Manual, §5.2 "Titel und Archivtitel" (p. 7-8).

== Primary and alternative titles ==

The AVefi schema distinguishes primary titles from alternative titles. Every work must have a primary title, typed either ''Preferred Title'' or, for an archive title, ''Supplied/Devised Title''. Ideally the primary title is the work's original title; alternatively another title (e.g. a distribution title) may be used as long as it is typed ''Preferred Title''.

Subtitles are recorded together with the title itself (there is no separate subtitle field). Title language is not required, since it isn't shown on the AVefi research platform. Any number of alternative titles, each with an appropriate title type, can be added alongside the primary title.

Series episode numbers are recorded directly in the title (no separate field, as of this version). Articles are kept in leading position; a sort title may additionally be given with the article moved to the end after a comma.

== Archive titles ==

If no title exists, an archive title is constructed, following FIAF-oriented convention, composed of:

* '''Source/collection name''' — the film collection's name, if known
* '''Category''' (optional) — e.g. Betriebsausflug (works outing), Familienfilm/Home Movie, Filmtagebuch, Fragment, Kompilation, Privataufnahme, Reisefilm
* '''Who or what''' — people, events, or objects shown in the film
* '''Where''' — location
* '''When''' — time span or exact date, in addition to the dedicated production-date field

Example: ''Archivtitel: Sammlung Max Mustermann, Reisetagebuch, Dresden, 1970-1971''

Title character length is technically capped at 250 characters.

See also: [[Schema:WorkVariant]].`,
}

function buildMainPage(): string {
  const schemaLinks = SLICE_CLASS_IDS.map((id) => `* [[Schema:${id}]]`).join('\n')
  const helpLinks = Object.keys(HELP_PAGES)
    .map((title) => `* [[${title}]]`)
    .join('\n')

  return `== AVefi Knowledge Base PoC ==

Vertical-slice evaluation of NeoWiki as a navigable layer over the AVefi data model and documentation. See scripts/seed-neowiki.ts in the frontend repo for how this content was generated.

=== Data model (Schema:) ===

${schemaLinks}

=== Documentation (Help:) ===

${helpLinks}
`
}

interface CookieJar {
  cookies: Map<string, string>
}

function newJar(): CookieJar {
  return { cookies: new Map() }
}

function storeCookies(jar: CookieJar, response: Response): void {
  const setCookie = response.headers.getSetCookie?.() ?? []
  for (const line of setCookie) {
    const [pair] = line.split(';')
    const eq = pair.indexOf('=')
    if (eq === -1) continue
    jar.cookies.set(pair.slice(0, eq).trim(), pair.slice(eq + 1).trim())
  }
}

function cookieHeader(jar: CookieJar): string {
  return [...jar.cookies.entries()].map(([k, v]) => `${k}=${v}`).join('; ')
}

async function apiGet(jar: CookieJar, params: Record<string, string>): Promise<any> {
  const url = new URL(API_URL)
  for (const [k, v] of Object.entries({ format: 'json', ...params })) url.searchParams.set(k, v)
  const response = await fetch(url, { headers: { Cookie: cookieHeader(jar) } })
  storeCookies(jar, response)
  return response.json()
}

async function apiPost(jar: CookieJar, params: Record<string, string>): Promise<any> {
  const body = new URLSearchParams({ format: 'json', ...params })
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { Cookie: cookieHeader(jar), 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })
  storeCookies(jar, response)
  return response.json()
}

async function login(jar: CookieJar): Promise<void> {
  const tokenResponse = await apiGet(jar, { action: 'query', meta: 'tokens', type: 'login' })
  const logintoken = tokenResponse.query.tokens.logintoken

  const loginResponse = await apiPost(jar, {
    action: 'login',
    lgname: NEOWIKI_ADMIN_USER,
    lgpassword: NEOWIKI_ADMIN_PASSWORD,
    lgtoken: logintoken,
  })

  if (loginResponse.login?.result !== 'Success') {
    throw new Error(`NeoWiki login failed: ${JSON.stringify(loginResponse.login)}`)
  }
}

async function getCsrfToken(jar: CookieJar): Promise<string> {
  const response = await apiGet(jar, { action: 'query', meta: 'tokens' })
  return response.query.tokens.csrftoken
}

async function editPage(jar: CookieJar, csrfToken: string, title: string, text: string): Promise<void> {
  const response = await apiPost(jar, {
    action: 'edit',
    title,
    text,
    token: csrfToken,
    bot: '1',
    summary: 'Seed from AVefi model.yaml / manual (scripts/seed-neowiki.ts)',
  })
  if (response.error) {
    console.error(`  FAILED ${title}: ${response.error.info ?? JSON.stringify(response.error)}`)
    return
  }
  const result = response.edit?.result ?? response.edit?.new ?? 'unknown'
  console.log(`  ok ${title} (${result})`)
}

async function main(): Promise<void> {
  const model = loadModel()
  const jar = newJar()

  console.log(`Logging in to ${NEOWIKI_BASE_URL} as ${NEOWIKI_ADMIN_USER}...`)
  await login(jar)
  const csrfToken = await getCsrfToken(jar)

  console.log('Seeding Schema: pages from model.yaml...')
  for (const classId of SLICE_CLASS_IDS) {
    const json = buildSchemaJson(model, classId)
    await editPage(jar, csrfToken, `Schema:${classId}`, json)
  }

  console.log('Seeding Help: pages from AVefi-Manual.pdf...')
  for (const [title, wikitext] of Object.entries(HELP_PAGES)) {
    await editPage(jar, csrfToken, title, wikitext)
  }

  console.log('Seeding Main Page index...')
  await editPage(jar, csrfToken, 'Main Page', buildMainPage())

  console.log('Done.')
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
