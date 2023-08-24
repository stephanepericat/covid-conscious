<template>
  <div
    class="review-list"
    :class="{ pending }"
  >
    <ILoader
      v-if="pending"
      class="review-list__loader"
    />
    <p v-else-if="!pending && !total" v-text="$t('reviews.noReviews')" />
    <template v-else>
      <p v-text="$t('reviews.list.description', { start, end, total })" />
      <IListGroup
        size="sm"
        :border="false"
      >
        <IListGroupItem
          v-for="review in reviews"
          :key="review.id"
        >
          <p
            class="review-list__body"
            v-text="review.body"
          />
          <em>
            <span><NuxtLink :to="localePath(`${rootPath}/user/${review.profiles.id}`)">{{ review.profiles.username }}</NuxtLink> &bullet; </span>
            <span>{{ format(new Date(review.created_at), DEFAULT_DATE_FORMAT) }}</span>
          </em>
        </IListGroupItem>
      </IListGroup>
      <IPagination
        v-model="currentPage"
        class="review-list__pagination"
        :items-total="total"
        :items-per-page="itemsPerPage"
      />
    </template>
  </div>
</template>
<script setup>
  import { format } from 'date-fns'
  import { usePagination } from '~/assets/composables/usePagination'
  import { useReviews } from '~/assets/composables/useReviews'
  import { DEFAULT_DATE_FORMAT } from '~/assets/constants/date-formats'

  const props = defineProps({
    articleId: { type: String, default: null },
  })

  const config = useRuntimeConfig()
  const rootPath = computed(() => config.public.supabaseForum.rootPath)

  const { articleId } = toRefs(props)
  const total = ref(100) // TODO: get total count from db

  const { currentPage, itemsPerPage, startItem, endItem, setItemsPerPage } = usePagination()

  setItemsPerPage(10)

  const start = computed(() => startItem.value + 1)
  const end = computed(() => endItem.value > total.value ? total.value : endItem.value)

  const { getReviews, reviewsLoading } = useReviews()
  const pending = computed(() => !articleId.value || reviewsLoading.value)

  let reviews = ref([])

  watch([articleId, currentPage], async () => {
    if(!articleId.value) return

    reviews.value = await getReviews(articleId.value, startItem.value, endItem.value)
  }, { immediate: true })
</script>
<style lang="scss" scoped>
@import "~/assets/sass/mixins.scss";

.review-list {
  &.pending {
    @include pending();
  }

  &__title {
    margin-bottom: 30px;
  }

  &__loader {
    @include loader();
  }

  &__body {
    font-size: .9rem;
    margin-bottom: 5px;
  }

  &__pagination {
    @include pagination();
  }
}
</style>