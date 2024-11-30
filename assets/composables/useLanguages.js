export const useLanguages = () => {
  const { locale, locales } = useI18n()

  const availableLocales = computed(() => {
    return locales.value.filter((i) => i.code !== locale.value)
  })

  const currentLocale = computed(() => {
    return locales.value.find((i) => i.code === locale.value)
  })

  const getLanguages = (codes) =>
    locales.value.filter((i) => codes.includes(i.code))

  return {
    availableLocales,
    currentLocale,
    getLanguages,
    locale,
    locales,
  }
}
