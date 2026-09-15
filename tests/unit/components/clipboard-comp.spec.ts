// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, test } from 'vitest';
import { vi } from 'vitest';
import ClipboardComp from '~/components/global/ClipboardComp.vue';

vi.stubGlobal('useNormdataUrl', () => ({
  getNormdataUrl: (category: string, id: string) => `https://example.test/${category}/${id}`,
}));

const copyExtended = vi.fn();
vi.mock('~/utils/clipboard', () => ({
  useClipboardUtil: () => ({
    copyExtended,
  }),
}));

const translations: Record<string, string> = {
  copyToClipboard: 'Copy to clipboard',
  efiIdentifierLabel: 'EFI identifier',
};
const t = (key: string) => translations[key] ?? key;

function mountClipboard(props: Record<string, unknown>) {
  return mount(ClipboardComp, {
    props,
    global: {
      stubs: {
        Icon: { template: '<span />' },
      },
      mocks: {
        $t: t,
      },
    },
  });
}

afterEach(() => {
  copyExtended.mockClear();
});

describe('ClipboardComp long-identifier disclosure', () => {
  test('renders the value immediately and has no reveal toggle when not collapsible', () => {
    const wrapper = mountClipboard({ displayText: '21.11155/ABCD-1234' });

    expect(wrapper.text()).toContain('21.11155/ABCD-1234');
    expect(wrapper.find('button[aria-expanded]').exists()).toBe(false);
    expect(wrapper.findAll('button')).toHaveLength(1);
  });

  test('always shows the value visually, even when collapsible', () => {
    const wrapper = mountClipboard({ displayText: '21.11155/ABCD-1234', collapsible: true });

    expect(wrapper.text()).toContain('21.11155/ABCD-1234');
    expect(wrapper.find('button[aria-expanded]').exists()).toBe(false);
  });

  test('hides the raw identifier from the accessibility tree behind a short sr-only label', () => {
    const wrapper = mountClipboard({ displayText: '21.11155/ABCD-1234', collapsible: true });

    const srLabel = wrapper.find('.sr-only');
    expect(srLabel.exists()).toBe(true);
    expect(srLabel.text()).toBe('EFI identifier');

    const valueSpan = wrapper.findAll('span').find((span) => span.text() === '21.11155/ABCD-1234');
    expect(valueSpan?.attributes('aria-hidden')).toBe('true');
  });

  test('does not add the sr-only label or aria-hidden when not collapsible', () => {
    const wrapper = mountClipboard({ displayText: '21.11155/ABCD-1234' });

    expect(wrapper.find('.sr-only').exists()).toBe(false);
    const valueSpan = wrapper.findAll('span').find((span) => span.text() === '21.11155/ABCD-1234');
    expect(valueSpan?.attributes('aria-hidden')).toBeUndefined();
  });

  test('always includes the identifier in the copy button label', () => {
    const wrapper = mountClipboard({ displayText: '21.11155/ABCD-1234', collapsible: true });

    const copyButton = wrapper.get('button');
    expect(copyButton.attributes('aria-label')).toBe('Copy to clipboard: 21.11155/ABCD-1234');
  });

  test('copying works for a collapsible identifier', async () => {
    const wrapper = mountClipboard({
      displayText: '21.11155/ABCD-1234',
      copyText: 'https://example.test/pid/21.11155/ABCD-1234',
      collapsible: true,
    });

    const copyButton = wrapper.get('button');
    await copyButton.trigger('click');

    expect(copyExtended).toHaveBeenCalledWith('https://example.test/pid/21.11155/ABCD-1234');
  });
});
