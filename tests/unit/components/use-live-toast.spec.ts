// @vitest-environment happy-dom
import { nextTick, ref } from 'vue';
import { beforeEach, describe, expect, test, vi } from 'vitest';

// ---------------------------------------------------------------------------
// Minimal Nuxt shims
// ---------------------------------------------------------------------------

// useState: return a simple ref backed by a module-level map so that all
// useLiveToast() call-sites within a test share the same reactive state.
const stateStore = new Map<string, ReturnType<typeof ref>>();
vi.stubGlobal('useState', (key: string, init: () => unknown) => {
    if (!stateStore.has(key)) stateStore.set(key, ref(init()));
    return stateStore.get(key)!;
});

vi.stubGlobal('nextTick', nextTick);

// ---------------------------------------------------------------------------
// Import under test (after stubs are in place)
// ---------------------------------------------------------------------------
const { useLiveToast } = await import('~/composables/useLiveToast');

// Make useLiveToast available as a global so useUndoToast can call it the
// same way Nuxt auto-imports would.
vi.stubGlobal('useLiveToast', useLiveToast);

// ---------------------------------------------------------------------------
// useUndoToast shims and import
// ---------------------------------------------------------------------------
const mockToast = vi.fn(() => 42 /* fake toast id */);
mockToast.remove = vi.fn();
vi.stubGlobal('useNuxtApp', () => ({ $toast: mockToast }));
vi.stubGlobal('useI18n', () => ({ t: (k: string) => k }));

// useLiveToast is already imported above; useUndoToast uses it internally.
const { useUndoToast } = await import('~/composables/useUndoToast');

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('useLiveToast', () => {
    beforeEach(() => {
        stateStore.clear();
    });

    test('liveMessage starts as empty string', () => {
        const { liveMessage } = useLiveToast();
        expect(liveMessage.value).toBe('');
    });

    test('announce() sets liveMessage after nextTick', async () => {
        const { liveMessage, announce } = useLiveToast();
        announce('Item removed');
        // Immediately after announce() the message is first reset to ''.
        expect(liveMessage.value).toBe('');
        await nextTick();
        expect(liveMessage.value).toBe('Item removed');
    });

    test('announce() twice re-announces the same string', async () => {
        const { liveMessage, announce } = useLiveToast();
        announce('done');
        await nextTick();
        expect(liveMessage.value).toBe('done');

        // Second identical call resets and re-sets.
        announce('done');
        expect(liveMessage.value).toBe('');
        await nextTick();
        expect(liveMessage.value).toBe('done');
    });

    test('multiple call-sites share the same state via useState key', async () => {
        const a = useLiveToast();
        const b = useLiveToast();
        a.announce('shared');
        await nextTick();
        expect(b.liveMessage.value).toBe('shared');
    });
});

describe('useUndoToast', () => {
    beforeEach(() => {
        stateStore.clear();
        mockToast.mockClear();
        mockToast.remove.mockClear();
    });

    test('show() calls $toast with the message', async () => {
        const { show } = useUndoToast();
        show('Item added', vi.fn());
        // $toast is called with a render function and options.
        expect(mockToast).toHaveBeenCalledOnce();
        const [renderFn, opts] = mockToast.mock.calls[0];
        expect(typeof renderFn).toBe('function');
        expect(opts).toMatchObject({ type: 'info', closeOnClick: false });
    });

    test('show() announces the message to the live region', async () => {
        const { liveMessage } = useLiveToast();
        const { show } = useUndoToast();
        show('Test announce', vi.fn());
        await nextTick();
        expect(liveMessage.value).toBe('Test announce');
    });

    test('dismiss() calls $toast.remove with the toast id', () => {
        const { show } = useUndoToast();
        const { dismiss } = show('Removable', vi.fn());
        dismiss();
        expect(mockToast.remove).toHaveBeenCalledWith(42);
    });

    test('onUndo callback fires and removes the toast', async () => {
        const onUndo = vi.fn();
        const { show } = useUndoToast();
        show('Undo me', onUndo);

        // Extract the render function and call the undo button's onClick.
        const renderFn = mockToast.mock.calls[0][0] as () => ReturnType<typeof import('vue').h>;
        const vnode = renderFn();
        const undoButton = (vnode as any).children?.[1];
        expect(undoButton).toBeDefined();
        undoButton.props.onClick(new MouseEvent('click'));

        expect(onUndo).toHaveBeenCalledOnce();
        expect(mockToast.remove).toHaveBeenCalledWith(42);
    });

    test('onUndo callback fires at most once even if clicked twice', async () => {
        const onUndo = vi.fn();
        const { show } = useUndoToast();
        show('Double click', onUndo);

        const renderFn = mockToast.mock.calls[0][0] as () => ReturnType<typeof import('vue').h>;
        const onClick = (renderFn() as any).children?.[1]?.props?.onClick;
        onClick(new MouseEvent('click'));
        onClick(new MouseEvent('click'));

        expect(onUndo).toHaveBeenCalledOnce();
    });
});


// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('useLiveToast', () => {
    beforeEach(() => {
        stateStore.clear();
    });

    test('liveMessage starts as empty string', () => {
        const { liveMessage } = useLiveToast();
        expect(liveMessage.value).toBe('');
    });

    test('announce() sets liveMessage after nextTick', async () => {
        const { liveMessage, announce } = useLiveToast();
        announce('Item removed');
        // Immediately after announce() the message is first reset to ''.
        expect(liveMessage.value).toBe('');
        await nextTick();
        expect(liveMessage.value).toBe('Item removed');
    });

    test('announce() twice re-announces the same string', async () => {
        const { liveMessage, announce } = useLiveToast();
        announce('done');
        await nextTick();
        expect(liveMessage.value).toBe('done');

        // Second identical call resets and re-sets.
        announce('done');
        expect(liveMessage.value).toBe('');
        await nextTick();
        expect(liveMessage.value).toBe('done');
    });

    test('multiple call-sites share the same state via useState key', async () => {
        const a = useLiveToast();
        const b = useLiveToast();
        a.announce('shared');
        await nextTick();
        expect(b.liveMessage.value).toBe('shared');
    });
});

describe('useUndoToast', () => {
    beforeEach(() => {
        stateStore.clear();
        mockToast.mockClear();
        mockToast.remove.mockClear();
    });

    test('show() calls $toast with the message', async () => {
        const { show } = useUndoToast();
        show('Item added', vi.fn());
        // $toast is called with a render function and options.
        expect(mockToast).toHaveBeenCalledOnce();
        const [renderFn, opts] = mockToast.mock.calls[0];
        expect(typeof renderFn).toBe('function');
        expect(opts).toMatchObject({ type: 'info', closeOnClick: false });
    });

    test('show() announces the message to the live region', async () => {
        const { liveMessage } = useLiveToast();
        const { show } = useUndoToast();
        show('Test announce', vi.fn());
        await nextTick();
        expect(liveMessage.value).toBe('Test announce');
    });

    test('dismiss() calls $toast.remove with the toast id', () => {
        const { show } = useUndoToast();
        const { dismiss } = show('Removable', vi.fn());
        dismiss();
        expect(mockToast.remove).toHaveBeenCalledWith(42);
    });

    test('onUndo callback fires and removes the toast', async () => {
        const onUndo = vi.fn();
        const { show } = useUndoToast();
        show('Undo me', onUndo);

        // Extract the render function and call the undo button's onClick.
        const renderFn = mockToast.mock.calls[0][0] as () => ReturnType<typeof import('vue').h>;
        const vnode = renderFn();
        const undoButton = (vnode as any).children?.[1];
        expect(undoButton).toBeDefined();
        undoButton.props.onClick(new MouseEvent('click'));

        expect(onUndo).toHaveBeenCalledOnce();
        expect(mockToast.remove).toHaveBeenCalledWith(42);
    });

    test('onUndo callback fires at most once even if clicked twice', async () => {
        const onUndo = vi.fn();
        const { show } = useUndoToast();
        show('Double click', onUndo);

        const renderFn = mockToast.mock.calls[0][0] as () => ReturnType<typeof import('vue').h>;
        const onClick = (renderFn() as any).children?.[1]?.props?.onClick;
        onClick(new MouseEvent('click'));
        onClick(new MouseEvent('click'));

        expect(onUndo).toHaveBeenCalledOnce();
    });
});
