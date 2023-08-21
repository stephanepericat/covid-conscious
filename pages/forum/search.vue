<template>
  <PageShell class="sf-search-page">
    <h1
      class="sf-search-page__title"
      v-text="$t('supabase-forum.search.title')"
    />
    <p
      class="sf-search-page__description"
      v-text="$t('supabase-forum.search.description')"
    />
    <IForm>
      <IFormGroup>
        <IInput
          v-model="searchTerm"
          autofocus
          type="text"
          :placeholder="$t('supabase-forum.search.label')"
          @keyup="onSearch"
        />
      </IFormGroup>
    </IForm>
    <ILoader
      v-if="loading"
      class="sf-search-page__loader"
    />
    <section
      v-else-if="showResults"
      class="sf-search-page__results"
    >
      <p v-if="total === 0">
        No Results
      </p>
      <PostList
        v-else
        :pending="loading"
        :posts="visibleItems"
        :total-items="total"
        @page-change="onPageChange"
      />
    </section>
  </PageShell>
</template>
<script setup>
  import { debounce } from 'debounce'
  import PageShell from '~/components/PageShell.vue'
  import PostList from '~/components/PostList.vue'
  import { usePosts } from '~/assets/composables/usePosts'

  const { loading, searchPosts } = usePosts()
  const results = ref(null)
  const searchTerm = ref(null)

  const end = ref(4)
  const page = ref(1)
  const start = ref(0)

  const showResults = computed(() => searchTerm.value?.length && !loading.value && results.value)

  const onSearch = debounce(async () => {
    if(!searchTerm.value.length) {
      results.value = null
      return
    }
    results.value = await searchPosts(searchTerm.value)
  }, 250)

  const total = computed(() => results.value?.length || 0)

  const visibleItems = computed(() => {
    if(!results.value) return []

    return results.value.slice(start.value, end.value)
  })

  const onPageChange = ({ currentPage, endItem, startItem }) => {
    page.value = currentPage
    start.value = startItem
    end.value = endItem
  }
</script>
<style lang="scss" scoped>
@import "~/assets/sass/mixins.scss";

.sf-search-page {
  &__title {
    @include title();
  }

  &__loader {
    @include loader();
    width: 100%;
  }

  &__results {
    margin-top: 30px;
  }
}
</style>