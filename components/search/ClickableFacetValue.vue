<template>
    <!-- Detail-page mode: single link that opens search in a new tab -->
    <a
        v-if="opensInNewTab && canToggle"
        :href="href"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex max-w-full rounded-sm text-left text-primary underline underline-offset-2 decoration-transparent hover:decoration-current focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
        :class="{ 'font-semibold decoration-current': active }"
        :aria-label="ariaLabel"
        :title="ariaLabel"
    >
        <span class="min-w-0 wrap-break-word"><slot>{{ label }}</slot></span>
    </a>

    <!-- Search-page mode: button + context menu -->
    <span v-else-if="canToggle" ref="triggerRef" class="relative inline-flex">
        <button
            type="button"
            class="inline-flex max-w-full rounded-sm px-0.5 text-left text-primary underline underline-offset-2 decoration-transparent hover:decoration-current focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
            :class="{ 'font-semibold decoration-current': active }"
            :aria-label="ariaLabel"
            :title="ariaLabel"
            :aria-haspopup="'menu'"
            :aria-expanded="String(menuOpen)"
            @click.stop="toggleMenu"
        >
            <span class="min-w-0 wrap-break-word"><slot>{{ label }}</slot></span>
        </button>

        <ClientOnly>
            <Teleport to="body">
                <ul
                    v-if="menuOpen"
                    ref="menuRef"
                    role="menu"
                    class="menu menu-sm bg-base-100 rounded-box shadow-md fixed z-10000 min-w-40 p-1 border border-base-200"
                    :style="{ top: `${menuPos.top}px`, left: `${menuPos.left}px` }"
                    @keydown.esc.stop="closeMenu"
                >
                    <li role="none">
                        <button type="button" role="menuitem" class="gap-2" @click.stop="addToSearch">
                            <Icon name="tabler:filter-plus" size="1em" aria-hidden="true" />
                            {{ $t('facetMenu.addToSearch') }}
                        </button>
                    </li>
                    <li role="none">
                        <button type="button" role="menuitem" class="gap-2" @click.stop="startNewSearch">
                            <Icon name="tabler:search" size="1em" aria-hidden="true" />
                            {{ $t('facetMenu.newSearch') }}
                        </button>
                    </li>
                </ul>
            </Teleport>
        </ClientOnly>
    </span>

    <!-- Non-clickable fallback -->
    <button
        v-else
        type="button"
        class="inline-flex max-w-full rounded-sm text-left disabled:cursor-default disabled:text-base-content"
        disabled
        :aria-label="ariaLabel"
    >
        <span class="min-w-0 wrap-break-word"><slot>{{ label }}</slot></span>
    </button>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { clickableFacetConfig, clickableFacetLabelKey } from '~/config/clickableFacetConfig';

const props = withDefaults(defineProps<{
    attribute?: string
    value?: string | number | null
    label?: string
    openInNewTab?: boolean
}>(), {
    attribute: '',
    value: '',
    label: '',
    openInNewTab: false,
});

const { t, te } = useI18n();
const route = useRoute();
const router = useRouter();
const { getFacetToggleHref, isFacetValueActive, toggleFacetValue, getNewSearchLocation } = useSearchFacetToggle();

const normalizedValue = computed(() => String(props.value ?? '').trim());
const normalizedLabel = computed(() => String(props.label || normalizedValue.value).trim());
const canToggle = computed(() =>
    Boolean(props.attribute && normalizedValue.value && props.attribute in clickableFacetConfig),
);
const active = computed(() => canToggle.value && isFacetValueActive(props.attribute, normalizedValue.value));
const opensInNewTab = computed(() => props.openInNewTab || /^\/res(?:\/|$)/.test(String(route.path || '')));
const href = computed(() => (canToggle.value ? getFacetToggleHref(props.attribute, normalizedValue.value) : ''));
const attributeLabel = computed(() => {
    const key = clickableFacetLabelKey(props.attribute);
    return key && te(key) ? t(key) : props.attribute;
});
const ariaLabel = computed(() => {
    const action = active.value ? t('remove') : t('addFilter');
    return `${action}: ${attributeLabel.value} = ${normalizedLabel.value}`;
});

// --- context menu ---
const menuOpen = ref(false);
const triggerRef = ref<HTMLElement | null>(null);
const menuRef = ref<HTMLElement | null>(null);
const menuPos = ref({ top: 0, left: 0 });

function computeMenuPosition() {
    const btn = triggerRef.value;
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    const menuW = 160;
    let left = r.left;
    if (left + menuW > window.innerWidth - 8) left = window.innerWidth - menuW - 8;
    left = Math.max(8, left);
    const spaceBelow = window.innerHeight - r.bottom;
    const top = spaceBelow >= 80 ? r.bottom + 4 : r.top - 84;
    menuPos.value = { top, left };
}

function toggleMenu() {
    menuOpen.value = !menuOpen.value;
    if (menuOpen.value) {
        nextTick(() => {
            computeMenuPosition();
            (menuRef.value?.querySelector('[role="menuitem"]') as HTMLElement | null)?.focus();
        });
    }
}

function closeMenu() {
    menuOpen.value = false;
    triggerRef.value?.focus();
}

function onOutsideClick(e: MouseEvent) {
    const t = e.target as Node;
    if (!triggerRef.value?.contains(t) && !menuRef.value?.contains(t)) closeMenu();
}

async function addToSearch() {
    closeMenu();
    await router.push(href.value);
}

async function startNewSearch() {
    closeMenu();
    await router.push(getNewSearchLocation(props.attribute, normalizedValue.value));
}

onMounted(() => document.addEventListener('click', onOutsideClick, { capture: true }));
onBeforeUnmount(() => document.removeEventListener('click', onOutsideClick, { capture: true }));
</script>
