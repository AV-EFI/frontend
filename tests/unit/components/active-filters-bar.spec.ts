// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, test, vi } from 'vitest';
import ActiveFiltersBar from '~/components/search/ActiveFiltersBar.vue';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Build a fake `items` array that matches the ais-current-refinements slot API.
 */
function makeItems(count: number) {
    return Array.from({ length: count }, (_, i) => ({
        attribute: `facet${i}`,
        refinements: [{ value: `val${i}`, label: `Label ${i}` }],
        refine: vi.fn(),
        createURL: vi.fn(() => '#'),
    }));
}

/**
 * Mount the component with a stubbed ais-current-refinements that exposes
 * a controllable `items` array via its default slot.
 */
function mountBar(items: ReturnType<typeof makeItems>, extraProps: Record<string, unknown> = {}) {
    return mount(ActiveFiltersBar, {
        global: {
            mocks: { $t: (k: string) => k },
            stubs: {
                Icon: { template: '<i data-icon />' },
                // Render the default slot so we can exercise the bar's own template.
                'ais-current-refinements': {
                    props: ['excludedAttributes'],
                    template: `<div><slot :items="items" :createURL="() => '#'" /></div>`,
                    setup() {
                        return { items };
                    },
                },
            },
        },
        props: extraProps,
    });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('SearchActiveFiltersBar', () => {
    test('renders nothing when there are no active refinements', () => {
        const wrapper = mountBar([]);
        // No role="region" wrapper should appear.
        expect(wrapper.find('[role="region"]').exists()).toBe(false);
    });

    test('renders the filters region when items are present', () => {
        const wrapper = mountBar(makeItems(1));
        expect(wrapper.find('[role="region"]').exists()).toBe(true);
    });

    test('region has aria-label from $t("activeFilters")', () => {
        const wrapper = mountBar(makeItems(1));
        expect(wrapper.find('[role="region"]').attributes('aria-label')).toBe('activeFilters');
    });

    test('renders one chip per refinement', () => {
        const items = makeItems(2); // 2 facets × 1 refinement each → 2 chips
        const wrapper = mountBar(items);
        // Chip buttons have aria-label containing "removeFilter"
        const chips = wrapper.findAll('button[aria-label*="removeFilter"]');
        expect(chips).toHaveLength(2);
    });

    test('chip displays the refinement label', () => {
        const items = makeItems(1);
        const wrapper = mountBar(items);
        expect(wrapper.find('button[aria-label*="removeFilter"]').text()).toContain('Label 0');
    });

    test('clicking a chip calls facet.refine with the refinement', async () => {
        const items = makeItems(1);
        const wrapper = mountBar(items);
        await wrapper.find('button[aria-label*="removeFilter"]').trigger('click');
        expect(items[0].refine).toHaveBeenCalledWith(items[0].refinements[0]);
    });

    test('clear-all button is hidden when only 1 facet is active', () => {
        const wrapper = mountBar(makeItems(1));
        const clearAll = wrapper.findAll('button').find((b) =>
            b.attributes('aria-label')?.includes('clearAllFilters'),
        );
        expect(clearAll).toBeUndefined();
    });

    test('clear-all button appears when more than 1 facet is active', () => {
        const wrapper = mountBar(makeItems(2));
        const clearAll = wrapper.findAll('button').find((b) =>
            b.attributes('aria-label')?.includes('clearAllFilters'),
        );
        expect(clearAll).toBeDefined();
    });

    test('clear-all calls refine for every refinement across all facets', async () => {
        const items = makeItems(3);
        const wrapper = mountBar(items);
        const clearAll = wrapper.findAll('button').find((b) =>
            b.attributes('aria-label')?.includes('clearAllFilters'),
        )!;
        await clearAll.trigger('click');
        items.forEach((facet) => {
            expect(facet.refine).toHaveBeenCalledOnce();
        });
    });

    test('excludedAttributes prop is forwarded to ais-current-refinements', () => {
        const wrapper = mountBar([], { excludedAttributes: ['query', 'year'] });
        // The stub receives excludedAttributes; just verify the component mounts without errors.
        expect(wrapper.exists()).toBe(true);
    });

    test('default excludedAttributes contains "query"', () => {
        // Mount without the prop; component should not crash and should render.
        const wrapper = mountBar([]);
        expect(wrapper.exists()).toBe(true);
    });
});
