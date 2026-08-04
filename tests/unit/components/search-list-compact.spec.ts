// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, test, vi } from 'vitest';
import SearchListCompactComp from '~/components/search/SearchListCompactComp.vue';
import type { SearchWorkHit } from '~/models/interfaces/manual/ISearchWorkHit';

vi.hoisted(() => {
  (globalThis as Record<string, unknown>).useRuntimeConfig = () => ({
    public: {
      AVEFI_COPY_PID_URL: 'https://hdl.handle.net/',
    },
  });

  (globalThis as Record<string, unknown>).useI18n = () => ({
    t: (key: string) => key,
  });
});

vi.mock('~/models/interfaces/manual/IFacetIconMapping', () => ({
  getFacetIcon: () => 'tabler:test-icon',
}));

// Fixtures below only populate the fields SearchListCompactComp actually
// reads; they intentionally don't satisfy every required field of the full
// generated AVefi schema (e.g. WorkVariant.category/type), so they're built
// as plain objects and cast to the real search-hit type via `unknown`.
type CurrentRefinement = { label?: string; refinements?: Array<{ value: string }> };

function mountComponent(datasets: SearchWorkHit[], currentRefinements: CurrentRefinement[] = []) {
  return mount(SearchListCompactComp, {
    props: {
      datasets,
      currentRefinements,
    },
    global: {
      stubs: {
        NuxtLink: { template: '<a><slot /></a>' },
        Icon: {
          props: ['name'],
          template: '<i :data-icon="name"><slot /></i>',
        },
        GlobalClipboardComp: {
          props: ['displayText'],
          template: '<span class="clipboard-stub">{{ displayText }}</span>',
        },
        MicroBadgeCategoryComp: { template: '<span class="category-stub" />' },
      },
      mocks: {
        useRuntimeConfig: () => ({
          public: {
            AVEFI_COPY_PID_URL: 'https://hdl.handle.net/',
          },
        }),
      },
    },
  });
}

describe('SearchListCompactComp', () => {
  test('renders place info from located_in.has_name arrays and strings', () => {
    const datasets = [
      {
        handle: '21.11155/work-1',
        has_record: {
          has_primary_title: { has_name: 'Work One' },
          has_event: [
            {
              located_in: [
                { has_name: ['Berlin', 'Hamburg'] },
                { has_name: 'Munich' },
              ],
            },
          ],
        },
      },
    ] as unknown as SearchWorkHit[];

    const wrapper = mountComponent(datasets);
    const text = wrapper.text();

    expect(text).toContain('Berlin');
    expect(text).toContain('Hamburg');
    expect(text).toContain('Munich');
  });

  test('highlights matching item-info badge when facet is active in currentRefinements', () => {
    const datasets = [
      {
        handle: '21.11155/work-2',
        has_record: {
          has_primary_title: { has_name: 'Work Two' },
        },
        manifestations: [
          {
            items: [
              {
                has_record: {
                  has_format: [{ type: '16mm' }],
                  has_access_status: 'public',
                },
              },
            ],
          },
        ],
      },
    ] as unknown as SearchWorkHit[];

    const wrapper = mountComponent(datasets, [{ label: 'has_format_type', refinements: [{ value: '16mm' }] }]);

    const formatBadge = wrapper.find('[aria-label="tooltip.format"]');
    const accessBadge = wrapper.find('[aria-label="tooltip.accessStatus"]');

    expect(formatBadge.exists()).toBe(true);
    expect(accessBadge.exists()).toBe(true);
    expect(formatBadge.classes()).toContain('bg-primary/15');
    expect(accessBadge.classes()).not.toContain('bg-primary/15');
  });

  test('shows allItemsEmpty badge when items exist but contain no additional metadata', () => {
    const datasets = [
      {
        handle: '21.11155/work-3',
        has_record: {
          has_primary_title: { has_name: 'Work Three' },
        },
        manifestations: [
          {
            items: [
              {
                has_record: {},
              },
            ],
          },
        ],
      },
    ] as unknown as SearchWorkHit[];

    const wrapper = mountComponent(datasets);
    expect(wrapper.text()).toContain('allItemsEmpty');
  });
});
