<template>
  <div class="tcl-media">
    <h5 class="leading-snug mb-2">
      <NuxtLink
        :target="target"
        :to="url"
      >
        {{ title }}
      </NuxtLink>
    </h5>
    <p v-if="date" class="text-xs uppercase tracking-widest mb-2">{{ format(new Date(convertTs(date)), LOCALIZED_DATE_FORMAT, { locale: getDateLocale(locale)}) }}</p>
    <div v-if="tags.length">
      <ul class="m-0 p-0 flex flex-wrap">
        <li v-for="tag in tags" :key="tag.uri" class="mr-2 mb-2 mt-0 ml-0">
          <IBadge
            class="uppercase tracking-widest cursor-pointer mb-0"
            size="sm"
            @click="onTagClick({ uri: tag.uri })"
          >
            {{ tag.name }}
          </IBadge>
        </li>
      </ul>
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
  })

  const { onTagClick } = useTags()

  const { locale } = useI18n()
</script>