/**
 * Elasticsearch data-quality report: garbage / whitespace-only field values
 *
 * Checks that string fields which must carry meaningful text do not contain
 * garbage values. Agent name fields are checked against ALL patterns defined
 * in utils/agentQualityPatterns.ts (single source of truth shared with frontend).
 * All other fields are checked for whitespace-only values.
 *
 * These checks are INFORMATIONAL — they never fail the test run or block deployment.
 *
 * ── Schema severity levels (from models/interfaces/schema/model.yaml) ────────
 *
 *   [schema:error]   — field is required:true in schema; garbage/missing = violation
 *   [schema:warning] — optional field but important; violations warrant attention
 *   [schema:info]    — optional enrichment field; violations are lower priority
 *
 *   When [schema:error] and count > 0, severity is automatically raised to [WARN]
 *   even without a configured warnThreshold. See schema-severity.ts for the full map.
 *
 * ── Nesting structure (confirmed against live mapping) ───────────────────────
 *
 *   has_record.has_event                         → nested
 *   has_record.has_event.has_activity            → nested
 *   manifestations                               → nested
 *   manifestations.has_record.has_event          → nested
 *   manifestations.items                         → nested
 *   everything else at work level                → object (plain regexp)
 *
 * ── Confirmed garbage in the testbed (21.11155-denormalised-work-testbed) ────
 *
 *   whitespace-comma-only : 218 docs  (has_agent.has_name = ", ")  → [schema:error]
 *   mojibake              :   0 docs in real data (PowerShell terminal display artifact;
 *                             actual umlauts stored correctly as UTF-8; rule kept as
 *                             defensive measure)                    → [schema:error]
 *   digits-only           :   0 docs currently (defensive rule)    → [schema:error]
 *
 * Note: has_name is globally required:true in model.yaml, so any garbage value
 * in has_agent.has_name is a schema violation, not just a display anomaly.
 */

import { describe, it } from 'vitest';
import { esSearch, getEsAuditConfig } from './es-client';
import { printLine, printMetric, printSection } from './report-utils';
import type { SchemaLevel } from './report-utils';
import { schemaLevelForField } from './schema-severity';
import { SUSPICIOUS_NAME_PATTERNS } from '~/utils/agentQualityPatterns';

// Whitespace-only pattern used for non-agent fields (not derived from SUSPICIOUS_NAME_PATTERNS
// because those fields don't share the same garbage profile as agent names).
const WS_PATTERN = '[ ,\t\n\r]+';

function regexpQuery(field: string) {
  return { regexp: { [field]: { value: WS_PATTERN } } };
}

/** Single nested wrapper */
function nestedQuery(path: string, inner: object) {
  return { nested: { path, query: inner } };
}

/** Double nested wrapper */
function doubleNestedQuery(outerPath: string, innerPath: string, inner: object) {
  return nestedQuery(outerPath, nestedQuery(innerPath, inner));
}

function printSampleHandles(hits: Array<{ _source?: unknown }>) {
  if (!hits.length) return;
  printLine('  Sample handles: ' + hits
    .map((h) => (h._source as { handle?: string })?.handle ?? '(no handle)')
    .join(', '));
}

async function check(
  cfg: Parameters<typeof esSearch>[0],
  label: string,
  query: object,
  schemaLevel?: SchemaLevel,
) {
  const result = await esSearch(cfg, { size: 10, _source: ['handle'], query });
  const count = result.hits.total.value;
  printMetric({ label, value: count, schemaLevel });
  if (count > 0) printSampleHandles(result.hits.hits);
}

