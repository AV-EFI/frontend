<template>
    <div class="container mx-auto p-4 max-w-4xl">
        <div class="imprint card bg-base-100 shadow-xl">
            <div class="card-body">
                <h1 class="card-title text-2xl font-bold">
                    {{ t('imprintPage.title') }}
                </h1>

                <p>
                    {{ t('imprintPage.introText') }}
                    <NuxtLink to="/" class="link link-primary">{{ t('imprintPage.introLinkText') }}</NuxtLink>.
                </p>

                <section
                    v-for="section in sections"
                    :key="section.titleKey"
                    class="mt-4"
                >
                    <h2 class="text-xl font-semibold mt-4">
                        {{ t(section.titleKey) }}
                    </h2>
                    <p
                        v-for="paragraphKey in section.paragraphKeys"
                        :key="paragraphKey"
                        v-html="t(paragraphKey)"
                    />
                </section>

                <section class="mt-4">
                    <h2 class="text-xl font-semibold mt-4">
                        {{ t('imprintPage.contact.title') }}
                    </h2>
                    <p>
                        <strong>{{ t('imprintPage.contact.addressLabel') }}:</strong> {{ t('imprintPage.contact.addressLine1') }}<br>
                        {{ t('imprintPage.contact.addressLine2') }}<br>
                        {{ t('imprintPage.contact.addressLine3') }}
                    </p>
                    <p>
                        <strong>{{ t('imprintPage.contact.phoneLabel') }}:</strong> {{ t('imprintPage.contact.phone') }}<br>
                        <strong>{{ t('imprintPage.contact.hotlineLabel') }}:</strong> {{ t('imprintPage.contact.hotline') }}<br>
                        <strong>{{ t('imprintPage.contact.emailLabel') }}:</strong> <a :href="`mailto:${t('imprintPage.contact.supportEmail')}`" class="link link-primary">{{ t('imprintPage.contact.supportEmail') }}</a><br>
                        <strong>{{ t('imprintPage.contact.websiteLabel') }}:</strong> <a href="https://www.gwdg.de" class="link link-primary" target="_blank" rel="noopener noreferrer">www.gwdg.de</a><br>
                        <strong>{{ t('imprintPage.contact.emailLabel') }}:</strong> <a :href="`mailto:${t('imprintPage.contact.generalEmail')}`" class="link link-primary">{{ t('imprintPage.contact.generalEmail') }}</a>
                    </p>
                </section>

                <p class="mt-4">
                    {{ t('imprintPage.externalLinks.body3') }}
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    auth: false,
});

const { t } = useI18n();

const sections = [
    {
        titleKey: 'imprintPage.provider.title',
        paragraphKeys: ['imprintPage.provider.body'],
    },
    {
        titleKey: 'imprintPage.commercialRegister.title',
        paragraphKeys: ['imprintPage.commercialRegister.body'],
    },
    {
        titleKey: 'imprintPage.representatives.title',
        paragraphKeys: ['imprintPage.representatives.body'],
    },
    {
        titleKey: 'imprintPage.vat.title',
        paragraphKeys: ['imprintPage.vat.body'],
    },
    {
        titleKey: 'imprintPage.editorial.title',
        paragraphKeys: ['imprintPage.editorial.body'],
    },
    {
        titleKey: 'imprintPage.orgForm.title',
        paragraphKeys: ['imprintPage.orgForm.body'],
    },
    {
        titleKey: 'imprintPage.foreignLanguages.title',
        paragraphKeys: ['imprintPage.foreignLanguages.body'],
    },
    {
        titleKey: 'imprintPage.liabilityOwnContent.title',
        paragraphKeys: [
            'imprintPage.liabilityOwnContent.body1',
            'imprintPage.liabilityOwnContent.body2',
        ],
    },
    {
        titleKey: 'imprintPage.externalLinks.title',
        paragraphKeys: [
            'imprintPage.externalLinks.body1',
            'imprintPage.externalLinks.body2',
        ],
    },
] as const;

useSeoMeta({
    title: t('seo.imprint.title'),
    description: t('seo.imprint.description'),
    ogTitle: t('seo.imprint.ogTitle'),
    ogDescription: t('seo.imprint.ogDescription'),
    ogImage: '/img/avefi-og-image.png',
});
</script>
