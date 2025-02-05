<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
    <div
      v-for="(item, index) in benefitItems?.data"
      :key="index"
      class="card bg-base-100 h-full flex flex-col dark:bg-gray-700 dark:hover:bg-gray-600 hover:bg-gray-200"
    >
      <div class="card-body flex-grow">
        <div class="flex justify-center">
          <Icon
            :name="item.IconName"
            class="text-4xl text-primary dark:text-primary-300"
          />
        </div>
        <h2 class="card-title dark:text-gray-200">
          {{ item.Title }}
        </h2>
        <ul class="dark:text-gray-300">
          <li
            v-for="(text, idx) in item.ListItem1 ? [item.ListItem1, item.ListItem2, item.ListItem3, item.ListItem4, item.ListItem5] : []"
            :key="idx"
            class="mb-2"
          >
            <span class="text-primary dark:text-primary-300">{{ text }}</span>
          </li>
        </ul>
      </div>
      <div class="card-actions justify-end mt-auto mb-2 mr-2">
        <a
          :href="item.CTALink"
          target="_blank"
          class="btn btn-primary dark:btn-primary-300"
        >{{ item.CTAText }}</a>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface BenefitItem {
    id: number;
    documentId: string;
    Title: string;
    CTALink: string;
    CTAText: string;
    IconName: string;
    ListItem1: string | null;
    ListItem2: string | null;
    ListItem3: string | null;
    ListItem4: string | null;
    ListItem5: string | null;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    locale: string;
}

interface Pagination {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
}

interface Meta {
    pagination: Pagination;
}

interface BenefitData {
    data: BenefitItem[];
    meta: Meta;
}

const i18n:any = useNuxtApp().$i18n;
const { data: benefitItems, refresh } = useAsyncData<BenefitData>('benefitItems', () =>
    $fetch('/api/cms/getcmscontent?contenttype=benefits&locale=' + i18n.locale.value)
);

console.log(benefitItems);

watch(() => i18n.locale.value, () => {
    refresh();
});

/*
const benefitItems = [
    {
        icon: 'fa:desktop',
        title: 'coreFunctionsTitle',
        texts: ['coreFunctions[0]', 'coreFunctions[1]', 'coreFunctions[2]', 'coreFunctions[3]', 'coreFunctions[4]'],
        link: 'https://projects.tib.eu/av-efi/projekt/',
    },
    {
        icon: 'fa-film',
        title: 'forFilmResearchersTitle',
        texts: ['forFilmResearchers[0]', 'forFilmResearchers[1]', 'forFilmResearchers[2]', 'forFilmResearchers[3]'],
        link: 'https://projects.tib.eu/av-efi/metadaten/',
    },
    {
        icon: 'fa-code',
        title: 'technicalBasicsTitle',
        texts: ['technicalBasics[0]', 'technicalBasics[1]', 'technicalBasics[2]'],
        link: 'https://projects.tib.eu/av-efi/pid/efi-infrastruktur/',
    },
];
*/
</script>

<style scoped>
/* Add any additional styles if needed */
</style>