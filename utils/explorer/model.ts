import { LEVEL_CLASS, getSlotByRef, levelSlots, type LevelId } from './schemaModel';

/**
 * How the explorer arranges the schema: which fields belong together and in which order.
 * The grouping is an editorial draft of this view. Every field name must exist in the
 * schema (checked on use), and every field of each level must appear in exactly one group
 * (checked in tests/unit/utils/explorer-model.spec.ts), so a schema change cannot silently
 * leave a field out.
 */

export type GroupId =
  | 'w_type' | 'w_content' | 'w_relations'
  | 'm_notes' | 'm_links'
  | 'i_tech' | 'i_language' | 'i_access' | 'i_notes' | 'i_relations'
  | 's_title' | 's_events' | 's_ids' | 's_origin';

export type RuleId = 'r_manifestation' | 'r_item';
type ExtraId = 'titleType' | 'directing' | 'formats';

export interface FieldGroup {
  id: GroupId;
  /** The level a group belongs to, or "all" for fields every record has. */
  scope: LevelId | 'all';
  /** Field names on the level class, shown as badges in the band. */
  slots: readonly string[];
  /** Fields shown in the drawer as "Class.field", when they reach beyond the level class. */
  detailFields?: readonly string[];
  /** Fields the automatic work match compares (AVefi Manual 2.2, section 5.8). */
  matchFields?: readonly string[];
  extra?: ExtraId;
}

export interface LevelDef {
  id: LevelId;
  number: 1 | 2 | 3;
  icon: string;
  groups: readonly GroupId[];
  upRule: RuleId | null;
}

export const LEVELS: readonly LevelDef[] = [
  { id: 'work', number: 1, icon: 'tabler:stack-front', groups: ['w_type', 'w_content', 'w_relations'], upRule: null },
  { id: 'manifestation', number: 2, icon: 'tabler:stack-middle', groups: ['m_notes', 'm_links'], upRule: 'r_manifestation' },
  { id: 'item', number: 3, icon: 'tabler:stack-back', groups: ['i_tech', 'i_language', 'i_access', 'i_notes', 'i_relations'], upRule: 'r_item' },
];

const SHARED_GROUPS: readonly GroupId[] = ['s_title', 's_events', 's_ids', 's_origin'];

const GROUPS: readonly FieldGroup[] = [
  { id: 'w_type', scope: 'work', slots: ['type', 'variant_type', 'has_form'] },
  { id: 'w_content', scope: 'work', slots: ['has_genre', 'has_subject'] },
  { id: 'w_relations', scope: 'work', slots: ['is_variant_of', 'is_part_of'] },
  { id: 'm_notes', scope: 'manifestation', slots: ['has_note', 'has_webresource'] },
  { id: 'm_links', scope: 'manifestation', slots: ['is_manifestation_of', 'has_item'] },
  {
    id: 'i_tech',
    scope: 'item',
    slots: ['element_type', 'has_format', 'has_extent', 'has_duration', 'has_colour_type', 'has_sound_type', 'has_frame_rate'],
    extra: 'formats',
  },
  { id: 'i_language', scope: 'item', slots: ['in_language'] },
  { id: 'i_access', scope: 'item', slots: ['has_access_status'] },
  { id: 'i_notes', scope: 'item', slots: ['has_note', 'has_webresource'] },
  { id: 'i_relations', scope: 'item', slots: ['is_item_of', 'is_copy_of', 'is_derivative_of'] },
  {
    id: 's_title',
    scope: 'all',
    slots: ['has_primary_title', 'has_alternative_title'],
    detailFields: ['WorkVariant.has_primary_title', 'WorkVariant.has_alternative_title', 'Title.has_name', 'Title.has_ordering_name', 'Title.type'],
    matchFields: ['Title.has_name'],
    extra: 'titleType',
  },
  {
    id: 's_events',
    scope: 'all',
    slots: ['has_event'],
    detailFields: [
      'WorkVariant.has_event', 'Event.has_date', 'Event.located_in', 'Event.has_activity',
      'Activity.type', 'Activity.has_agent', 'Agent.has_name', 'Agent.has_alternate_name', 'Agent.type',
    ],
    matchFields: ['Event.has_date', 'Event.located_in', 'Agent.has_name'],
    extra: 'directing',
  },
  {
    id: 's_ids',
    scope: 'all',
    slots: ['category', 'has_identifier', 'same_as'],
    detailFields: ['WorkVariant.category', 'WorkVariant.has_identifier', 'WorkVariant.same_as', 'Agent.same_as', 'AuthorityResource.id', 'MovingImageResource.id'],
    matchFields: ['Agent.same_as'],
  },
  {
    id: 's_origin',
    scope: 'all',
    slots: ['described_by'],
    detailFields: ['WorkVariant.described_by', 'DescriptionResource.has_issuer_id', 'DescriptionResource.has_issuer_name', 'DescriptionResource.last_modified'],
  },
];

