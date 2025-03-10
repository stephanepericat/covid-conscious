<script setup lang="ts">
import { format } from 'date-fns'
import type { Tag, Target } from '@/lib/types'
import { getDateLocale } from '@/assets/constants/date-locales'
import { LOCALIZED_DATE_FORMAT } from '@/assets/constants/date-formats'

defineProps<{
  date?: Date | string | null
  description?: string
  end?: Date | string | null
  free?: boolean
  link: string
  limited?: boolean
  metadata?: {
    aspectRatio: number | null
    height: number | null
    width: number | null
  } | null
  premium?: boolean
  source?: string
  tags?: Tag[]
  target?: Target
  title: string
  visual?: string | null
}>()

const { locale } = useI18n()
const localePath = useLocalePath()

const onClick = (link: string) => umTrackEvent('click:article', { link })
</script>

<template>
  <Card class="overflow-hidden group">
    <NuxtLink
      :to="target === '_blank' ? link : localePath(link)"
      :target="target"
      @click="() => onClick(link)"
    >
      <CardHeader class="p-0 pb-6">
        <SanityImage
          v-if="visual"
          :alt="title"
          :asset-id="visual"
          class="w-full"
          fit="crop"
          crop="entropy"
          :h="450"
          :w="800"
        />
        <NuxtImg v-else src="/tcl-fallback-169.jpg" :alt="title" />
      </CardHeader>
    </NuxtLink>
    <CardContent>
      <h3 class="font-title text-2xl mb-3">
        <NuxtLink
          class="transition-colors duration-200 hover:text-primary"
          :to="target === '_blank' ? link : localePath(link)"
          :target="target"
          @click="() => onClick(link)"
        >
          {{ title }}
        </NuxtLink>
      </h3>
      <h4 v-if="date" class="uppercase tracking-widest text-xs">
        <span v-if="source">{{ source }} | </span>
        {{
          format(date, LOCALIZED_DATE_FORMAT, {
            locale: getDateLocale(locale),
          })
        }}
      </h4>
      <p v-if="description" class="mt-4 text-base">{{ description }}</p>
    </CardContent>
    <CardFooter v-if="tags?.length">
      <TclTagList
        :free="free"
        :limited="limited"
        :premium="premium"
        :tags="tags"
      />
    </CardFooter>
  </Card>
</template>
