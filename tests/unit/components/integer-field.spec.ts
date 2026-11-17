// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import IntegerField from '~/components/input/IntegerField.vue';

// These cases pin the behaviour of the FormKit `type="number" number="integer"` input this field replaced.

function mountField(modelValue: number | undefined = 1896) {
  const wrapper = mount(IntegerField, {
    props: {
      modelValue,
      'onUpdate:modelValue': (value: number | undefined) => wrapper.setProps({ modelValue: value }),
      min: 1896,
      max: 2025,
      placeholder: '1896',
      'aria-label': 'Minimales Produktionsjahr',
    },
  });
  return wrapper;
}

async function typeValue(wrapper: ReturnType<typeof mountField>, value: string) {
  const input = wrapper.find('input');
  (input.element as HTMLInputElement).value = value;
  await input.trigger('input');
}

const emitted = (wrapper: ReturnType<typeof mountField>) =>
  (wrapper.emitted('update:modelValue') ?? []).map(([value]) => value);

describe('IntegerField', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  test('renders a native number input with the passed attributes and the model value', () => {
    const input = mountField().find('input');

    expect(input.attributes()).toMatchObject({
      type: 'number',
      min: '1896',
      max: '2025',
      placeholder: '1896',
      'aria-label': 'Minimales Produktionsjahr',
    });
    expect((input.element as HTMLInputElement).value).toBe('1896');
  });

  test('updates the model 20 ms after the last keystroke with the parsed integer', async () => {
    const wrapper = mountField();

    await typeValue(wrapper, '195');
    await typeValue(wrapper, '1950');
    vi.advanceTimersByTime(19);
    expect(emitted(wrapper)).toEqual([]);

    vi.advanceTimersByTime(1);
    expect(emitted(wrapper)).toEqual([1950]);
  });

  test('turns an empty entry into undefined', async () => {
    const wrapper = mountField();

    await typeValue(wrapper, '');
    vi.advanceTimersByTime(20);

    expect(emitted(wrapper)).toEqual([undefined]);
  });

  test('truncates decimals and shows the parsed value in the field', async () => {
    const wrapper = mountField();

    await typeValue(wrapper, '1950.7');
    vi.advanceTimersByTime(20);

    expect(emitted(wrapper)).toEqual([1950]);
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('1950');
  });

  test('emits the committed value at once when the parsed entry does not change it', async () => {
    const wrapper = mountField(1950);

    await typeValue(wrapper, '1950.0');

    expect(emitted(wrapper)).toEqual([1950]);
  });

  test('shows a value set from outside, but ignores the value it emitted itself', async () => {
    const wrapper = mountField();
    const input = wrapper.find('input').element as HTMLInputElement;

    await wrapper.setProps({ modelValue: 1960 });
    expect(input.value).toBe('1960');

    await typeValue(wrapper, '1970');
    vi.advanceTimersByTime(20);
    vi.advanceTimersByTime(20);

    // Like FormKit, an outside value is emitted back once (1960). The parent's echo of 1970 must not
    // count as an outside change, so 1970 is emitted only once.
    expect(emitted(wrapper)).toEqual([1960, 1970]);
    expect(input.value).toBe('1970');
  });
});
