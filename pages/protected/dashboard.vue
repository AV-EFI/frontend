<template>
    <div class="container mx-auto p-4">
        <GlobalBreadcrumbsComp
            :breadcrumbs="[
                [$t('home.breadcrumbs'), '/'],
                [$t('dashboard'), `/protected/dashboard`],
            ]"
        />
        <div class="mt-4">
            <NuxtLayout name="partial-layout-1-center">
                <template #title>
                    <h2 class="font-semibold">
                        {{ authData?.user?.name }} | {{ authData?.user?.institution }}
                    </h2>
                    <div class="stats shadow mt-4">
                        <div v-for="stat in dashboardStatsItems" :key="stat.key" class="stat">
                            <div class="stat-title">
                                {{ stat.label }}
                            </div>
                            <div class="stat-value">
                                <span v-if="dashboardStatsPending" class="loading loading-spinner text-primary" />
                                <span v-else-if="dashboardStatsError" class="text-error text-base">
                                    {{ $t('error') }}
                                </span>
                                <span v-else>
                                    {{ formatCount(stat.value) }}
                                </span>
                            </div>
                            <div v-if="dashboardStats?.updatedAt && !dashboardStatsPending && !dashboardStatsError" class="stat-desc">
                                {{ formattedStatsUpdatedAt }}
                            </div>
                        </div>
                    </div>
                </template>
                <template #cardBody>
                    <ul class="menu bg-base-100 w-56 p-2 rounded-box mt-4">
                        <li>
                            <a
                                href="/protected/mergetool"
                                class="hover:bg-base-200 link link-primary"
                            >{{ $t('mergeTool') }}<span class="badge badge-accent text-white">1</span></a>
                        </li>
                        <li>
                            <a
                                href="/protected/favouriteslist"
                                class="hover:bg-base-200 link link-primary"
                            >{{ $t('favourites') }}</a>
                        </li>
                    </ul>
                </template>
            </NuxtLayout>
        </div>
    </div>
</template>

<script setup lang="ts">
type DashboardStatsResponse = {
    success: boolean;
    counts: {
        works: number;
        manifestations: number;
        items: number;
    };
    updatedAt: string;
};

const { data: authData } = useAuth();
const { locale, t } = useI18n();

const {
    data: dashboardStats,
    pending: dashboardStatsPending,
    error: dashboardStatsError,
} = await useFetch<DashboardStatsResponse>('/api/elastic/dashboard-stats', {
    method: 'POST',
});

const dashboardStatsItems = computed(() => [
    {
        key: 'works',
        label: t('workvariants'),
        value: dashboardStats.value?.counts?.works ?? 0,
    },
    {
        key: 'manifestations',
        label: t('manifestations'),
        value: dashboardStats.value?.counts?.manifestations ?? 0,
    },
    {
        key: 'items',
        label: t('items'),
        value: dashboardStats.value?.counts?.items ?? 0,
    },
]);

const formattedStatsUpdatedAt = computed(() => {
    if (!dashboardStats.value?.updatedAt) {
        return '';
    }

    return new Intl.DateTimeFormat(locale.value, {
        dateStyle: 'short',
        timeStyle: 'short',
    }).format(new Date(dashboardStats.value.updatedAt));
});

function formatCount(value: number): string {
    return new Intl.NumberFormat(locale.value).format(value);
}
</script>
