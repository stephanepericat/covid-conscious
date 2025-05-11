<script lang="ts" setup>
import { format } from 'date-fns'
import { convertTs } from '@/assets/utils/convert-timestamp'
import { getDateLocale } from '@/assets/constants/date-locales'
import { LOCALIZED_DATE_FORMAT } from '@/assets/constants/date-formats'
import { useStatsig } from '@/composables/useStatsig'

defineProps<{
  date: string | null
  source: string | null
  title: string
}>()

const { locale } = useI18n()
const { statsig } = useStatsig()

const url = computed(() => {
  return `${location?.origin}${useRoute().fullPath}`
})
</script>
<template>
  <div>
    <h1
      class="font-pt antialiased text-4xl leading-[42px] font-bold mb-4 md:mb-8"
    >
      {{ title }}
    </h1>
    <h2
      v-if="date || source"
      class="flex flex-col md:flex-row gap-1 antialiased text-sm uppercase tracking-widest mb-2"
    >
      <span v-if="date">{{
        format(convertTs(date), LOCALIZED_DATE_FORMAT, {
          locale: getDateLocale(locale),
        })
      }}</span>
      <span v-if="date && source" class="hidden md:flex">|</span>
      <span v-if="source">{{ source }}</span>
    </h2>
    <Separator class="my-4" />
    <div class="mb-2 flex gap-3">
      <TclShare :title="title" :url="url" />
      <TclBookmark v-if="statsig?.checkGate('bookmarks_enabled')" />
    </div>
  </div>
</template>
