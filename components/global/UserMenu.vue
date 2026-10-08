<template>
    <GlobalHeaderMenu
        icon="tabler:user-circle"
        :label="`${$t('hello')} ${userName}`"
        :panel-label="$t('userMenu')"
        panel-class="w-72"
    >
        <li><GlobalNavItem to="/protected/dashboard" icon="tabler:layout-dashboard" :label="$t('dashboard')" /></li>
        <li><GlobalNavItem to="/protected/mergetool" icon="tabler:git-merge" :label="$t('mergeTool')" badge="1" badge-class="badge-accent text-white" /></li>
        <li><GlobalNavItem to="/protected/favouriteslist" icon="tabler:heart" :label="$t('favourites')" /></li>
        <li><GlobalNavItem to="/protected/me" icon="tabler:user" :label="$t('profile')" /></li>
        <li><GlobalNavItem icon="tabler:logout" :label="$t('logout')" @click="emit('signOut')" /></li>
    </GlobalHeaderMenu>
</template>

<script lang="ts" setup>
defineProps<{ userName: string }>();
const emit = defineEmits<{ signOut: [] }>();
</script>
