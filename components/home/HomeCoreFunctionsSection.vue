<template>
    <section role="region" :aria-label="t('coreFunctionsSection')" class="relative border-t border-base-200 py-10">
        <div class="container mx-auto px-4 min-h-[400px] flex items-center">
            <div class="card lg:max-w-96 md:p-2 shadow-md bg-white/90 dark:bg-transparent" role="group"
                :aria-label="t('openAndExtendable.title')">
                <div class="card-body">
                    <div class="flex justify-start items-center gap-2">
                        <Icon name="tabler:link" aria-hidden="true" />
                        <h2 class="text-xl md:text-2xl font-extrabold bree" tabindex="0">
                            {{ t('openAndExtendable.title') }}
                        </h2>
                    </div>
                    <ul class="mt-2" role="list">
                        <li class="mb-2" role="listitem"><span class="text-base">{{ t('openAndExtendable.content[0]')
                                }}</span></li>
                        <li class="mb-2" role="listitem">
                            <a target="_blank" :href="t('openAndExtendable.content[2]')"
                                class="text-base text-primary underline">
                                {{ t('openAndExtendable.content[1]') }}
                            </a>
                        </li>
                    </ul>
                </div>
                <div class="card-actions justify-end m-3">
                    <a href="https://projects.tib.eu/av-efi/pid/efi-infrastruktur/" target="_blank"
                        class="btn btn-outline max-md:btn-block">
                        <span class="sr-only">{{ t('openAndExtendable.cta') }} – </span>{{ t('openAndExtendable.cta') }}
                    </a>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>
