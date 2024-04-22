// stores/counter.spec.ts

import { describe, it, beforeEach, expect } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useCounterStore } from './counter';

describe('Counter Store', () => {
    beforeEach(() => {
        // creates a fresh pinia and makes it active
        // so it's automatically picked up by any useStore() call
        // without having to pass it to it: `useStore(pinia)`
        setActivePinia(createPinia());
    });

    it('increments', () => {
        const counter = useCounterStore();
        expect(counter.count).toBe(0);
        counter.incCount();
        expect(counter.count).toBe(1);
    });

    it('decrements', () => {
        const counter = useCounterStore();
        expect(counter.count).toBe(0);
        counter.decCount();
        expect(counter.count).toBe(-1);
    });
});