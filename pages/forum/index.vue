<template>
  <div class="sf-index-page">
    <h1
      class="sf-index-page__title"
      v-text="$t('supabase-forum.latest.title')"
    />
    <PostList
      :pending="loading"
      :posts="posts"
      :total-items="total"
      @page-change="onPageChange"
    />
  </div>
</template>
<script setup>
  import PostList from '~/components/PostList.vue'
  import { usePosts } from '~/assets/composables/usePosts'

  const {
    getPosts,
    getTotalCount,
    loading,
  } = usePosts()

  const total = await getTotalCount()
  const posts = ref(null)

  const onPageChange = async ({ endItem, startItem }) => {
    posts.value = await getPosts(startItem, endItem - 1)
  }

  // get initial set of results on load
  onPageChange({ startItem: 0, endItem: 4 })
</script>
<style lang="scss" scoped>
@import "~/assets/sass/mixins.scss";

.sf-index-page {
  &__title {
    @include title();
  }
}
</style>