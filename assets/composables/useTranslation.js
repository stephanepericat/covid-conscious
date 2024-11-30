export const useTranslation = () => {
  const translateText = async (text, locale) => {
    try {
      const { data, error } = await useFetch('/api/translate', {
        body: { text, locale },
        method: 'post',
      })
      if (error.value) throw error.value
      return data?.value || null
    } catch (e) {
      throw e
    }
  }

  return {
    translateText,
  }
}
