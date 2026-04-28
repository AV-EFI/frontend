// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, test, vi } from 'vitest';
import SendValueComp from '~/components/global/SendValueComp.vue';

vi.stubGlobal('useNuxtApp', () => ({ $toast: { info: vi.fn(), error: vi.fn() } }));

function mountComp(props = {}) {
    return mount(SendValueComp, {
        props: {
            targetPropertyValue: 'test-value',
            targetPropertyName: 'title',
            ...props,
        },
        global: {
            mocks: { $t: (k: string, _p?: unknown) => k },
            stubs: { Icon: true },
        },
    });
}

describe('SendValueComp', () => {
    test('renders a button', () => {
        const wrapper = mountComp();
        expect(wrapper.find('button').exists()).toBe(true);
    });

    test('does not use tabler:arrow-right icon', () => {
        const wrapper = mountComp();
        // The Icon stub renders as <icon-stub> - check src or name prop is not arrow-right
        const icon = wrapper.findComponent({ name: 'Icon' });
        // If stubs render as stub elements, check the name attribute
        const iconStub = wrapper.find('icon-stub');
        if (iconStub.exists()) {
            expect(iconStub.attributes('name')).not.toBe('tabler:arrow-right');
        }
    });

    test('uses tabler:transfer icon', () => {
        // Mount without stubbing Icon to capture the prop value
        const wrapper = mount(SendValueComp, {
            props: { targetPropertyValue: 'v', targetPropertyName: 'p' },
            global: {
                mocks: { $t: (k: string) => k },
                stubs: { Icon: { template: '<i :data-name="name" />', props: ['name'] } },
            },
        });
        const icon = wrapper.find('i[data-name]');
        expect(icon.attributes('data-name')).toBe('tabler:transfer');
    });
});
