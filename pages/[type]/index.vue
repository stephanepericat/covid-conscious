<template>
  <div class="type-page" :class="{ pending, type }">
    <ILoader v-if="pending" class="type-page__loader" />
    <NotFound v-else-if="!pending && !results.length" :category="localeType" />
    <template v-else>
      <h1 class="type-page__title" v-text="localeType" />
      <PublicationFilters
        :categories="filterCategories"
        :cities="filterCities"
        :countries="filterCountries"
        :languages="filterLanguages"
        :sources="filterSources"
        :type="type"
        v-model:selected-category="selectedCategory"
        v-model:selected-city="selectedCity"
        v-model:selected-country="selectedCountry"
        v-model:selected-language="selectedLanguage"
        v-model:selected-source="selectedSource"
      />
      <div v-if="showInstructions" class="type-page__instructions">
        <Icon name="material-symbols:person-search-rounded" size="100" />
        <p class="type-page__instructions--message">{{ t('directory.instructions') }}</p>
      </div>
      <template v-else>
        <div v-if="isDirectory(type)">{{ t('directory.results', { totalItems }) }}</div>
        <PublicationList
          :hide-thumbnail="isResource(type) && $appSettings.HIDE_RESOURCES_THUMBNAIL"
          :items="visibleItems"
          :items-per-page="itemsPerPage"
          :total="totalItems"
          with-pagination
          v-model:current-page="currentPage"
        />
      </template>
    </template>
  </div>
</template>
<script setup>
  import _ from 'lodash'
  import publicationsByTypeQuery from '~/sanity/publicationsByType.sanity'
  import { useLanguages } from '~/assets/composables/useLanguages'
  import { usePagination } from '~/assets/composables/usePagination'
  import { isDirectory, isLibrary, isNews, isResource } from '~/assets/utils/article-types'
  import PublicationFilters from '~/components/PublicationFilters.vue'
  import PublicationList from '~/components/PublicationList.vue'

  const { $appSettings } = useNuxtApp()
  const { locale, t } = useI18n()
  const { getLanguages } = useLanguages()
  const { params } = useRoute()
  const { type } = params
  const localeType = computed(() => t(`layout.${type}`))

  useHead({
    meta: [
      { name: 'description', content: t('list.description') },
    ],
    title: t('list.typeTitle', { type: localeType.value })
  })

  const { currentPage, itemsPerPage, startItem, endItem } = usePagination()

  const articleType = computed(() => type)
  const { data, pending } = useLazySanityQuery(publicationsByTypeQuery, { locale, articleType: articleType.value })
  const results = computed(() => data?.value?.results || [])

  // FILTERS
  const filterCategories = computed(() => {
    return _.sortBy(
      _.uniqBy(
        results
          .value
          .map(({ category, categoryUri }) => ({ label: category, id: categoryUri })),
      'id'),
    'label')
  })
  const selectedCategory = ref(null)

  const filterCountries = computed(() => {
    if(!isDirectory(type)) return []

    const matches = selectedCategory.value
      ? results.value.filter((result) => result.categoryUri === selectedCategory.value)
      : results.value

    return _.sortBy(
      _.uniqBy(
        matches.map(({ countryCode, countryName }) => ({ label: countryName, id: countryCode })),
        'id'
      ),
    'label')
  })

  const selectedCountry = ref(null)

  const filterCities = computed(() => {
    if(!isDirectory(type) || !selectedCountry.value) return []

    const matches = results.value.filter((result) => result.countryCode === selectedCountry.value)

    return _.sortBy(
      _.uniqBy(
        matches.map(({ city }) => ({ label: city, id: city })),
        'id'
      ),
    'label')
  })

  const selectedCity = ref(null)

  const filterSources = computed(() => {
    if(!isLibrary(type) && !isNews(type)) return [];

    const matches = selectedCategory.value
      ? results.value.filter((r) => r.categoryUri === selectedCategory.value)
      : results.value

    return _.sortBy(
      _.uniqBy(
        matches.map(({ source }) => ({ label: source, id: source })),
        'id'
      ),
    'label')
  });

  const selectedSource = ref(null)

  const filterLanguages = computed(() => {
    if(!isLibrary(type) && !isNews(type)) return [];

    const articles = selectedSource.value
      ? results.value.filter((r) => r.source === selectedSource.value)
      : results.value
    const codes = articles.filter((r) => !!r.language).map((r) => r.language)
    const matches = getLanguages(codes)

    return _.sortBy(
      _.uniqBy(
        matches.map(({ code, name }) => ({ label: name, id: code })),
        'id'
      ),
    'label')
  });

  const selectedLanguage = ref(null)

  const matches = computed(() => {
    let items = [...results.value]

    if(
      !selectedCategory.value &&
      !selectedCountry.value &&
      !selectedCity.value &&
      !selectedLanguage.value &&
      !selectedSource.value
    ) {
      return items
    }

    if(selectedCategory.value) {
      items = items.filter((result) => result.categoryUri === selectedCategory.value)
    }

    if(selectedCountry.value) {
      items = items.filter((result) => result.countryCode === selectedCountry.value)
    }

    if(selectedCity.value) {
      items = items.filter((result) => result.city === selectedCity.value)
    }

    if(selectedLanguage.value) {
      items = items.filter((result) => result.language === selectedLanguage.value)
    }

    if(selectedSource.value) {
      items = items.filter((result) => result.source === selectedSource.value)
    }

    return items
  })
  const totalItems = computed(() => matches.value.length || 0)
  const visibleItems = computed(() => matches.value.slice(startItem.value, endItem.value))

  const showInstructions = computed(() => {
    if(!isDirectory(articleType.value)) {
      return false
    }

    return !selectedCategory.value && !selectedCountry.value
  })

  umTrackView()
</script>
<style lang="scss" scoped>
@import '@inkline/inkline/css/mixins';
@import "~/assets/sass/mixins.scss";

.type-page {
  &.pending {
    @include pending();
  }

  &__title {
    @include title();
    margin-bottom: 30px;
  }

  &__loader {
    @include loader();
  }

  &__instructions {
    align-items: center;
    display: flex;
    flex-direction: column;
    padding-top: 40px;
  }
}
</style>