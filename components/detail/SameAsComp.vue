<template>
    <div v-if="normalizedSameAsData.length" class="inline-block">
        <!-- Trigger -->
        <button
            ref="triggerRef"
            type="button"
            class="btn btn-circle btn-outline btn-xs"
            aria-haspopup="true"
            :aria-expanded="String(open)"
            aria-controls="sameas-dropdown-menu"
            @click.stop="toggle()"
            @keydown="onTriggerKeydown"
        >
            <Icon :class="['text-' + fontSize]" name="tabler:dots" />
            <span class="sr-only"> {{$t('openExternalReferences')}}</span>
        </button>

        <ClientOnly>
            <Teleport to="body">
                <!-- Menu (fixed, viewport-positioned) -->
                <ul
                    v-show="open"
                    id="sameas-dropdown-menu"
                    ref="menuRef"
                    role="menu"
                    tabindex="-1"
                    class="menu menu-sm bg-base-100 rounded-box shadow fixed z-1000 w-56 p-2 dark:border-1 dark:border-gray-800"
                    :style="{ top: `${pos.top}px`, left: `${pos.left}px` }"
                    @keydown="onMenuKeydown"
                >
                    <li v-for="item in normalizedSameAsData" :key="`${item.category}-${item.id}`" role="none" class="flex flex-row items-center gap-1">
                        <a
                            role="menuitem"
                            tabindex="0"
                            :href="getNormdataUrl(item.category, item.id)"
                            target="_blank" rel="noopener"
                            class="link link-primary link-hover flex min-w-0 flex-1 items-center"
                            @click="close()"
                        >
                            <span>{{ getSameAsLabel(item) }}</span><Icon name="tabler:external-link"/>
                        </a>

                        <button
                            type="button"
                            class="btn btn-ghost btn-xs shrink-0"
                            :aria-label="$t('copyToClipboard')"
                            :title="$t('copyToClipboard')"
                            @click.stop="copySameAsUrl(item)"
                        >
                            <Icon name="tabler:copy" size="1em" aria-hidden="true" />
                        </button>
                    </li>
                </ul>
            </Teleport>
        </ClientOnly>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useClipboardUtil } from '~/utils/clipboard';

const props = defineProps({
    sameAsData: { type: Array as () => Array<any>, default: () => [] },
    fontSize: { type: String, default: 'xs' },
    type: { type: String, default: 'film' },
});

const { getNormdataUrl } = useNormdataUrl();
const clipboard = useClipboardUtil();
const { t, te } = useI18n();

const normalizedSameAsData = computed(() => {
    const items = Array.isArray(props.sameAsData) ? props.sameAsData : [];
    const seen = new Set<string>();

    return items.filter((item) => {
        if (!item?.category || !item?.id) return false;

        const key = `${item.category}-${item.id}`;
        if (seen.has(key)) return false;

        seen.add(key);
        return true;
    });
});

const open = ref(false);
const triggerRef = ref<HTMLElement | null>(null);
const menuRef = ref<HTMLElement | null>(null);
const pos = ref({ top: 0, left: 0 });

function computePosition() {
    const btn = triggerRef.value;
    const menu = menuRef.value;
    if (!btn || !menu) return;

    const r = btn.getBoundingClientRect();

    // Make sure we can measure the menu
    const prevDisplay = menu.style.display;
    if (getComputedStyle(menu).display === 'none') menu.style.display = 'block';

    const menuW = menu.offsetWidth || 224; // ~w-56 fallback
    const menuH = menu.offsetHeight || 0;
    const pad = 8;      // viewport padding
    const gapY = 6;     // vertical gap below/above button
    const gapX = 6;     // horizontal gap to the side

    // Default: place to the RIGHT of the button
    let top = r.bottom + gapY;
    let left = r.right + gapX;

    // If it overflows to the right, flip to LEFT of the button
    if (left + menuW > window.innerWidth - pad) {
        left = r.left - gapX - menuW;
    }

    // Clamp horizontally inside viewport
    left = Math.max(pad, Math.min(left, window.innerWidth - menuW - pad));

    // If it overflows bottom, flip ABOVE the button (still side-positioned)
    if (top + menuH > window.innerHeight - pad && r.top - gapY - menuH >= pad) {
        top = r.top - gapY - menuH;
    }

    pos.value = { top, left };

    // Restore prior display state
    menu.style.display = prevDisplay;
}

async function toggle() {
    open.value = !open.value;
    if (open.value) {
        await nextTick();
        computePosition();
        // focus first item
        const first = menuRef.value?.querySelector('[role="menuitem"]') as HTMLElement | null;
        first?.focus();
    }
}

function close() {
    if (!open.value) return;
    open.value = false;
    nextTick(() => triggerRef.value?.focus());
}

function copySameAsUrl(item: any) {
    clipboard?.copyExtended(getNormdataUrl(item.category, item.id));
}

function getSameAsLabel(item: any): string {
    const category = String(item?.category || '');
    return category && te(category) ? t(category) : category;
}

function onTriggerKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
    } else if (e.key === 'Escape') {
        e.preventDefault();
        close();
    }
}

function onMenuKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
        e.preventDefault();
        close();
    }
}

function onDocumentClick(e: MouseEvent) {
    const t = e.target as Node;
    if (!triggerRef.value?.contains(t) && !menuRef.value?.contains(t)) {
        close();
    }
}

function onResizeOrScroll() {
    if (open.value) computePosition();
}

onMounted(() => {
    document.addEventListener('click', onDocumentClick, { capture: true });
    window.addEventListener('resize', onResizeOrScroll, { passive: true });
    window.addEventListener('scroll', onResizeOrScroll, { passive: true });
});

onBeforeUnmount(() => {
    document.removeEventListener('click', onDocumentClick, { capture: true } as any);
    window.removeEventListener('resize', onResizeOrScroll as any);
    window.removeEventListener('scroll', onResizeOrScroll as any);
});
</script>
