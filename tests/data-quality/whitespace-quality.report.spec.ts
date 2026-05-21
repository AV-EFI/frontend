/**
 * Elasticsearch data-quality report: garbage / whitespace-only string values.
 *
 * The frontend warning for agent names uses the same suspicious-name patterns,
 * so import artifacts stay visible to users and measurable in the report.
 */

import { describe, it } from 'vitest';
import { SUSPICIOUS_NAME_PATTERNS } from '../../utils/agentQualityPatterns';
import { esSearch, getEsAuditConfig } from './es-client';
import { printLine, printMetric, printSection } from './report-utils';

const WS_PATTERN = '[ ,\t\n\r]+';

function regexpQuery(field: string) {
  return { regexp: { [field]: { value: WS_PATTERN } } };
}

function nestedQuery(path: string, inner: object) {
  return { nested: { path, query: inner } };
}

function doubleNestedQuery(outerPath: string, innerPath: string, inner: object) {
  return nestedQuery(outerPath, nestedQuery(innerPath, inner));
}

function printSampleHandles(hits: Array<{ _source?: unknown }>) {
  if (!hits.length) return;
  printLine('  Sample handles: ' + hits
    .map((hit) => (hit._source as { handle?: string })?.handle ?? '(no handle)')
    .join(', '));
}

async function check(cfg: Parameters<typeof esSearch>[0], label: string, query: object, warnThreshold?: number) {
  const result = await esSearch(cfg, { size: 10, _source: ['handle'], query });
  const count = result.hits.total.value;
  printMetric({ label, value: count, warnThreshold });
  if (count > 0) printSampleHandles(result.hits.hits);
}

describe('Elasticsearch data-quality report: whitespace-only field values', () => {
  it('reports whitespace/comma-only values and suspicious agent names', async () => {
    const cfg = getEsAuditConfig();
    if (!cfg) {
      printLine('Skipping whitespace-quality report. Missing ES_BASE_URL/ELASTIC_HOST* or ES_INDEX/ELASTIC_INDEX.');
      return;
    }

    printSection('Work-level text facets');
    await check(cfg, 'subjects (whitespace-only)', regexpQuery('subjects.keyword'));
    await check(cfg, 'directors_or_editors (whitespace-only)', regexpQuery('directors_or_editors.keyword'));
    await check(cfg, 'castmembers (whitespace-only)', regexpQuery('castmembers.keyword'));
    await check(cfg, 'production (whitespace-only)', regexpQuery('production.keyword'));
    await check(cfg, 'has_form (whitespace-only)', regexpQuery('has_record.has_form.keyword'));
    await check(cfg, 'has_genre.has_name (whitespace-only)', regexpQuery('has_record.has_genre.has_name.keyword'));

    printSection('Work-level title fields');
    await check(cfg, 'has_primary_title.has_name (whitespace-only)',
      regexpQuery('has_record.has_primary_title.has_name.keyword'), 0);
    await check(cfg, 'has_alternative_title.has_name (whitespace-only)',
      regexpQuery('has_record.has_alternative_title.has_name.keyword'));

    printSection('Work-level subject / genre fields');
    await check(cfg, 'has_subject.has_name (whitespace-only)',
      regexpQuery('has_record.has_subject.has_name.keyword'));

    printSection('Work-level event location');
    await check(cfg, 'located_in.has_name (whitespace-only)',
      nestedQuery('has_record.has_event',
        regexpQuery('has_record.has_event.located_in.has_name.keyword')));

    printSection('Agent name fields');
    for (const pattern of SUSPICIOUS_NAME_PATTERNS) {
      const nameField = 'has_record.has_event.has_activity.has_agent.has_name.keyword';
      const altNameField = 'has_record.has_event.has_activity.has_agent.has_alternate_name.keyword';
      await check(cfg, `has_agent.has_name [${pattern.id}]`,
        doubleNestedQuery('has_record.has_event', 'has_record.has_event.has_activity',
          pattern.esQuery(nameField)), 0);
      await check(cfg, `has_agent.has_alternate_name [${pattern.id}]`,
        doubleNestedQuery('has_record.has_event', 'has_record.has_event.has_activity',
          pattern.esQuery(altNameField)));
    }

    printSection('Manifestation-level fields');
    await check(cfg, 'manifestations: has_issuer_name (whitespace-only)',
      nestedQuery('manifestations',
        regexpQuery('manifestations.has_record.described_by.has_issuer_name.keyword')), 0);

    printSection('Manifestation event type');
    await check(cfg, 'manifestations: event type (whitespace-only)',
      doubleNestedQuery('manifestations', 'manifestations.has_record.has_event',
        regexpQuery('manifestations.has_record.has_event.type.keyword')));

    printSection('Item-level fields');
    const itemCheck = (label: string, field: string) =>
      check(cfg, label, nestedQuery('manifestations.items', regexpQuery(`manifestations.items.${field}`)));

    await itemCheck('items: has_access_status (whitespace-only)', 'has_record.has_access_status.keyword');
    await itemCheck('items: has_format.type (whitespace-only)', 'has_record.has_format.type.keyword');
    await itemCheck('items: has_colour_type (whitespace-only)', 'has_record.has_colour_type.keyword');
    await itemCheck('items: has_sound_type (whitespace-only)', 'has_record.has_sound_type.keyword');
    await itemCheck('items: in_language.code (whitespace-only)', 'has_record.in_language.code.keyword');
    await itemCheck('items: has_duration.has_value (whitespace-only)', 'has_record.has_duration.has_value.keyword');
    await itemCheck('items: has_extent.has_value (whitespace-only)', 'has_record.has_extent.has_value.keyword');
    await itemCheck('items: element_type (whitespace-only)', 'has_record.element_type.keyword');
  });
});
