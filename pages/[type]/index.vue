<template>
  <div class="type-page" :class="{ pending, type }">
    <ILoader v-if="pending" class="type-page__loader" />
    <NotFound v-else-if="!pending && !results.length" :category="localeType" />
    <template v-else>
      <h1 class="type-page__title" v-text="localeType" />
      <div class="type-page__filters">
        <IForm class="type-page__filters--form">
          <div class="type-page__filters--form-actions">
            <ISelect
              class="type-page__filters--select"
              v-model="selectedCategory"
              :options="filterCategories"
              :placeholder="$t('list.filters.selectCategory')"
            />
            <template v-if="isCommunity(type)">
              <ISelect
                class="type-page__filters--select"
                v-model="selectedCountry"
                :options="filterCountries"
                :placeholder="$t('list.filters.selectCountry')"
              />
              <ISelect
                class="type-page__filters--select"
                v-model="selectedCity"
                :disabled="!selectedCountry"
                :options="filterCities"
                :placeholder="$t('list.filters.selectCity')"
              />
            </template>
            <ISelect
              v-if="isLibrary(type) || isNews(type)"
              class="type-page__filters--select"
              v-model="selectedSource"
              :options="filterSources"
              :placeholder="$t('list.filters.selectSource')"
            />
            <ISelect
              v-if="isLibrary(type)"
              class="type-page__filters--select"
              v-model="selectedLanguage"
              :options="filterLanguages"
              :placeholder="$t('list.filters.selectLanguage')"
            />
          </div>
          <IButton @click="clearFilters">
            <Icon name="carbon:reset" />
            <span class="type-page__filters--form-reset">{{ $t('list.filters.reset') }}</span>
          </IButton>
        </IForm>
      </div>
      <IListGroup size="sm" :border="false">
        <IListGroupItem v-for="article in visibleItems">
          <IMedia>
            <template #image>
              <SanityImage
                v-if="article.thumbnail"
                :asset-id="article.thumbnail"
                fit="crop"
                crop="entropy"
                :h="80"
                :w="80"
              />
              <div v-else class="type-page__thumbnail--fallback">
                <Icon class="type-page__thumbnail--fallback-icon" name="material-symbols:broken-image-outline" />
              </div>
            </template>
            <h3
              class="type-page__link"
            >
              <NuxtLink
                :to="isExternalLink(article.type) ? article.link : localePath(article.path)"
                :target="isExternalLink(article.type) ? '_blank' : '_self'"
              >
                <span v-if="isNews(article.type) || isLibrary(article.type)">{{ article.source }}: </span>{{ article.title }}
              </NuxtLink>
            </h3>
            <p
              v-if="(isResource(article.type) || isLibrary(article.type)) && article.description"
              class="type-page__description"
              :class="{ 'no-margin': isLibrary(article.type) }"
            >
              {{ article.description }}
            </p>
            <em v-if="!isResource(article.type)">
              <span>{{ article.category }}</span>
              <span> &bullet; <NuxtLink :to="localePath(`/${AUTHOR}/${article.author.slug}`)">{{ article.author.nickname }}</NuxtLink></span>
              <span> &bullet; {{ format(new Date(article.date ? `${article.date}T12:00:01Z` : article.published), DEFAULT_DATE_FORMAT) }}</span>
            </em>
          </IMedia>
        </IListGroupItem>
      </IListGroup>
      <IPagination v-model="currentPage" class="type-page__pagination" :items-total="totalItems" :items-per-page="itemsPerPage" />
    </template>
  </div>
</template>
<script setup>
  import { format } from 'date-fns'
  import _ from 'lodash'
  import publicationsByTypeQuery from '~/sanity/publicationsByType.sanity'
  import { AUTHOR, COMMUNITY, LIBRARY, LINK, NEWS } from '~/assets/constants/types'
  import { useLanguages } from '~/assets/composables/useLanguages'
  import { usePagination } from '~/assets/composables/usePagination'
  import { DEFAULT_DATE_FORMAT } from '~/assets/constants/date-formats'
  import { isCommunity, isExternalLink, isLibrary, isNews, isResource } from '~/assets/utils/article-types'

  const { locale, t } = useI18n()
  const { getLanguages } = useLanguages()
  const { params } = useRoute()
  const { type } = params
  const localePath = useLocalePath()
  const localeType = computed(() => t(`layout.${type}`))

  useHead({
    meta: [
      { name: 'description', content: t('list.description') },
    ],
    title: t('list.typeTitle', { type: localeType.value })
  })

  const { currentPage, itemsPerPage, startItem, endItem } = usePagination()

  const articleType = computed(() => type === NEWS ? LINK : type)
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
    if(type !== COMMUNITY) return []

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
    if(type !== COMMUNITY || !selectedCountry.value) return []

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
    if(type !== LIBRARY) return [];

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

  const clearFilters = () => {
    selectedCategory.value = null
    selectedCity.value = null
    selectedCountry.value = null
    selectedLanguage.value = null
    selectedSource.value = null
  }
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

  &__description {
    &.no-margin {
      margin: 0;
    }
  }

  &__loader {
    @include loader();
  }

  &__link {
    @include titleLink();

    margin-bottom: 5px;
  }

  &__thumbnail {
    @include thumbnail();
  }

  &__pagination {
    @include pagination();
  }

  &__filters {
    margin-bottom: 20px;

    &--form {
      display: flex;
      justify-content: space-between;

      &-actions {
        display: flex;
      }

      &-reset {
        margin-left: 5px;
      }
    }

    &--select {
      margin-right: 25px;
      min-width: 230px;
    }

    @include breakpoint-down('md') {
      &--form {
        flex-direction: column;

        &-actions {
          flex-direction: column;
        }
      }

      &--select {
        margin-right: 0;
        margin-bottom: 20px;
      }
    }
  }
}
</style>