<template>
  <div
    class="tcl-card rounded-lg overflow-hidden shadow-md"
  >
    <div class="aspect-video">
      <NuxtLink
        class="no-underline"
        :target="target"
        :to="url"
      >
        <SanityImage
          v-if="visual"
          :asset-id="visual"
          :alt="title"
          class="w-full"
          fit="crop"
          crop="entropy" 
          :h="576"
          :w="1024"
        />
        <NuxtImg
          v-else src="/tcl-fallback-169.jpg"
          class="w-full"
        />
      </NuxtLink>
    </div>
    <div class="p-6">
      <h4 class="leading-snug">
        <NuxtLink
          class="no-underline"
          :target="target"
          :to="url"
        >
          {{ title }}
        </NuxtLink>
      </h4>
      <p v-if="date" class="text-sm uppercase tracking-widest">{{ format(new Date(convertTs(date)), LOCALIZED_DATE_FORMAT, { locale: getDateLocale(locale)}) }}</p>
      <p v-if="description">descrtiption</p>
      <div v-if="tags.length">
        <ul class="m-0 p-0 flex flex-wrap">
          <li v-for="tag in tags" :key="tag.uri" class="mr-2 mb-2 mt-0 ml-0">
            <IBadge
              class="uppercase tracking-widest cursor-pointer mb-0"
              @click="onTagClick({ uri: tag.uri })"
            >
              {{ tag.name }}
            </IBadge>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { format } from 'date-fns'
  import { useTags } from '~/assets/composables/useTags'
  import { convertTs } from '~/assets/utils/convert-timestamp'
  import { getDateLocale } from '~/assets/constants/date-locales'
  import { LOCALIZED_DATE_FORMAT } from '~/assets/constants/date-formats'

  defineProps({
    date: { type: String, default: null },
    description: { type: String, default: null },
    free: Boolean,
    limited: Boolean,
    premium: Boolean,
    tags: { type: Array, default: [] },
    target: { type: String, default: null },
    title: { type: String, required: true },
    url: { type: String, required: true },
    visual: { type: String, default: null }
  })

  const { onTagClick } = useTags()

  const { locale } = useI18n()
</script>
<style lang="scss">
@import "~/assets/sass/mixins.scss";

.tcl-card {
  // background-color: #f5f5f5;
  border: 1px solid var(--color-light);
}

.dark-theme {
  .tcl-card {
    @include darkBg();

    border: 1px solid var(--color-dark);
  }
}
</style>