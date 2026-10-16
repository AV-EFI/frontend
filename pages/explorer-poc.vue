<template>
    <NuxtLayout name="partial-layout-1-center" full-width>
        <template #navigation>
            <GlobalBreadcrumbsComp :breadcrumbs="[
                [$t('home.breadcrumbs'), '/'],
                [text.title, '/explorer-poc'],
            ]" />
        </template>

        <template #title>
            <GlobalPageTitleComp variant="panel" class="dark:text-white col-span-full text-ellipsis text-wrap overflow-hidden content-center lg:ml-4">
                {{ text.title }}
            </GlobalPageTitleComp>
        </template>

        <template #cardBody>
            <div role="tablist" class="tabs tabs-lift" :aria-label="text.nav.view">
                <input
                    type="radio"
                    name="explorer-tabs"
                    role="tab"
                    class="tab"
                    :aria-label="text.nav.model.name"
                    :checked="store.view === 'model'"
                    :aria-selected="store.view === 'model'"
                    aria-controls="explorer-panel-model"
                    @change="store.setView('model')"
                >
                <div
                    id="explorer-panel-model"
                    role="tabpanel"
                    class="tab-content bg-base-100 border-base-300 p-4"
                >
                    <div v-if="store.view === 'model'" class="explorer" :style="{ '--ex-grain': grain }">
                        <ExplorerSidebar />
                        <section class="explorer-stage" :aria-label="text.nav.model.name">
                            <ExplorerModelView />
                        </section>
                    </div>
                </div>

                <input
                    type="radio"
                    name="explorer-tabs"
                    role="tab"
                    class="tab"
                    :aria-label="casesTabLabel"
                    :checked="store.view === 'cases'"
                    :aria-selected="store.view === 'cases'"
                    aria-controls="explorer-panel-cases"
                    @change="store.setView('cases')"
                >
                <div
                    id="explorer-panel-cases"
                    role="tabpanel"
                    class="tab-content bg-base-100 border-base-300 p-4"
                >
                    <div v-if="store.view === 'cases'" class="explorer" :style="{ '--ex-grain': grain }">
                        <ExplorerSidebar />
                        <section class="explorer-stage is-cases" :aria-label="text.nav.cases.name">
                            <ExplorerCasesView />
                        </section>
                    </div>
                </div>
            </div>

            <ExplorerDrawer />
            <ExplorerLightTable />
        </template>
    </NuxtLayout>
</template>

<script setup lang="ts">
import { useExplorerStore } from '~/stores/explorerStore';

const { t } = useI18n();
const store = useExplorerStore();
const { text, fill } = useExplorerTexts();

(useSeoMeta as (meta: Record<string, unknown>) => void)({
    title: t('explorer.title'),
    robots: 'noindex, nofollow',
});

/** "Fälle (3 offen)", the same way the detail page names its tabs with a count. */
const casesTabLabel = computed(() => {
    const state = store.openCaseCount > 0 ? fill(text.value.nav.cases.open, { n: store.openCaseCount }) : text.value.nav.cases.done;
    return `${text.value.nav.cases.name} (${state})`;
});

/*
 * Film grain on the colour fields: a transparent layer of dark specks, drawn once on the client. It darkens a
 * pixel by 4 % at most, so dark text on the level colours keeps its contrast. Without it the fields stay flat.
 */
const grain = ref('none');

function createGrain(): string {
    const size = 180;
    const maxAlpha = 10;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d');
    if (!context) return 'none';
    const image = context.createImageData(size, size);
    for (let index = 0; index < image.data.length; index += 4) {
        image.data[index + 3] = Math.random() * maxAlpha;
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
 * Colours come from the AVefi theme tokens, so light and dark follow the site. "Paper" is the card surface.
 * The drawer and the light table lie outside the explorer grid, so they share the same variables.
 */
.explorer,
.explorer-drawer,
.explorer-dialog {
    --ex-ink: var(--color-base-content);
    --ex-level-ink: var(--color-secondary);
    --ex-paper: var(--color-base-100);
    --ex-paper-muted: color-mix(in oklch, var(--ex-ink) 72%, var(--ex-paper));
    --ex-paper-line: color-mix(in oklch, var(--ex-ink) 18%, var(--ex-paper));
    --ex-muted: color-mix(in oklch, var(--color-base-content) 68%, var(--color-base-100));
    --ex-line: color-mix(in oklch, var(--color-base-content) 22%, var(--color-base-100));
    --ex-shadow: 0 0.3rem 0.9rem color-mix(in oklch, var(--color-neutral) 22%, transparent);
}

.explorer {
    display: grid;
    grid-template-columns: 16rem minmax(0, 1fr);
    gap: 1.25rem;
    color: var(--color-base-content);
}

.explorer :focus-visible,
.explorer-drawer :focus-visible,
.explorer-dialog :focus-visible {
    outline: 3px solid var(--color-base-content);
    outline-offset: 2px;
    box-shadow: 0 0 0 5px var(--color-base-100);
}

.explorer-stage {
    position: relative;
    min-width: 0;
    padding: 1.6rem 1.5rem 1.5rem;
    background-color: var(--color-base-200);
    border: 1px solid var(--ex-line);
}

.explorer-stage.is-cases {
    color: var(--color-primary-content);
    background-color: var(--color-primary);
    background-image: var(--ex-grain);
    border-color: var(--color-primary);
}

.explorer-lead {
    margin: 0;
    font-family: 'BreeSerif', Georgia, 'Times New Roman', serif;
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 1.15;
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
    font-size: 0.85rem;
    font-weight: 600;
    color: inherit;
    background: transparent;
    border: 1px solid var(--ex-line);
    cursor: pointer;
    transition: border-color 0.15s, box-shadow 0.15s;
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

/* Things rise into place one after the other. Skipped when the visitor asks for less motion. */
@keyframes explorer-rise {
    from { opacity: 0; transform: translateY(0.75rem); }
    to { opacity: 1; transform: none; }
}

.explorer-rise {
    animation: explorer-rise 0.45s cubic-bezier(0.2, 0.7, 0.2, 1) both;
    animation-delay: calc(var(--i, 0) * 70ms);
}

@media (prefers-reduced-motion: reduce) {
    .explorer-flash {
        animation: none;
        outline: 3px solid var(--color-highlight);
    }

    .explorer-rise {
        animation: none;
    }
}

/* Side by side on a large screen: the filters and the stage scroll on their own. */
@media (min-width: 1024px) {
    .explorer {
        /* Tall enough to show the closed overview in full; it scrolls only when levels are opened. */
        height: max(46rem, calc(100dvh - var(--header-height) - 20rem));
    }

    .explorer-side,
    .explorer-stage {
        min-height: 0;
        overflow-y: auto;
        overscroll-behavior: contain;
    }
}

/* Narrower stage: the texts wrap onto more lines. */
@media (min-width: 1024px) and (max-width: 1279px) {
    .explorer {
        height: max(60rem, calc(100dvh - var(--header-height) - 20rem));
    }
}

@media (max-width: 1023px) {
    .explorer {
        grid-template-columns: minmax(0, 1fr);
    }

    .explorer-stage {
        min-height: 24rem;
    }
}
</style>
