import { setActivePinia, createPinia } from 'pinia';
import { beforeEach, describe, expect, test } from 'vitest';
import { useFavourites } from '~/stores/favourites';

describe('useFavourites', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('initial state', () => {
    test('starts with an empty list', () => {
      const store = useFavourites();
      expect(store.objects).toEqual([]);
    });

    test('starts with both drawers closed', () => {
      const store = useFavourites();
      expect(store.comparisonDrawerOpen).toBe(false);
      expect(store.facetDrawerOpen).toBe(false);
    });
  });

  describe('addObject', () => {
    test('adds a film and returns "succ"', async () => {
      const store = useFavourites();
      const result = await store.addObject({ filmId: 'film-1', filmTitle: 'Film One' });
      expect(result).toBe('succ');
      expect(store.objects).toHaveLength(1);
    });

    test('returns "already" for a duplicate filmId', async () => {
      const store = useFavourites();
      await store.addObject({ filmId: 'film-1' });
      const result = await store.addObject({ filmId: 'film-1' });
      expect(result).toBe('already');
      expect(store.objects).toHaveLength(1);
    });

    test('returns "listfull" when 10 items are already stored', async () => {
      const store = useFavourites();
      for (let i = 1; i <= 10; i++) {
        await store.addObject({ filmId: `film-${i}` });
      }
      const result = await store.addObject({ filmId: 'film-11' });
      expect(result).toBe('listfull');
      expect(store.objects).toHaveLength(10);
    });
  });

  describe('hydrateObjects', () => {
    test('converts legacy string[] format to ObjectItem[]', () => {
      const store = useFavourites();
      // Simulate legacy persisted state where objects were stored as string IDs
      // rather than the current ObjectItem[] shape.
      store.objects = ['film-1', 'film-2'] as unknown as typeof store.objects;
      store.hydrateObjects();
      expect(store.objects).toEqual([
        { filmId: 'film-1', filmTitle: '' },
        { filmId: 'film-2', filmTitle: '' },
      ]);
    });

    test('does not modify already-hydrated ObjectItem[] data', async () => {
      const store = useFavourites();
      await store.addObject({ filmId: 'film-1', filmTitle: 'Film One' });
      store.hydrateObjects();
      expect(store.objects[0]).toEqual({ filmId: 'film-1', filmTitle: 'Film One' });
    });

    test('does nothing on an empty list', () => {
      const store = useFavourites();
      store.hydrateObjects();
      expect(store.objects).toEqual([]);
    });
  });

  describe('removeObject', () => {
    test('removes item at given index', async () => {
      const store = useFavourites();
      await store.addObject({ filmId: 'film-1' });
      await store.addObject({ filmId: 'film-2' });
      store.removeObject(0);
      expect(store.objects).toHaveLength(1);
      expect(store.objects[0]?.filmId).toBe('film-2');
    });
  });

  describe('removeAllObjects', () => {
    test('empties the list', async () => {
      const store = useFavourites();
      await store.addObject({ filmId: 'film-1' });
      await store.addObject({ filmId: 'film-2' });
      store.removeAllObjects();
      expect(store.objects).toHaveLength(0);
    });
  });

  describe('removeObjectById', () => {
    test('removes the item with matching filmId', async () => {
      const store = useFavourites();
      await store.addObject({ filmId: 'film-1' });
      await store.addObject({ filmId: 'film-2' });
      store.removeObjectById('film-1');
      expect(store.objects).toHaveLength(1);
      expect(store.objects[0]?.filmId).toBe('film-2');
    });

    test('does nothing when filmId is not in the list', async () => {
      const store = useFavourites();
      await store.addObject({ filmId: 'film-1' });
      store.removeObjectById('film-99');
      expect(store.objects).toHaveLength(1);
    });
  });

  describe('getObjectIds getter', () => {
    test('returns just the filmIds', async () => {
      const store = useFavourites();
      await store.addObject({ filmId: 'film-1', filmTitle: 'Film One' });
      await store.addObject({ filmId: 'film-2', filmTitle: 'Film Two' });
      expect(store.getObjectIds).toEqual(['film-1', 'film-2']);
    });
  });

  describe('toggleFacetDrawerState', () => {
    test('toggles facetDrawerOpen', () => {
      const store = useFavourites();
      store.toggleFacetDrawerState();
      expect(store.facetDrawerOpen).toBe(true);
      store.toggleFacetDrawerState();
      expect(store.facetDrawerOpen).toBe(false);
    });
  });

  describe('toggleComparisonDrawerState', () => {
    test('toggles comparisonDrawerOpen', () => {
      const store = useFavourites();
      store.toggleComparisonDrawerState();
      expect(store.comparisonDrawerOpen).toBe(true);
      store.toggleComparisonDrawerState();
      expect(store.comparisonDrawerOpen).toBe(false);
    });
  });
});
