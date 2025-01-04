<script setup lang="ts">
import { format } from 'date-fns'
import type { Tag, Target } from '@/lib/types'
import { getDateLocale } from '@/assets/constants/date-locales'
import { LOCALIZED_DATE_FORMAT } from '@/assets/constants/date-formats'

defineProps<{
  date?: Date | string | null
  description?: string
  free?: boolean
  link: string
  limited?: boolean
  metadata?: {
    aspectRatio: number | null
    height: number | null
    width: number | null
  } | null
  premium?: boolean
  tags?: Tag[]
  target?: Target
  title: string
  visual?: string | null
}>()

const { locale } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <div class="flex xl:col-span-2">
    <NuxtLink
      class="hidden xl:mr-8 xl:block xl:w-[180px] 2xl:w-[240px] xl:shrink-0"
      :to="target === '_blank' ? link : localePath(link)"
      :target="target"
    >
      <SanityImage
        v-if="visual"
        :alt="title"
        :asset-id="visual"
        class="rounded-lg"
        fit="crop"
        crop="entropy"
        :h="135"
        :w="240"
      />
      <NuxtImg
        v-else
        src="/tcl-fallback-169.jpg"
        :height="135"
        :width="240"
        :alt="title"
      />
    </NuxtLink>
    <div>
      <h2 class="font-title text-2xl mb-3">
        <NuxtLink
          class="transition-colors duration-200 hover:text-primary"
          :to="target === '_blank' ? link : localePath(link)"
          :target="target"
        >
          {{ title }}
        </NuxtLink>
      </h2>
      <h4 v-if="date" class="uppercase tracking-widest text-xs mb-3">
        {{
          format(date, LOCALIZED_DATE_FORMAT, {
            locale: getDateLocale(locale),
          })
        }}
      </h4>
      <p v-if="description" class="text-sm">{{ description }}</p>
      <TclTagList
        v-if="tags?.length"
        class="mt-4"
        :free="free"
        :limited="limited"
        :premium="premium"
        :tags="<Tag[]>tags"
      />
    </div>
  </div>
</template>
