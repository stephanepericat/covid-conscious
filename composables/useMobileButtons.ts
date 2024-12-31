export const useMobileButtons = () => {
  const { locale } = useI18n()
  const { $appSettings } = useNuxtApp()

  const { ANDROID_URL = '', IOS_URL = '' } = $appSettings as any
  const googlePlayBtn = computed(() => `/google-play-badge-${locale.value}.svg`)
  const appleStoreBtn = computed(() => `/apple-store-badge-${locale.value}.svg`)

  return {
    ANDROID_URL,
    IOS_URL,
    appleStoreBtn,
    googlePlayBtn,
  }
}
