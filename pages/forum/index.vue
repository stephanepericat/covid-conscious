<template>
  <div class="sf-index-page">
    <div class="sf-index-page__header">
      <h1
        class="sf-index-page__title"
        v-text="$t('forum.latest.title')"
      />
      <div class="sf-index-page__header--actions">
        <template v-if="isLoggedIn">
          <IButton class="sf-index-page__header--actions-button" :to="localePath(`/${FORUM}/my-posts`)">
            <template #icon>
              <Icon name="material-symbols:folder-managed-outline-rounded" />
            </template>
            {{ $t('forum.nav.my.posts') }}
          </IButton>
          <IButton class="sf-index-page__header--actions-button" :to="localePath(`/${FORUM}/create`)">
            <template #icon>
              <Icon name="material-symbols:ink-pen-rounded" />
            </template>
            {{ $t('forum.nav.create') }}
          </IButton>
        </template>
        <IButton v-else class="sf-index-page__header--actions-button" :to="localePath(`/login`)">
          <template #icon>
            <Icon name="material-symbols:login" />
          </template>
          {{ $t('forum.account.signIn') }}
        </IButton>
      </div>
    </div>
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
  import { FORUM } from '~/assets/constants/types'

  const user = useSupabaseUser()
  const isLoggedIn = computed(() => !!user?.value?.id)

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

  umTrackView()
</script>
<style lang="scss" scoped>
@import "~/assets/sass/mixins.scss";

.sf-index-page {
  &__header {
    display: flex;
    justify-content: space-between;

    &--actions {
      align-items: center;
      display: flex;

      &-button {
        margin-left: 10px;
      }
    }
  }
  
  &__title {
    @include title();
  }
}
</style>