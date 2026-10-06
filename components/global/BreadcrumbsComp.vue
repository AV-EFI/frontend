<template>
    <div
        class="w-full md:w-fit center-content justify-center mx-auto my-2 text-base-content/70"
    >
        <nav
            class="breadcrumbs ml-2 md:ml-auto text-sm"
            role="navigation"
            :aria-label="$t('breadcrumb')"
        >
            <ul class="flex flex-wrap gap-2">
                <li
                    v-for="(el, index) in resolvedBreadcrumbs"
                    :key="index"
                >
                    <span
                        v-if="index === resolvedBreadcrumbs.length - 1 && resolvedBreadcrumbs.length > 1"
                        class="font-semibold text-base-content"
                        aria-current="page"
                    >
                        {{ el[0] }}
                    </span>
                    <a v-else :href="el[1]" class="hover:underline">
                        {{ el[0] }}
                    </a>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script lang="ts" setup>
const { t } = useI18n();

const props = withDefaults(defineProps<{
    breadcrumbs?: Array<[string, string]>;
}>(), {
    breadcrumbs: () => [],
});

const resolvedBreadcrumbs = computed(() => props.breadcrumbs.length
    ? props.breadcrumbs
    : [[t('home.breadcrumbs'), '/']]);
</script>
