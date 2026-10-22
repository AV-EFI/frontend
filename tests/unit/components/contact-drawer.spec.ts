// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';
import ContactDrawer from '~/components/global/ContactDrawer.vue';

function mountComponent() {
  return mount(ContactDrawer, {
    global: {
      stubs: {
        MicroContactForm: {
          props: ['initialMessage'],
          template:
            '<div data-testid="contact-form">{{ initialMessage }}</div>',
        },
      },
      mocks: {
        $t: (key: string) => key,
      },
    },
  });
}

describe('ContactDrawer interaction contracts', () => {
  test('opens via open-contact-drawer event and forwards initial message', async () => {
    const wrapper = mountComponent();

    window.dispatchEvent(
      new CustomEvent('open-contact-drawer', {
        detail: { initialMessage: 'hello from test' },
      })
    );
    await wrapper.vm.$nextTick();

    const toggle = wrapper.get('#global-contact-drawer').element as HTMLInputElement;
    expect(toggle.checked).toBe(true);
    expect(document.body.style.overflow).toBe('hidden');
    expect(wrapper.get('[data-testid="contact-form"]').text()).toContain('hello from test');
  });

  test('closes on Escape key and restores body scrolling', async () => {
    const wrapper = mountComponent();

    window.dispatchEvent(new CustomEvent('open-contact-drawer'));
    await wrapper.vm.$nextTick();
    expect((wrapper.get('#global-contact-drawer').element as HTMLInputElement).checked).toBe(true);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await wrapper.vm.$nextTick();

    expect((wrapper.get('#global-contact-drawer').element as HTMLInputElement).checked).toBe(false);
    expect(document.body.style.overflow).toBe('');
  });

  test('focuses the email input when the drawer opens', async () => {
    const wrapper = mount(ContactDrawer, {
      attachTo: document.body,
      global: {
        stubs: {
          MicroContactForm: { template: '<form><input id="email" type="email"></form>' },
        },
        mocks: { $t: (key: string) => key },
      },
    });

    window.dispatchEvent(new CustomEvent('open-contact-drawer'));
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(document.activeElement?.id).toBe('email');
    wrapper.unmount();
  });

  test('announces that its listeners are ready once mounted', () => {
    let mountedEvents = 0;
    const onMounted = () => { mountedEvents += 1; };
    window.addEventListener('contact-drawer-mounted', onMounted);

    const wrapper = mountComponent();

    window.removeEventListener('contact-drawer-mounted', onMounted);
    expect(mountedEvents).toBe(1);
    wrapper.unmount();
  });

  test('supports legacy open-contact-form event', async () => {
    const wrapper = mountComponent();

    window.dispatchEvent(new Event('open-contact-form'));
    await wrapper.vm.$nextTick();

    expect((wrapper.get('#global-contact-drawer').element as HTMLInputElement).checked).toBe(true);
  });
});
