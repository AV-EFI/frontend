// @vitest-environment happy-dom
import { setActivePinia, createPinia } from 'pinia';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { useObjectListStore } from '~/stores/compareList';

describe('useObjectListStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.useFakeTimers();
  });

  describe('initial state', () => {
    test('starts with an empty object list', () => {
      const store = useObjectListStore();
      expect(store.objects).toEqual([]);
    });

    test('starts with both drawers closed', () => {
      const store = useObjectListStore();
      expect(store.comparisonDrawerOpen).toBe(false);
      expect(store.facetDrawerOpen).toBe(false);
    });
  });

  describe('addObject', () => {
    test('adds a film and returns "succ"', async () => {
      const store = useObjectListStore();
      const result = await store.addObject({ filmId: 'film-1', filmTitle: 'Film One' });
      expect(result).toBe('succ');
      expect(store.objects).toHaveLength(1);
      expect(store.objects[0]!.filmId).toBe('film-1');
    });

    test('returns "already" when the same filmId is added twice', async () => {
      const store = useObjectListStore();
      await store.addObject({ filmId: 'film-1' });
      const result = await store.addObject({ filmId: 'film-1' });
      expect(result).toBe('already');
      expect(store.objects).toHaveLength(1);
    });

    test('returns "listfull" when 2 items are already in the list', async () => {
      const store = useObjectListStore();
      await store.addObject({ filmId: 'film-1' });
      await store.addObject({ filmId: 'film-2' });
      const result = await store.addObject({ filmId: 'film-3' });
      expect(result).toBe('listfull');
      expect(store.objects).toHaveLength(2);
    });
  });

  describe('removeObject', () => {
    test('removes item at given index', async () => {
      const store = useObjectListStore();
      await store.addObject({ filmId: 'film-1' });
      await store.addObject({ filmId: 'film-2' });
      store.removeObject(0);
      expect(store.objects).toHaveLength(1);
      expect(store.objects[0]!.filmId).toBe('film-2');
    });
  });

  describe('removeAllObjects', () => {
    test('empties the list', async () => {
      const store = useObjectListStore();
      await store.addObject({ filmId: 'film-1' });
      await store.addObject({ filmId: 'film-2' });
      store.removeAllObjects();
      expect(store.objects).toHaveLength(0);
    });
  });

  describe('removeObjectById', () => {
    test('removes the item with matching filmId', async () => {
      const store = useObjectListStore();
      await store.addObject({ filmId: 'film-1' });
      await store.addObject({ filmId: 'film-2' });
      store.removeObjectById('film-1');
      expect(store.objects).toHaveLength(1);
      expect(store.objects[0]!.filmId).toBe('film-2');
    });

    test('does nothing when filmId is not in the list', async () => {
      const store = useObjectListStore();
      await store.addObject({ filmId: 'film-1' });
      store.removeObjectById('film-99');
      expect(store.objects).toHaveLength(1);
    });
  });

  describe('getObjectIds getter', () => {
    test('returns just the filmIds', async () => {
      const store = useObjectListStore();
      await store.addObject({ filmId: 'film-1', filmTitle: 'Film One' });
      await store.addObject({ filmId: 'film-2', filmTitle: 'Film Two' });
      expect(store.getObjectIds).toEqual(['film-1', 'film-2']);
    });

    test('returns empty array when list is empty', () => {
      const store = useObjectListStore();
      expect(store.getObjectIds).toEqual([]);
    });
  });

  describe('toggleFacetDrawerState', () => {
    test('toggles facetDrawerOpen', () => {
      const store = useObjectListStore();
      expect(store.facetDrawerOpen).toBe(false);
      store.toggleFacetDrawerState();
      expect(store.facetDrawerOpen).toBe(true);
      store.toggleFacetDrawerState();
      expect(store.facetDrawerOpen).toBe(false);
    });

    test('does not affect comparisonDrawerOpen', () => {
      const store = useObjectListStore();
      store.toggleFacetDrawerState();
      expect(store.comparisonDrawerOpen).toBe(false);
    });
  });

  describe('toggleComparisonDrawerState', () => {
    test('toggles comparisonDrawerOpen when called with "comparison"', () => {
      const store = useObjectListStore();
      store.toggleComparisonDrawerState('comparison');
      expect(store.comparisonDrawerOpen).toBe(true);
      store.toggleComparisonDrawerState('comparison');
      expect(store.comparisonDrawerOpen).toBe(false);
    });

    test('toggles comparisonDrawerOpen when called with "favourites"', () => {
      const store = useObjectListStore();
      store.toggleComparisonDrawerState('favourites');
      expect(store.comparisonDrawerOpen).toBe(true);
    });

    test('toggles comparisonDrawerOpen when called without a type', () => {
      const store = useObjectListStore();
      store.toggleComparisonDrawerState('');
      expect(store.comparisonDrawerOpen).toBe(true);
    });
  });
});
