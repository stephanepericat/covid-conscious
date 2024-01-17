<template>
  <div class="publication-filters">
    <IForm class="publication-filters--form">
      <div class="publication-filters--form-actions">
        <ISelect
          v-if="!isTag(type) && !isSearch(type)"
          class="publication-filters--select"
          v-model="selectedCategory"
          :options="categories"
          :placeholder="$t('list.filters.selectCategory')"
        />
        <template v-if="isCommunity(type)">
          <ISelect
            class="publication-filters--select"
            v-model="selectedCountry"
            :options="countries"
            :placeholder="$t('list.filters.selectCountry')"
          />
          <ISelect
            class="publication-filters--select"
            v-model="selectedCity"
            :disabled="!selectedCountry"
            :options="cities"
            :placeholder="$t('list.filters.selectCity')"
          />
        </template>
        <template v-if="isLibrary(type) || isNews(type)">
          <ISelect
            class="publication-filters--select"
            v-model="selectedSource"
            :options="sources"
            :placeholder="$t('list.filters.selectSource')"
          />
          <ISelect
            class="publication-filters--select"
            v-model="selectedLanguage"
            :options="languages"
            :placeholder="$t('list.filters.selectLanguage')"
          />
        </template>
        <template v-if="isTag(type) || isSearch(type)">
          <ISelect
            class="publication-filters--select"
            v-model="selectedContentType"
            :options="contentTypes"
            :placeholder="$t('list.filters.selectContentType')"
          />
          <ISelect
            class="publication-filters--select"
            v-model="selectedLanguage"
            :options="languages"
            :placeholder="$t('list.filters.selectLanguage')"
          />
        </template>
      </div>
      <IButton @click="clearFilters">
        <Icon name="carbon:reset" />
        <span class="publication-filters--form-reset">{{ $t('list.filters.reset') }}</span>
      </IButton>
    </IForm>
  </div>
</template>
<script setup>
  import { isCommunity, isLibrary, isNews, isSearch, isTag } from '~/assets/utils/article-types'

  const props = defineProps({
    categories: { type: Array, default: [] },
    cities: { type: Array, default: [] },
    contentTypes: { type: Array, default: [] },
    countries: { type: Array, default: [] },
    languages: { type: Array, default: [] },
    sources: { type: Array, default: [] },
    type: { type: String, required: true },
  })

  const selectedCategory = defineModel('selectedCategory')
  const selectedCity = defineModel('selectedCity')
  const selectedContentType = defineModel('selectedContentType')
  const selectedCountry = defineModel('selectedCountry')
  const selectedLanguage = defineModel('selectedLanguage')
  const selectedSource = defineModel('selectedSource')

  const clearFilters = () => {
    selectedCategory.value = null
    selectedCity.value = null
    selectedContentType.value = null
    selectedCountry.value = null
    selectedLanguage.value = null
    selectedSource.value = null
  }
</script>
<style lang="scss" scoped>
@import '@inkline/inkline/css/mixins';

.publication-filters {
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
</style>