<template>
    <section>
        <div class="flex mx-auto my-2">
            <slot name="navigation" />
        </div>
    </section>
    <section>
        <div
            class="w-full mx-auto card card-side rounded-xl bg-white/95 dark:bg-gray-900 text-base-content border border-base-200 shadow-md lg:!w-[calc(100%-2rem)] 2xl:!w-[92rem]"
        >
            <div
                class="card-body max-w-full max-md:p-2"
                :class="paddingClass"
            >
                <div class="w-full flex flex-row items-center">
                    <slot name="actions" />
                </div>
                <slot name="title" />
                <div class="divider mt-0 mb-2"></div>
                <slot name="cardBody">
                    Card content
                </slot>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
defineProps({
    paddingClass: {
        type: String,
        default: 'p-4'
    }
});
</script>
