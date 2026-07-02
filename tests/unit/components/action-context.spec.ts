// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';
import ActionContextComp from '~/components/global/ActionContextComp.vue';

const item = {
  handle: '21.11155/ABC',
  has_record: {
    category: 'avefi:WorkVariant',
    has_primary_title: {
      has_name: 'Action Menu Film',
    },
  },
};

describe('GlobalActionContextComp', () => {
  test('renders comparison and favourites actions eagerly in the detail menu', () => {
    const wrapper = mount(ActionContextComp, {
      props: {
        item,
        id: '21.11155/DETAIL',
        compSize: 'xl',
      },
      global: {
        stubs: {
          Icon: { template: '<span />' },
          AddToFavouritesComp: {
            props: ['filmId', 'filmTitle'],
            template:
              '<button data-testid="favourites-action" :data-film-id="filmId" :data-film-title="filmTitle"><slot /></button>',
          },
          AddToComparisonComp: {
            props: ['filmId', 'filmTitle'],
            template:
              '<button data-testid="comparison-action" :data-film-id="filmId" :data-film-title="filmTitle"><slot /></button>',
          },
          GlobalExportDataComp: {
            template: '<button data-testid="export-action" />',
          },
        },
        mocks: {
          $t: (key: string) => key,
        },
      },
    });

    const favouritesAction = wrapper.get('[data-testid="favourites-action"]');
    const comparisonAction = wrapper.get('[data-testid="comparison-action"]');

    expect(favouritesAction.attributes('data-film-id')).toBe('21.11155/DETAIL');
    expect(favouritesAction.attributes('data-film-title')).toBe('Action Menu Film');
    expect(favouritesAction.classes()).toEqual(expect.arrayContaining(['w-48', 'btn-block', 'btn-sm', 'action-btn']));

    expect(comparisonAction.attributes('data-film-id')).toBe('21.11155/DETAIL');
    expect(comparisonAction.attributes('data-film-title')).toBe('Action Menu Film');
    expect(comparisonAction.classes()).toEqual(expect.arrayContaining(['w-48', 'btn-block', 'btn-sm', 'action-btn']));

    expect(wrapper.find('[data-testid="export-action"]').exists()).toBe(true);
  });
});
