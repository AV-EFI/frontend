<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
    <div
      v-for="(item, index) in benefitItems?.data"
      :key="index"
      class="card bg-base-100 h-full flex flex-col dark:bg-gray-700 dark:hover:bg-gray-600 hover:bg-gray-200"
      role="region"
      :aria-labelledby="`benefit-card-title-${index}`"
    >
      <div class="card-body flex-grow">
        <div class="flex justify-center">
          <Icon
            :name="item.IconName"
            class="text-4xl text-primary dark:text-primary-300"
            :aria-hidden="true"
          />
        </div>
        <h2
          :id="`benefit-card-title-${index}`"
          class="card-title dark:text-gray-200"
        >
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
          :aria-label="`${item.CTAText} – ${item.Title}`"
        >
          {{ item.CTAText }}
        </a>
      </div>
    </div>
  </div>
</template>
