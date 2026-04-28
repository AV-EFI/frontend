import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = resolve(__dirname, '..');
const MODEL_PATH = resolve(ROOT_DIR, 'models', 'interfaces', 'schema', 'model.yaml');
const OUTPUT_PATH = resolve(ROOT_DIR, 'tests', 'data-quality', 'schema-severity.ts');

const FIELD_RULES = [
  { field: 'has_record.has_primary_title.has_name.keyword', slot: 'has_primary_title', className: 'WorkVariant', fallback: 'warning' },
  { field: 'has_record.type.keyword', slot: 'type', className: 'WorkVariant', fallback: 'info' },
  { field: 'has_record.described_by.has_issuer_name.keyword', slot: 'has_issuer_name', fallback: 'warning' },
  { field: 'has_record.described_by.has_issuer_id.keyword', slot: 'has_issuer_id', fallback: 'warning' },
  { field: 'manifestations.has_record.described_by.has_issuer_name.keyword', slot: 'has_issuer_name', fallback: 'warning' },
  { field: 'manifestations.items.has_record.described_by.has_issuer_name.keyword', slot: 'has_issuer_name', fallback: 'warning' },
  { field: 'has_record.has_event.has_activity.has_agent.has_name.keyword', slot: 'has_name', fallback: 'warning' },
  { field: 'manifestations.has_record.is_manifestation_of.id.keyword', slot: 'is_manifestation_of', fallback: 'warning' },
  { field: 'manifestations.items.has_record.is_item_of.id.keyword', slot: 'is_item_of', fallback: 'warning' },

  { field: 'manifestations.has_record.has_primary_title.has_name.keyword', slot: 'has_primary_title', className: 'Manifestation', fallback: 'warning' },
  { field: 'manifestations.items.has_record.has_primary_title.has_name.keyword', slot: 'has_primary_title', className: 'Item', fallback: 'warning' },
  { field: 'has_record.same_as.id.keyword', slot: 'same_as', fallback: 'warning' },
  { field: 'has_record.described_by.has_source_key.keyword', slot: 'has_source_key', fallback: 'warning' },
  { field: 'manifestations.has_record.described_by.has_source_key.keyword', slot: 'has_source_key', fallback: 'warning' },
  { field: 'manifestations.items.has_record.described_by.has_source_key.keyword', slot: 'has_source_key', fallback: 'warning' },
  { field: 'manifestations.has_record.has_sound_type.keyword', slot: 'has_sound_type', fallback: 'warning' },
  { field: 'manifestations.has_record.has_colour_type.keyword', slot: 'has_colour_type', fallback: 'warning' },
  { field: 'manifestations.items.has_record.has_access_status.keyword', slot: 'has_access_status', fallback: 'warning' },
  { field: 'manifestations.items.has_record.in_language.code.keyword', slot: 'in_language', fallback: 'warning' },
  { field: 'manifestations.items.has_record.element_type.keyword', slot: 'element_type', fallback: 'warning' },
  { field: 'manifestations.has_record.has_event.type.keyword', slot: 'type', fallback: 'warning', forceLevel: 'warning' },

  { field: 'has_record.has_event.has_activity.has_agent.has_alternate_name.keyword', slot: 'has_alternate_name', fallback: 'info' },
  { field: 'has_record.has_alternative_title.has_name.keyword', slot: 'has_alternative_title', fallback: 'info' },
  { field: 'has_record.has_event.located_in.has_name.keyword', slot: 'located_in', fallback: 'info' },
  { field: 'has_record.has_form.keyword', slot: 'has_form', fallback: 'info' },
  { field: 'has_record.has_genre.has_name.keyword', slot: 'has_genre', fallback: 'info' },
  { field: 'has_record.has_subject.has_name.keyword', slot: 'has_subject', fallback: 'info' },
  { field: 'manifestations.items.has_record.has_duration.has_value.keyword', slot: 'has_duration', fallback: 'info' },
  { field: 'manifestations.items.has_record.has_extent.has_value.keyword', slot: 'has_extent', fallback: 'info' },
  { field: 'manifestations.items.has_record.has_format.type.keyword', slot: 'has_format', fallback: 'info' },
  { field: 'subjects.keyword', fallback: 'info' },
  { field: 'directors_or_editors.keyword', fallback: 'info' },
  { field: 'castmembers.keyword', fallback: 'info' },
  { field: 'production.keyword', fallback: 'info' },
  { field: 'handle.keyword', fallback: 'warning' },
  { field: 'manifestations.handle.keyword', fallback: 'warning' },
  { field: 'manifestations.items.handle.keyword', fallback: 'warning' },
  { field: 'kip.keyword', fallback: 'info' },
  { field: 'url.keyword', fallback: 'info' },
  { field: 'manifestations.items.kip.keyword', fallback: 'info' },
  { field: 'manifestations.items.url.keyword', fallback: 'info' },
];

