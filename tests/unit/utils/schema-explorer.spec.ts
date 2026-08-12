import { describe, expect, test } from 'vitest';
import {
  formatSlotRange,
  getEdgesForClass,
  getRequiredSlots,
  getSchemaClassById,
  getSchemaStats,
  schemaExplorerModel,
  searchSchemaClasses,
} from '~/utils/schemaExplorer';

describe('schema explorer model', () => {
  test('keeps the WorkVariant to Manifestation to Item conceptual spine explicit', () => {
    const spineEdges = schemaExplorerModel.edges.filter((edge) => edge.kind === 'spine');

    expect(spineEdges).toEqual(expect.arrayContaining([
      expect.objectContaining({
        source: 'WorkVariant',
        target: 'Manifestation',
        slot: 'is_manifestation_of',
        required: true,
      }),
      expect.objectContaining({
        source: 'Manifestation',
        target: 'Item',
        slot: 'has_item / is_item_of',
        required: true,
      }),
    ]));
  });

  test('represents item copy and derivation relationships as schema relationships', () => {
    const itemEdges = getEdgesForClass('Item');

    expect(itemEdges).toEqual(expect.arrayContaining([
      expect.objectContaining({ slot: 'is_copy_of', source: 'Item', target: 'Item' }),
      expect.objectContaining({ slot: 'is_derivative_of', source: 'Item', target: 'Item' }),
    ]));
  });

  test('captures required slots and slot cardinality from the schema summary', () => {
    const manifestation = getSchemaClassById('Manifestation');
    const item = getSchemaClassById('Item');

    expect(getRequiredSlots(manifestation).map((slot) => slot.name)).toContain('is_manifestation_of');
    expect(getRequiredSlots(item).map((slot) => slot.name)).toContain('is_item_of');
    expect(item.slots.find((slot) => slot.name === 'is_copy_of')?.multivalued).toBe(true);
  });

  test('searches classes by slots, ranges, notes, and authority resource names', () => {
    expect(searchSchemaClasses('has_agent').map((schemaClass) => schemaClass.id)).toContain('Activity');
    expect(searchSchemaClasses('GND').map((schemaClass) => schemaClass.id)).toEqual(expect.arrayContaining([
      'Agent',
      'Genre',
      'Subject',
      'AuthorityResource',
    ]));
    expect(searchSchemaClasses('is_derivative_of').map((schemaClass) => schemaClass.id)).toEqual(['Item']);
  });

  test('formats any_of ranges without hiding the declared base range', () => {
    const subject = getSchemaClassById('Subject');
    const sameAs = subject.slots.find((slot) => slot.name === 'same_as');

    expect(sameAs).toBeTruthy();
    expect(formatSlotRange(sameAs!)).toContain('AuthorityResource');
    expect(formatSlotRange(sameAs!)).toContain('GNDResource');
  });

  test('reports model stats used by the explorer overview', () => {
    expect(getSchemaStats()).toMatchObject({
      classes: 16,
      relationships: schemaExplorerModel.edges.length,
      vocabularyGroups: 4,
    });
    expect(getSchemaStats().requiredSlots).toBeGreaterThan(6);
  });
});
