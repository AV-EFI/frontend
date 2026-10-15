import explorerSchema from '~/assets/data/explorerSchema.json';

/**
 * The three levels of the AVefi data model, named as the schema names its classes.
 * Everything the explorer shows about fields comes from assets/data/explorerSchema.json,
 * which scripts/generate-explorer-schema.mjs builds from the schema snapshot.
 */
export type LevelId = 'work' | 'manifestation' | 'item';

export interface SchemaSlot {
  name: string;
  from: string;
  range: string | null;
  required: boolean;
  multivalued: boolean;
  labelDe: string | null;
  labelEn: string | null;
  description: string;
}

export interface SchemaClass {
  id: string;
  isA: string | null;
  abstract: boolean;
  labelDe: string | null;
  labelEn: string | null;
  description: string;
  slots: SchemaSlot[];
}

const classes = explorerSchema.classes as unknown as Record<string, SchemaClass>;

export const LEVEL_CLASS: Record<LevelId, string> = {
  work: 'WorkVariant',
  manifestation: 'Manifestation',
  item: 'Item',
};

export function getSchemaClass(classId: string): SchemaClass {
  const schemaClass = classes[classId];
  if (!schemaClass) throw new Error(`The schema has no class ${classId}`);
  return schemaClass;
}

/** A content error (a group naming a field the schema no longer has) must fail loudly, not render a gap. */
export function getSlot(classId: string, slotName: string): SchemaSlot {
  const slot = getSchemaClass(classId).slots.find((candidate) => candidate.name === slotName);
  if (!slot) throw new Error(`The schema has no field ${classId}.${slotName}`);
  return slot;
}

/** Splits "Item.has_format" into its class and field name. */
export function splitFieldRef(ref: string): { classId: string; slotName: string } {
  const [classId, slotName] = ref.split('.');
  if (!classId || !slotName) throw new Error(`"${ref}" is not a field reference like Item.has_format`);
  return { classId, slotName };
}

/** "Item.has_format" to its slot. */
export function getSlotByRef(ref: string): SchemaSlot & { classId: string } {
  const { classId, slotName } = splitFieldRef(ref);
  return { ...getSlot(classId, slotName), classId };
}

export function levelSlots(level: LevelId): SchemaSlot[] {
  return getSchemaClass(LEVEL_CLASS[level]).slots;
}