export type MatchKind = 'title' | 'place' | 'year' | 'director' | 'identifier';

/** What each compared field is called in the work match. */
export const MATCH_FIELD_KIND: Record<string, MatchKind> = {
  'Title.has_name': 'title',
  'Event.located_in': 'place',
  'Event.has_date': 'year',
  'Agent.has_name': 'director',
  'Agent.same_as': 'identifier',
};

/** Level fields that carry compared values, and the words shown on their badge. */
export const MATCH_SLOT_KIND = { has_primary_title: 'title', has_event: 'event', same_as: 'id' } as const;

export interface RuleDef {
  id: RuleId;
  levels: readonly [LevelId, LevelId];
  fields: readonly string[];
}

export const RULES: Record<RuleId, RuleDef> = {
  r_manifestation: { id: 'r_manifestation', levels: ['work', 'manifestation'], fields: ['Manifestation.is_manifestation_of'] },
  r_item: { id: 'r_item', levels: ['manifestation', 'item'], fields: ['Item.is_item_of', 'Manifestation.has_item'] },
};

/** Rules a delivery has to meet, and who states them. Wording is in the explorer locale files. */
export const IMPORT_RULES = [
  { id: 'identifier', kind: 'manual' },
  { id: 'unique', kind: 'check' },
  { id: 'references', kind: 'check' },
  { id: 'withItems', kind: 'check' },
  { id: 'removed', kind: 'check' },
  { id: 'dates', kind: 'check' },
] as const;

export function getGroup(id: GroupId): FieldGroup {
  const group = GROUPS.find((candidate) => candidate.id === id);
  if (!group) throw new Error(`Unknown field group ${id}`);
  return group;
}

export function getLevel(id: LevelId): LevelDef {
  const level = LEVELS.find((candidate) => candidate.id === id);
  if (!level) throw new Error(`Unknown level ${id}`);
  return level;
}

/** Fields shown in the drawer for a group, always as "Class.field". */
export function groupDetailFields(group: FieldGroup): readonly string[] {
  if (group.detailFields) return group.detailFields;
  return group.slots.map((slot) => `${LEVEL_CLASS[group.scope as LevelId]}.${slot}`);
}

export function groupHasRequired(group: FieldGroup): boolean {
  return groupDetailFields(group).some((ref) => getSlotByRef(ref).required);
}

export function groupHasMatch(group: FieldGroup): boolean {
  return (group.matchFields?.length ?? 0) > 0;
}

export function groupsOfLevel(level: LevelId): FieldGroup[] {
  return getLevel(level).groups.map(getGroup);
}

export function sharedGroups(): FieldGroup[] {
  return SHARED_GROUPS.map(getGroup);
}

/** The levels a group is shown at. */
export function levelsOfGroup(group: FieldGroup): LevelId[] {
  return group.scope === 'all' ? LEVELS.map((level) => level.id) : [group.scope];
}

export function levelCoverage(level: LevelId): { shown: number; total: number } {
  const shown = new Set([...groupsOfLevel(level), ...sharedGroups()].flatMap((group) => group.slots));
  return { shown: shown.size, total: levelSlots(level).length };
}

/** A field of one level, with the group it is shown in. */
export interface LevelField {
  level: LevelId;
  slot: string;
  group: GroupId;
}

/** The group that shows a field of a level, whether it belongs to the level or to every record. */
function groupOfSlot(level: LevelId, slot: string): GroupId {
  const group = [...groupsOfLevel(level), ...sharedGroups()].find((candidate) => candidate.slots.includes(slot));
  if (!group) throw new Error(`No field group shows ${level}.${slot}`);
  return group.id;
}

/** Every required field of the three levels, in the order of the levels. */
export function requiredFields(): LevelField[] {
  return LEVELS.flatMap((level) =>
    levelSlots(level.id)
      .filter((slot) => slot.required)
      .map((slot) => ({ level: level.id, slot: slot.name, group: groupOfSlot(level.id, slot.name) })),
  );
}

export interface MatchField {
  /** "Class.field" as the schema names it. */
  ref: string;
  kind: MatchKind;
  group: GroupId;
}

/** The fields the work match compares, with the group that explains them. */
export function matchFields(): MatchField[] {
  const groups = [...sharedGroups()];
  return Object.entries(MATCH_FIELD_KIND).map(([ref, kind]) => {
    const group = groups.find((candidate) => groupDetailFields(candidate).includes(ref));
    if (!group) throw new Error(`No field group explains the match field ${ref}`);
    return { ref, kind, group: group.id };
  });
}

