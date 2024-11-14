<template>
  <div
    class="review-list"
  >
    <ILoader
      v-if="pending"
      class="review-list__loader"
    />
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
            v-text="review.content"
          />
          <ClientOnly>
            <StarRating
              :rating="review.rating"
              read-only
              :show-rating="false"
              :star-size="12"
            />
          </ClientOnly>
          <em>
            <span><NuxtLink :to="localePath(`${rootPath}/user/${review.author.id}`)">@{{ review.author.profile.name }}</NuxtLink> &bullet; </span>
            <span>{{ format(new Date(review.updatedAt), DEFAULT_DATE_FORMAT) }}</span>
            <span v-if="review.updatedAt > review.createdAt"> &bullet; {{ $t('reviews.edited') }}</span>
          </em>
        </IListGroupItem>
      </IListGroup>
      <IPagination
        v-model="currentPage"
        class="review-list__pagination"
        :items-total="total"
        :items-per-page="itemsPerPage"
        @update:modelValue="onPageChange"
      />
    </template>
  </div>
</template>
<script setup>
  import { format } from 'date-fns'
  import { usePagination } from '~/assets/composables/usePagination'
  import { DEFAULT_DATE_FORMAT } from '~/assets/constants/date-formats'

  const emit = defineEmits(['page-change'])

  const props = defineProps({
    reviews: { type: Array, default: () => [] },
    page: { type: Number, default: 1 },
    pending: Boolean,
    totalItems: { type: Number, default: 0 },
  })

  const { page: activePage, totalItems: total } = toRefs(props)

  const config = useRuntimeConfig()
  const rootPath = computed(() => config.public.supabaseForum.rootPath)

  const { currentPage, itemsPerPage, startItem, endItem } = usePagination()

  const start = computed(() => startItem.value + 1)
  const end = computed(() => endItem.value > total.value ? total.value : endItem.value)

  const onPageChange = () => emit('page-change', {
    currentPage: currentPage.value,
    endItem: endItem.value,
    startItem: startItem.value,
  })

  watch(activePage, () => {
    if(activePage.value !== currentPage.value) {
      console.log(activePage.value, currentPage.value)
      currentPage.value = activePage.value
    }
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
    display: flex;
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