function indentOf(line) {
  return line.match(/^ */)?.[0].length ?? 0;
}

function parseRequiredSchema(yamlText) {
  const lines = yamlText.split(/\r?\n/);
  const requiredSlots = new Set();
  const requiredSlotUsage = new Map();
  let section = '';
  let currentSlot = '';
  let currentClass = '';
  let inSlotUsage = false;
  let currentUsageSlot = '';

  for (const line of lines) {
    if (/^\S/.test(line)) {
      section = line.replace(/:.*/, '');
      currentSlot = '';
      currentClass = '';
      inSlotUsage = false;
      currentUsageSlot = '';
      continue;
    }

    const indent = indentOf(line);
    const key = line.trim().replace(/:.*/, '');

    if (section === 'slots') {
      if (indent === 2 && /^[A-Za-z0-9_]+:/.test(line.trim())) {
        currentSlot = key;
      }
      if (currentSlot && indent > 2 && line.trim() === 'required: true') {
        requiredSlots.add(currentSlot);
      }
      continue;
    }

    if (section === 'classes') {
      if (indent === 2 && /^[A-Za-z0-9_]+:/.test(line.trim())) {
        currentClass = key;
        inSlotUsage = false;
        currentUsageSlot = '';
        continue;
      }
      if (!currentClass) continue;
      if (indent === 4 && line.trim() === 'slot_usage:') {
        inSlotUsage = true;
        currentUsageSlot = '';
        continue;
      }
      if (indent <= 4 && inSlotUsage && line.trim() !== 'slot_usage:') {
        inSlotUsage = false;
        currentUsageSlot = '';
      }
      if (inSlotUsage && indent === 6 && /^[A-Za-z0-9_]+:/.test(line.trim())) {
        currentUsageSlot = key;
        continue;
      }
      if (inSlotUsage && currentUsageSlot && indent > 6 && line.trim() === 'required: true') {
        const slots = requiredSlotUsage.get(currentClass) ?? new Set();
        slots.add(currentUsageSlot);
        requiredSlotUsage.set(currentClass, slots);
      }
    }
  }

  return { requiredSlots, requiredSlotUsage };
}

function resolveLevel(rule, schema) {
  if (rule.forceLevel) return rule.forceLevel;
  if (rule.slot && schema.requiredSlots.has(rule.slot)) return 'error';
  if (rule.className && rule.slot && schema.requiredSlotUsage.get(rule.className)?.has(rule.slot)) return 'error';
  return rule.fallback;
}

function formatArray(values) {
  return values.map((value) => `  '${value}',`).join('\n');
}

function formatSlotUsage(requiredSlotUsage) {
  return Array.from(requiredSlotUsage.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([className, slots]) => {
      const formattedSlots = Array.from(slots).sort().map((slot) => `'${slot}'`).join(', ');
      return `  ${className}: [${formattedSlots}],`;
    })
    .join('\n');
}

function generate() {
  if (!existsSync(MODEL_PATH)) {
    throw new Error(`Schema model not found: ${MODEL_PATH}`);
  }

  const schema = parseRequiredSchema(readFileSync(MODEL_PATH, 'utf8'));
  const levelEntries = FIELD_RULES
    .map((rule) => [rule.field, resolveLevel(rule, schema)])
    .sort(([a], [b]) => a.localeCompare(b));

  const output = `/**
 * AUTO-GENERATED by scripts/generate-schema-severity.mjs.
 *
 * Source of truth: models/interfaces/schema/model.yaml.
 * Do not hand-edit severity values here; update model.yaml or the ES field
 * inventory in the generator, then run npm run generate:schema-severity.
 */

import type { SchemaLevel } from './report-utils';

export type { SchemaLevel };

export const REQUIRED_SCHEMA_SLOTS = [
${formatArray(Array.from(schema.requiredSlots).sort())}
] as const;

export const REQUIRED_SCHEMA_SLOT_USAGE = {
${formatSlotUsage(schema.requiredSlotUsage)}
} as const;

export const ES_FIELD_SCHEMA_LEVEL: Record<string, SchemaLevel> = {
${levelEntries.map(([field, level]) => `  '${field}': '${level}',`).join('\n')}
};

export function schemaLevelForField(field: string, fallback: SchemaLevel = 'info'): SchemaLevel {
  return ES_FIELD_SCHEMA_LEVEL[field] ?? fallback;
}
`;

  writeFileSync(OUTPUT_PATH, output, 'utf8');
  console.log(`[DATA-QUALITY] Generated ${OUTPUT_PATH}`);
}

generate();
