<script setup lang="ts">
import { useFooterConfig } from '@/composables/useFooterConfig'
import { useMobileButtons } from '@/composables/useMobileButtons'

const { config } = useFooterConfig()
const { ANDROID_URL, IOS_URL, appleStoreBtn, googlePlayBtn } =
  useMobileButtons()

const onClick = (linkName: string) => umTrackEvent('click:footer', linkName)
</script>

<template>
  <footer class="pt-12 pb-32">
    <div class="container grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      <div
        :key="`footer-column-${columnIndex}`"
        v-for="({ title, contents }, columnIndex) in config"
      >
        <h4 class="uppercase text-sm font-bold tracking-widest mb-5">
          {{ title }}
        </h4>
        <ul>
          <li
            v-for="({ label, href, icon }, rowIndex) in contents"
            :key="`footer-col-${columnIndex}-row-${rowIndex}`"
            class="text-[13px] mb-2.5 h-5"
          >
            <NuxtLink
              :to="href"
              class="hover:underline text-primary hover:brightness-90 inline-flex items-center"
              @click="() => onClick(label)"
            >
              <Icon v-if="icon" :name="icon" class="mr-1.5" />
              {{ label }}
            </NuxtLink>
          </li>
        </ul>
      </div>
      <div
        class="flex flex-col items-start lg:items-end justify-end lg:justify-center"
      >
        <NuxtLink
          :href="IOS_URL"
          target="_blank"
          class="mb-2 lg:mr-0.5"
          @click="() => onClick('mobile-apple')"
        >
          <NuxtImg
            alt="Apple Store logo"
            class="h-[45px]"
            :src="appleStoreBtn"
          />
        </NuxtLink>
        <NuxtLink
          :href="ANDROID_URL"
          target="_blank"
          @click="() => onClick('mobile-android')"
        >
          <NuxtImg
            alt="Google Play logo"
            class="h-[45px]"
            :src="googlePlayBtn"
          />
        </NuxtLink>
      </div>
    </div>
    <div class="container mt-4">
      <Separator />
      <p class="mt-6 text-xs">
        &copy; 2023 - {{ new Date().getFullYear() }} | {{ $t('layout.tcl') }} |
        {{ $t('layout.rights') }}.
      </p>
    </div>
  </footer>
</template>
