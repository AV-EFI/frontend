// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, test, vi } from 'vitest';
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
  showIdentifier: 'Show identifier',
  hideIdentifier: 'Hide identifier',
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
  test('renders the value immediately and shows no toggle when not collapsible', () => {
    const wrapper = mountClipboard({ displayText: '21.11155/ABCD-1234' });

    expect(wrapper.text()).toContain('21.11155/ABCD-1234');
    expect(wrapper.find('button[aria-expanded]').exists()).toBe(false);
  });

  test('hides a collapsible identifier from the accessible text until revealed', () => {
    const wrapper = mountClipboard({ displayText: '21.11155/ABCD-1234', collapsible: true });

    expect(wrapper.text()).not.toContain('21.11155/ABCD-1234');

    const toggle = wrapper.get('button[aria-expanded]');
    expect(toggle.attributes('aria-expanded')).toBe('false');
    expect(toggle.text()).toBe('Show identifier');
  });

  test('reveals and re-hides the identifier when the toggle is activated', async () => {
    const wrapper = mountClipboard({ displayText: '21.11155/ABCD-1234', collapsible: true });
    const toggle = wrapper.get('button[aria-expanded]');

    await toggle.trigger('click');
    expect(toggle.attributes('aria-expanded')).toBe('true');
    expect(toggle.text()).toBe('Hide identifier');
    expect(wrapper.text()).toContain('21.11155/ABCD-1234');

    await toggle.trigger('click');
    expect(toggle.attributes('aria-expanded')).toBe('false');
    expect(wrapper.text()).not.toContain('21.11155/ABCD-1234');
  });

  test('does not leak the raw identifier through the copy button label while collapsed', () => {
    const wrapper = mountClipboard({ displayText: '21.11155/ABCD-1234', collapsible: true });
    const buttons = wrapper.findAll('button');
    const copyButton = buttons[buttons.length - 1]!;

    expect(copyButton.attributes('aria-label')).toBe('Copy to clipboard');
    expect(copyButton.attributes('aria-label')).not.toContain('21.11155/ABCD-1234');
  });

  test('includes the identifier in the copy button label once revealed', async () => {
    const wrapper = mountClipboard({ displayText: '21.11155/ABCD-1234', collapsible: true });
    await wrapper.get('button[aria-expanded]').trigger('click');

    const buttons = wrapper.findAll('button');
    const copyButton = buttons[buttons.length - 1]!;
    expect(copyButton.attributes('aria-label')).toBe('Copy to clipboard: 21.11155/ABCD-1234');
  });

  test('copying works without first revealing the collapsed identifier', async () => {
    const wrapper = mountClipboard({
      displayText: '21.11155/ABCD-1234',
      copyText: 'https://example.test/pid/21.11155/ABCD-1234',
      collapsible: true,
    });

    const buttons = wrapper.findAll('button');
    const copyButton = buttons[buttons.length - 1]!;
    await copyButton.trigger('click');

    expect(copyExtended).toHaveBeenCalledWith('https://example.test/pid/21.11155/ABCD-1234');
  });
});
