<template>
  <div class="sf-index-page">
    <div class="sf-index-page__header">
      <h1 class="sf-index-page__title" v-text="$t('forum.latest.title')" />
      <div class="sf-index-page__header--actions">
        <template v-if="isLoggedIn">
          <IButton
            class="sf-index-page__header--actions-button"
            :to="localePath(`/${FORUM}/my-posts`)"
          >
            <template #icon>
              <Icon name="material-symbols:folder-managed-outline-rounded" />
            </template>
            {{ $t('forum.nav.my.posts') }}
          </IButton>
          <IButton
            class="sf-index-page__header--actions-button"
            :to="localePath(`/${FORUM}/create`)"
          >
            <template #icon>
              <Icon name="material-symbols:ink-pen-rounded" />
            </template>
            {{ $t('forum.nav.create') }}
          </IButton>
        </template>
        <IButton
          v-else
          class="sf-index-page__header--actions-button"
          :to="localePath(`/login`)"
        >
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
import { usePrisma } from '~/assets/composables/usePrisma'
import { FORUM } from '~/assets/constants/types'

const { loggedIn: isLoggedIn } = useUserSession()

const { getPosts } = usePrisma()

const total = ref(0)
const posts = ref(null)
const loading = ref(false)

const onPageChange = async ({ endItem, startItem }) => {
  loading.value = true
  const results = await getPosts(startItem, endItem - 1)
  posts.value = results?.entries || []
  total.value = results?.total || 0
  loading.value = false
}

// get initial set of results on load
onPageChange({ startItem: 0, endItem: 4 })

umTrackView()
</script>
<style lang="scss" scoped>
@import '~/assets/sass/mixins.scss';

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
