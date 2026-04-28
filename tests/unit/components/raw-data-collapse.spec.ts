// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';
import RawDataCollapse from '~/components/global/RawDataCollapse.vue';

function mountComp(apiData = 'test data') {
    return mount(RawDataCollapse, {
        props: { apiData },
        global: {
            mocks: { $t: (k: string) => k },
        },
    });
}

describe('RawDataCollapse accessibility', () => {
    test('checkbox input has id="raw-data-collapse"', () => {
        const wrapper = mountComp();
        const input = wrapper.find('input[type="checkbox"]');
        expect(input.attributes('id')).toBe('raw-data-collapse');
    });

    test('label has for="raw-data-collapse" linking to checkbox', () => {
        const wrapper = mountComp();
        const label = wrapper.find('label');
        expect(label.attributes('for')).toBe('raw-data-collapse');
    });

    test('input has aria-label attribute', () => {
        const wrapper = mountComp();
        const input = wrapper.find('input[type="checkbox"]');
        expect(input.attributes('aria-label')).toBeTruthy();
    });

    test('shows API data in pre element', () => {
        const wrapper = mountComp('{"key":"value"}');
        expect(wrapper.find('pre').text()).toContain('"key"');
    });
});
