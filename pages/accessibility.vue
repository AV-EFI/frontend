<template>
    <div>
        <GlobalBreadcrumbsComp
            :breadcrumbs="[
                ['Home', '/'],
                [$t('accessibilityStatement'), '/accessibility'],
            ]"
        />

        <div class="container mx-auto p-4">
            <div class="w-full md:w-4/5 mx-auto">
                <article class="card bg-base-100 shadow-xl">
                    <div class="card-body gap-6">
                        <header class="space-y-3">
                            <h1 class="card-title text-3xl font-bold">
                                {{ $t('accessibilityPage.title') }}
                            </h1>
                            <p class="text-base-content/80">
                                {{ $t('accessibilityPage.intro') }}
                            </p>
                        </header>

                        <section class="space-y-3">
                            <h2 class="text-xl font-semibold">
                                {{ $t('accessibilityPage.commitment.title') }}
                            </h2>
                            <p>{{ $t('accessibilityPage.commitment.body') }}</p>
                            <ul class="list-disc pl-6 space-y-1">
                                <li v-for="item in commitmentAreas" :key="item">{{ item }}</li>
                            </ul>
                        </section>

                        <section class="space-y-3">
                            <h2 class="text-xl font-semibold">
                                {{ $t('accessibilityPage.principles.title') }}
                            </h2>
                            <div class="grid gap-4 md:grid-cols-2">
                                <section
                                    v-for="principle in principles"
                                    :key="principle.key"
                                    class="rounded-xl border border-base-200 p-4"
                                >
                                    <h3 class="mb-2 font-semibold">{{ principle.title }}</h3>
                                    <p class="text-sm text-base-content/80">{{ principle.body }}</p>
                                </section>
                            </div>
                        </section>

                        <section class="space-y-4">
                            <h2 class="text-xl font-semibold">
                                {{ $t('accessibilityPage.status.title') }}
                            </h2>
                            <p>{{ $t('accessibilityPage.status.body') }}</p>

                            <div class="rounded-xl border border-base-200 p-4 space-y-3">
                                <h3 class="font-semibold">
                                    {{ $t('accessibilityPage.status.nonAccessible.title') }}
                                </h3>
                                <ul class="list-disc pl-6 space-y-1">
                                    <li v-for="item in nonAccessibleItems" :key="item">{{ item }}</li>
                                </ul>
                            </div>

                            <div class="rounded-xl border border-base-200 p-4 space-y-3">
                                <h3 class="font-semibold">
                                    {{ $t('accessibilityPage.status.reasons.title') }}
                                </h3>
                                <ul class="list-disc pl-6 space-y-1">
                                    <li v-for="item in reasonItems" :key="item">{{ item }}</li>
                                </ul>
                            </div>

                            <div class="rounded-xl border border-base-200 p-4 space-y-3">
                                <h3 class="font-semibold">
                                    {{ $t('accessibilityPage.status.alternatives.title') }}
                                </h3>
                                <p>{{ $t('accessibilityPage.status.alternatives.body') }}</p>
                            </div>
                        </section>

                        <section class="space-y-3">
                            <h2 class="text-xl font-semibold">
                                {{ $t('accessibilityPage.feedback.title') }}
                            </h2>
                            <p>{{ $t('accessibilityPage.feedback.body') }}</p>

                            <div class="rounded-xl border border-base-200 p-4 space-y-2">
                                <p class="font-medium">
                                    {{ $t('accessibilityPage.feedback.contactLabel') }}
                                </p>
                                <p>
                                    <a
                                        class="link link-primary"
                                        :href="`mailto:${t('accessibilityPage.feedback.contactEmail')}`"
                                    >
                                        {{ $t('accessibilityPage.feedback.contactEmail') }}
                                    </a>
                                </p>
                            </div>

                            <div>
                                <p class="mb-2 font-medium">
                                    {{ $t('accessibilityPage.feedback.includeLabel') }}
                                </p>
                                <ul class="list-disc pl-6 space-y-1">
                                    <li v-for="item in feedbackItems" :key="item">{{ item }}</li>
                                </ul>
                            </div>
                        </section>

                        <section class="space-y-3">
                            <h2 class="text-xl font-semibold">
                                {{ $t('accessibilityPage.arbitration.title') }}
                            </h2>
                            <p>{{ $t('accessibilityPage.arbitration.body') }}</p>

                            <div class="rounded-xl border border-base-200 p-4 space-y-2">
                                <p class="font-medium">
                                    {{ $t('accessibilityPage.arbitration.contact.name') }}
                                </p>
                                <p>{{ $t('accessibilityPage.arbitration.contact.organization') }}</p>
                                <p>{{ $t('accessibilityPage.arbitration.contact.address') }}</p>
                                <p>
                                    <span class="font-medium">Phone:</span>
                                    {{ $t('accessibilityPage.arbitration.contact.phone') }}
                                </p>
                                <p>
                                    <span class="font-medium">Fax:</span>
                                    {{ $t('accessibilityPage.arbitration.contact.fax') }}
                                </p>
                                <p>
                                    <span class="font-medium">Email:</span>
                                    <a
                                        class="link link-primary"
                                        :href="`mailto:${t('accessibilityPage.arbitration.contact.email')}`"
                                    >
                                        {{ $t('accessibilityPage.arbitration.contact.email') }}
                                    </a>
                                </p>
                                <p>
                                    <span class="font-medium">Website:</span>
                                    <a
                                        class="link link-primary"
                                        :href="t('accessibilityPage.arbitration.contact.website')"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {{ $t('accessibilityPage.arbitration.contact.website') }}
                                    </a>
                                </p>
                            </div>
                        </section>

                        <section class="space-y-3">
                            <h2 class="text-xl font-semibold">
                                {{ $t('accessibilityPage.improvement.title') }}
                            </h2>
                            <p>{{ $t('accessibilityPage.improvement.body') }}</p>
                        </section>
                    </div>
                </article>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    auth: false,
});

const { t, tm, rt } = useI18n();

const commitmentAreas = computed(() =>
    (tm('accessibilityPage.commitment.areas') as string[]).map((item) => rt(item)),
);

const feedbackItems = computed(() =>
    (tm('accessibilityPage.feedback.includeItems') as string[]).map((item) => rt(item)),
);

const nonAccessibleItems = computed(() =>
    (tm('accessibilityPage.status.nonAccessible.items') as string[]).map((item) => rt(item)),
);

const reasonItems = computed(() =>
    (tm('accessibilityPage.status.reasons.items') as string[]).map((item) => rt(item)),
);

const principles = computed(() => [
    {
        key: 'perceivable',
        title: t('accessibilityPage.principles.perceivable.title'),
        body: t('accessibilityPage.principles.perceivable.body'),
    },
    {
        key: 'operable',
        title: t('accessibilityPage.principles.operable.title'),
        body: t('accessibilityPage.principles.operable.body'),
    },
    {
        key: 'understandable',
        title: t('accessibilityPage.principles.understandable.title'),
        body: t('accessibilityPage.principles.understandable.body'),
    },
    {
        key: 'robust',
        title: t('accessibilityPage.principles.robust.title'),
        body: t('accessibilityPage.principles.robust.body'),
    },
]);

useSeoMeta({
    title: t('seo.accessibility.title'),
    description: t('seo.accessibility.description'),
    ogTitle: t('seo.accessibility.ogTitle'),
    ogDescription: t('seo.accessibility.ogDescription'),
    ogImage: '/img/avefi-og-image.png',
});
</script>