<template>
  <div class="type-page" :class="{ pending, type }">
    <ILoader v-if="pending" class="type-page__loader" />
    <NotFound v-else-if="!pending && !results.length" :category="localeType" />
    <template v-else>
      <h1 class="type-page__title" v-text="localeType" />
      <PublicationFilters
        :categories="filterCategories"
        :cities="filterCities"
        :content-types="filterContentTypes"
        :countries="filterCountries"
        :languages="filterLanguages"
        :sources="filterSources"
        :type="type"
        v-model:online-only="onlineOnly"
        v-model:selected-category="selectedCategory"
        v-model:selected-city="selectedCity"
        v-model:selected-content-type="selectedContentType"
        v-model:selected-country="selectedCountry"
        v-model:selected-language="selectedLanguage"
        v-model:selected-source="selectedSource"
      />
      <div v-if="showInstructions" class="type-page__instructions">
        <Icon name="material-symbols:person-search-rounded" size="100" />
        <p class="type-page__instructions--message">{{ t('directory.instructions') }}</p>
      </div>
      <template v-else>
        <div v-if="isDirectory(type)" class="type-page__results">
          {{ t('directory.results', { totalItems }) }}
        </div>
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
  import publicationsByTypeQuery from '~/sanity/queries/publicationsByType.sanity'
  import { useLanguages } from '~/assets/composables/useLanguages'
  import { usePagination } from '~/assets/composables/usePagination'
  import { isCovidnet, isDirectory, isHealth, isLibrary, isNews, isResource, isVideo } from '~/assets/utils/article-types'
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

  const onlineOnly = ref(false)

  // FILTERS
  const filterCategories = computed(() => {
    return _.sortBy(
      _.uniqBy(
        results
          .value
          .filter((result) => {
            if(!onlineOnly.value) return true
            return result.onlineOnly === onlineOnly.value
          })
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
        matches
          .filter(({ countryCode }) => countryCode !== null)
          .map(({ countryCode, countryName }) => ({ label: countryName, id: countryCode })),
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
    if(!isLibrary(type) && !isNews(type) && !isHealth(type)) return [];

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

  const filterContentTypes = computed(() => {
    if(!isCovidnet(type)) return [];
    const contentTypes = results.value.map((r) => r.contentType)

    return _.sortBy(
      _.uniqBy(
        contentTypes.map((type) => ({ label: t(`covidnet.types.${type.toLowerCase()}`), id: type })),
        'id'
      ),
    'label')
  });
  const selectedContentType = ref(null)

  const filterLanguages = computed(() => {
    if(!isLibrary(type) && !isNews(type) && !isHealth(type) && !isCovidnet(type) && !isVideo(type) && !isResource(type)) return [];

    const articles = selectedSource.value
      ? results.value.filter((r) => r.source === selectedSource.value)
      : selectedContentType.value
          ? results.value.filter((r) => r.contentType === selectedContentType.value)
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
      !selectedContentType.value &&
      !selectedLanguage.value &&
      !selectedSource.value &&
      !onlineOnly.value
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

    if(isCovidnet(type) && selectedContentType.value) {
      items = items.filter((result) => result.contentType === selectedContentType.value)
    }

    if(selectedLanguage.value) {
      items = items.filter((result) => result.language === selectedLanguage.value)
    }

    if(selectedSource.value) {
      items = items.filter((result) => result.source === selectedSource.value)
    }

    if(onlineOnly.value) {
      items = items.filter((result) => result.onlineOnly === onlineOnly.value)
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

    &--message {
      margin-top: 20px;
    }
  }

  &__results {
    @include eyebrow();

    font-size: 14px;
    font-weight: 600;
    padding: 10px 0;
  }
}
</style>