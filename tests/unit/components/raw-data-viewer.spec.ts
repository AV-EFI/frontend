// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';
import RawDataViewer from '~/components/global/RawDataViewer.vue';

const record = { handle: '21.11155/EXAMPLE', compound_record: { _source: { category: 'avefi:Subject' } } };

function mountViewer() {
  return mount(RawDataViewer, {
    props: { value: record, title: 'Rohdaten' },
    global: {
      stubs: {
        Icon: { template: '<span />' },
        GlobalJsonTreeViewer: { props: ['value'], template: '<div class="json-tree-stub">{{ JSON.stringify(value) }}</div>' },
      },
    },
  });
}

describe('RawDataViewer', () => {
  test('keeps raw record data out of the initial markup so crawlers do not index it', () => {
    const wrapper = mountViewer();

    expect(wrapper.find('summary').text()).toContain('Rohdaten');
    expect(wrapper.find('.json-tree-stub').exists()).toBe(false);
    expect(wrapper.html()).not.toContain('avefi:Subject');
  });

  test('renders the tree once the disclosure is opened and keeps it after closing', async () => {
    const wrapper = mountViewer();
    const details = wrapper.find('details');

    (details.element as HTMLDetailsElement).open = true;
    await details.trigger('toggle');
    expect(wrapper.find('.json-tree-stub').text()).toContain('avefi:Subject');

    (details.element as HTMLDetailsElement).open = false;
    await details.trigger('toggle');
    expect(wrapper.find('.json-tree-stub').exists()).toBe(true);
  });
});
