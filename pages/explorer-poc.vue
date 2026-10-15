<template>
    <div class="explorer" :style="{ '--ex-grain': grain }">
        <ExplorerSidebar />

        <main id="main-content" tabindex="-1" class="explorer-center">
            <section class="explorer-stage" :class="{ 'is-cases': store.view === 'cases' }" :aria-label="text.region">
                <ExplorerModelView v-if="store.view === 'model'" />
                <ExplorerCasesView v-else />
            </section>
        </main>

        <ExplorerDrawer />
        <ExplorerLightTable />
    </div>
</template>

<script setup lang="ts">
import { useExplorerStore } from '~/stores/explorerStore';

definePageMeta({ layout: 'explorer' });

const { t } = useI18n();
const store = useExplorerStore();
const { text } = useExplorerTexts();

(useSeoMeta as (meta: Record<string, unknown>) => void)({
    title: t('explorer.title'),
    robots: 'noindex, nofollow',
});

/* Film grain on the colour fields. Drawn once on the client; without it the fields stay flat, which is fine. */
const grain = ref('none');

function createGrain(): string {
    const size = 180;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d');
    if (!context) return 'none';
    const image = context.createImageData(size, size);
    for (let index = 0; index < image.data.length; index += 4) {
        const value = 200 + Math.random() * 55;
        image.data[index] = value;
        image.data[index + 1] = value;
        image.data[index + 2] = value;
        image.data[index + 3] = 255;
    }
    context.putImageData(image, 0, 0);
    return `url(${canvas.toDataURL()})`;
}

onMounted(() => {
    grain.value = createGrain();
});

/* A link inside the drawer brings the matching part of the overview into view. */
watch(
    () => store.scrollTarget,
    async (id) => {
        if (!id) return;
        await nextTick();
        const target = document.getElementById(id);
        if (target) {
            const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            target.scrollIntoView({ block: 'center', behavior: calm ? 'auto' : 'smooth' });
            target.classList.add('explorer-flash');
            window.setTimeout(() => target.classList.remove('explorer-flash'), 1400);
        }
        store.clearScrollTarget();
    },
    { flush: 'post' },
);
</script>

<style>
/*
 * Colours come from the AVefi theme tokens, so light and dark follow the site. "Paper" is the white card
 * surface of the design; it stays light in the dark theme, with dark ink on it.
 */
.explorer {
    --ex-ink: var(--color-neutral);
    --ex-level-ink: var(--color-secondary);
    --ex-paper: var(--color-base-100);
    --ex-paper-muted: color-mix(in oklch, var(--ex-ink) 72%, var(--ex-paper));
    --ex-paper-line: color-mix(in oklch, var(--ex-ink) 18%, var(--ex-paper));
    --ex-muted: color-mix(in oklch, var(--color-base-content) 68%, var(--color-base-100));
    --ex-line: color-mix(in oklch, var(--color-base-content) 22%, var(--color-base-100));
    --ex-shadow: 0 0.3rem 0.9rem color-mix(in oklch, var(--color-neutral) 22%, transparent);

    display: grid;
    grid-template-columns: 17rem minmax(0, 1fr);
    height: 100%;
    min-height: 0;
    color: var(--color-base-content);
    background: var(--color-base-300);
}

[data-theme='avefi_dark'] .explorer {
    --ex-ink: var(--color-base-300);
    --ex-level-ink: var(--color-secondary);
    --ex-paper: var(--color-neutral-content);
}

.explorer :focus-visible {
    outline: 3px solid var(--color-base-content);
    outline-offset: 2px;
    box-shadow: 0 0 0 5px var(--color-base-100);
}

.explorer-center {
    display: flex;
    min-width: 0;
    min-height: 0;
    padding: 0.75rem;
}

.explorer-center:focus {
    outline: none;
}

.explorer-stage {
    position: relative;
    flex: 1;
    min-height: 0;
    padding: 1.4rem 1.6rem 1.6rem;
    overflow: auto;
    background: var(--color-base-200);
    border: 1px solid var(--ex-line);
}

.explorer-stage.is-cases {
    color: var(--color-primary-content);
    background: var(--color-primary);
    border-color: var(--color-primary);
}

.explorer-stage.is-cases::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-image: var(--ex-grain);
    mix-blend-mode: multiply;
    opacity: 0.28;
}

.explorer-stage.is-cases > * {
    position: relative;
    z-index: 1;
}

.explorer-lead {
    margin: 0;
    font-family: 'BreeSerif', Georgia, 'Times New Roman', serif;
    font-size: 1.65rem;
    font-weight: 400;
    line-height: 1.05;
    text-transform: uppercase;
}

.explorer-sub {
    max-width: 66ch;
    margin: 0.35rem 0 0;
    font-size: 0.9rem;
    color: var(--ex-muted);
}

.explorer-stage.is-cases .explorer-sub {
    color: inherit;
}

.explorer-ghost {
    padding: 0.4rem 0.8rem;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: inherit;
    background: transparent;
    border: 1px solid var(--ex-line);
    cursor: pointer;
}

.explorer-stage.is-cases .explorer-ghost {
    border-color: currentColor;
}

.explorer-ghost:hover {
    border-color: var(--ex-muted);
}

.explorer-ghost[aria-pressed='true'] {
    border-color: var(--color-primary);
    box-shadow: inset 0 -3px 0 var(--color-primary);
}

.explorer-stage.is-cases .explorer-ghost[aria-pressed='true'] {
    border-color: currentColor;
    box-shadow: inset 0 -3px 0 currentColor;
}

.explorer-flash {
    animation: explorer-flash 1.4s ease-out;
}

@keyframes explorer-flash {
    0% { box-shadow: 0 0 0 0.4rem var(--color-highlight); }
    100% { box-shadow: 0 0 0 0.4rem transparent; }
}

@media (prefers-reduced-motion: reduce) {
    .explorer-flash {
        animation: none;
        outline: 3px solid var(--color-highlight);
    }
}

@media (max-width: 1100px) {
    .explorer {
        grid-template-columns: 14.5rem minmax(0, 1fr);
    }
}

@media (max-width: 760px) {
    .explorer {
        display: block;
        height: auto;
    }

    .explorer-stage {
        overflow: visible;
    }
}
</style>
