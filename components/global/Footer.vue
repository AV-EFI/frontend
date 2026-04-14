<template>
    <ClientOnly>
        <footer
            class="footer w-full bg-neutral dark:bg-[#141b1f] text-white dark:text-white px-6 border-t-2 border-base-100"
            role="contentinfo"
            :aria-label="$t('footer')"
        >
            <div class="container mx-auto p-2 lg:p-4 pb-6 md:pb-4">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                    <nav class="flex flex-col col-span-1" :aria-label="$t('footerInfo')">
                        <h2 class="footer-title">
                            {{ $t('license') }}
                        </h2>
                        <ul>
                            <li class="min-h-16">
                                <a
                                    href="https://creativecommons.org/licenses/by/4.0/"
                                    target="_blank"
                                    class="link transition inline-flex items-start p-3 rounded-md min-h-16 leading-4 focus-visible:outline-offset-2 focus-visible:outline-base-100"
                                    :aria-label="$t('footerLicenseContent')"
                                >
                                    <span>
                                        {{ $t('footerLicenseContent') }}
                                        <Icon name="tabler:creative-commons" class="text-lg" />
                                    </span>
                                </a>
                            </li>
                            <li class="min-h-16">
                                <a
                                    href="https://creativecommons.org/publicdomain/zero/1.0/"
                                    target="_blank"
                                    class="link transition inline-flex items-start p-3 rounded-md min-h-16 leading-4 focus-visible:outline-offset-2 focus-visible:outline-base-100"
                                    :aria-label="$t('footerLicenseData')"
                                >
                                    <span>
                                        {{ $t('footerLicenseData') }}
                                        <Icon name="tabler:creative-commons" class="text-lg" />
                                    </span>
                                </a>
                            </li>
                        </ul>
                    </nav>

                    <nav class="flex flex-col col-span-1" :aria-label="$t('footerInfo')">
                        <h2 class="footer-title">
                            {{ $t('footerInfo') }}
                        </h2>
                        <ul>
                            <li class="min-h-16">
                                <a
                                    href="https://datenschutz.gwdg.de/services/av-efi"
                                    target="_blank"
                                    class="link transition inline-flex items-start p-3 rounded-md min-h-16 leading-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-base-100"
                                    :aria-label="$t('dataprotection')"
                                >
                                    {{ $t('dataprotection') }}
                                </a>
                            </li>
                            <li class="min-h-16">
                                <a
                                    href="/imprint"
                                    class="link transition inline-flex items-start p-3 rounded-md min-h-16 leading-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-base-100"
                                    :aria-label="$t('imprint')"
                                >
                                    {{ $t('imprint') }}
                                </a>
                            </li>
                            <li class="min-h-16">
                                <NuxtLink
                                    to="/accessibility"
                                    class="link transition inline-flex items-start p-3 rounded-md min-h-16 leading-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-base-100"
                                    :aria-label="$t('accessibilityStatement')"
                                >
                                    {{ $t('accessibilityStatement') }}
                                </NuxtLink>
                            </li>
                            <li class="min-h-16">
                                <a
                                    href="https://listserv.gwdg.de/mailman/listinfo/av-efi-community"
                                    target="_blank"
                                    class="link transition inline-flex items-start p-3 rounded-md min-h-16 leading-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-base-100"
                                    :aria-label="$t('home.sections.becomePartner.cta')"
                                >
                                    {{ $t('home.sections.becomePartner.cta') }}
                                </a>
                            </li>
                            <li class="min-h-16">
                                <NuxtLink
                                    to="/press"
                                    class="link transition inline-flex items-start p-3 rounded-md min-h-16 leading-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-base-100"
                                    :aria-label="$t('press.title')"
                                >
                                    {{ $t('press.title') }}
                                </NuxtLink>
                            </li>
                        </ul>
                    </nav>

                    <nav class="flex flex-col col-span-1" :aria-label="$t('footerSponsoring')">
                        <h2 class="footer-title">
                            {{ $t('sponsoring') }}
                        </h2>
                        <div class="bg-transparent">
                            <a
                                href="https://gepris.dfg.de/gepris/projekt/517778207?context=projekt&task=showDetail&id=517778207&"
                                target="_blank"
                                :aria-label="$t('footerFundingAria')"
                            >
                                <img
                                    alt="Deutsche Forschungsgemeinschaft"
                                    class="object-contain h-20 w-full"
                                    src="/img/DFG.svg"
                                >
                            </a>
                        </div>
                    </nav>
                </div>
            </div>
        </footer>
    </ClientOnly>
</template>