describe('Elasticsearch data-quality report: whitespace-only field values', () => {
  it('reports whitespace-only values across all string facet fields and agent name fields', async () => {
    const cfg = getEsAuditConfig();
    if (!cfg) {
      printLine('Skipping whitespace-quality report. Missing ES_BASE_URL/ELASTIC_HOST* or ES_INDEX/ELASTIC_INDEX.');
      return;
    }

    // -----------------------------------------------------------------------
    // Work-level top-level text fields (no nesting needed)
    // Denormalized search fields — not from schema, derived at index time → info
    // -----------------------------------------------------------------------
    printSection('Work-level text facets');
    await check(cfg, 'subjects (whitespace-only)',
      regexpQuery('subjects.keyword'), schemaLevelForField('subjects.keyword'));
    await check(cfg, 'directors_or_editors (whitespace-only)',
      regexpQuery('directors_or_editors.keyword'), schemaLevelForField('directors_or_editors.keyword'));
    await check(cfg, 'castmembers (whitespace-only)',
      regexpQuery('castmembers.keyword'), schemaLevelForField('castmembers.keyword'));
    await check(cfg, 'production (whitespace-only)',
      regexpQuery('production.keyword'), schemaLevelForField('production.keyword'));
    await check(cfg, 'has_form (whitespace-only)',
      regexpQuery('has_record.has_form.keyword'), schemaLevelForField('has_record.has_form.keyword'));
    await check(cfg, 'has_genre.has_name (whitespace-only)',
      regexpQuery('has_record.has_genre.has_name.keyword'), schemaLevelForField('has_record.has_genre.has_name.keyword'));

    // -----------------------------------------------------------------------
    // Work-level title fields
    // has_primary_title.has_name: required:true on WorkVariant → error
    // has_alternative_title.has_name: optional → info
    // -----------------------------------------------------------------------
    printSection('Work-level title fields');
    await check(cfg, 'has_primary_title.has_name (whitespace-only)',
      regexpQuery('has_record.has_primary_title.has_name.keyword'), schemaLevelForField('has_record.has_primary_title.has_name.keyword'));
    await check(cfg, 'has_alternative_title.has_name (whitespace-only)',
      regexpQuery('has_record.has_alternative_title.has_name.keyword'), schemaLevelForField('has_record.has_alternative_title.has_name.keyword'));

    // -----------------------------------------------------------------------
    // Work-level subject has_name
    // has_subject.has_name: optional enrichment → info
    // -----------------------------------------------------------------------
    printSection('Work-level subject / genre fields');
    await check(cfg, 'has_subject.has_name (whitespace-only)',
      regexpQuery('has_record.has_subject.has_name.keyword'), schemaLevelForField('has_record.has_subject.has_name.keyword'));

    // -----------------------------------------------------------------------
    // has_event (nested) → located_in.has_name (object)
    // located_in is optional in schema → info
    // -----------------------------------------------------------------------
    printSection('Work-level event location (nested: has_record.has_event)');
    await check(cfg, 'located_in.has_name (whitespace-only)',
      nestedQuery('has_record.has_event',
        regexpQuery('has_record.has_event.located_in.has_name.keyword')), schemaLevelForField('has_record.has_event.located_in.has_name.keyword'));

    // -----------------------------------------------------------------------
    // has_event (nested) → has_activity (nested) → has_agent (object)
    // All SUSPICIOUS_NAME_PATTERNS are checked here — same rules as the frontend.
    //
    // has_name is globally required:true in model.yaml → any garbage value is
    // a schema error ([schema:error]).
    //
    // has_alternate_name is optional → [schema:info].
    // -----------------------------------------------------------------------
    printSection('Agent name fields (double-nested: has_event → has_activity)');
    for (const pattern of SUSPICIOUS_NAME_PATTERNS) {
      const nameField = 'has_record.has_event.has_activity.has_agent.has_name.keyword';
      const altNameField = 'has_record.has_event.has_activity.has_agent.has_alternate_name.keyword';
      await check(cfg, `has_agent.has_name [${pattern.id}]`,
        doubleNestedQuery('has_record.has_event', 'has_record.has_event.has_activity',
          pattern.esQuery(nameField)), schemaLevelForField(nameField));
      await check(cfg, `has_agent.has_alternate_name [${pattern.id}]`,
        doubleNestedQuery('has_record.has_event', 'has_record.has_event.has_activity',
          pattern.esQuery(altNameField)), schemaLevelForField(altNameField));
    }

    // -----------------------------------------------------------------------
    // manifestations (nested) → has_issuer_name (object)
    // has_issuer_name is required:true on DescriptionResource → error
    // -----------------------------------------------------------------------
    printSection('Manifestation-level fields (nested: manifestations)');
    await check(cfg, 'manifestations: has_issuer_name (whitespace-only)',
      nestedQuery('manifestations',
        regexpQuery('manifestations.has_record.described_by.has_issuer_name.keyword')), schemaLevelForField('manifestations.has_record.described_by.has_issuer_name.keyword'));

    // -----------------------------------------------------------------------
    // manifestations (nested) → has_record.has_event (nested) → type (object)
    // type is required on PreservationEvent/PublicationEvent (the main manifestation
    // event types), but we can't distinguish event subtype at query level → warning
    // -----------------------------------------------------------------------
    printSection('Manifestation event type (double-nested: manifestations → has_record.has_event)');
    await check(cfg, 'manifestations: event type (whitespace-only)',
      doubleNestedQuery('manifestations', 'manifestations.has_record.has_event',
        regexpQuery('manifestations.has_record.has_event.type.keyword')), schemaLevelForField('manifestations.has_record.has_event.type.keyword'));

    // -----------------------------------------------------------------------
    // manifestations.items (nested) — all item-level facet fields
    // nestedPath: "manifestations.items" in searchConfig
    // Schema levels:
    //   has_access_status, has_colour_type, has_sound_type, in_language → warning
    //   has_format.type, has_duration, has_extent, element_type         → info
    // -----------------------------------------------------------------------
    printSection('Item-level fields (nested: manifestations.items)');
    const itemCheck = (label: string, field: string) =>
      check(cfg, label,
        nestedQuery('manifestations.items',
          regexpQuery(`manifestations.items.${field}`)), schemaLevelForField(`manifestations.items.${field}`));

    await itemCheck('items: has_access_status (whitespace-only)',      'has_record.has_access_status.keyword');
    await itemCheck('items: has_format.type (whitespace-only)',        'has_record.has_format.type.keyword');
    await itemCheck('items: has_colour_type (whitespace-only)',        'has_record.has_colour_type.keyword');
    await itemCheck('items: has_sound_type (whitespace-only)',         'has_record.has_sound_type.keyword');
    await itemCheck('items: in_language.code (whitespace-only)',       'has_record.in_language.code.keyword');
    await itemCheck('items: has_duration.has_value (whitespace-only)', 'has_record.has_duration.has_value.keyword');
    await itemCheck('items: has_extent.has_value (whitespace-only)',   'has_record.has_extent.has_value.keyword');
    await itemCheck('items: element_type (whitespace-only)',           'has_record.element_type.keyword');
  });
});
