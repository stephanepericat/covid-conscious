<template>
  <div class="sf-post-list">
    <ILoader v-if="pending" class="sf-post-list__loader" />
    <template v-else>
      <p v-text="$t('forum.list.description', { start, end, total })" />
      <ForumList :posts="posts" :root-path="rootPath" :ssr="isSSR" />
      <IPagination
        v-model="currentPage"
        class="sf-post-list__pagination"
        :items-total="totalItems"
        :items-per-page="itemsPerPage"
        @update:modelValue="onPageChange"
      />
    </template>
  </div>
</template>
<script setup>
import { usePagination } from '~/assets/composables/usePagination'
import ForumList from '~/components/ForumList.vue'

const emit = defineEmits(['page-change'])

const props = defineProps({
  pending: Boolean,
  posts: { type: Array, default: () => [] },
  totalItems: { type: Number, default: 0 },
})

const { totalItems: total } = toRefs(props)

const config = useRuntimeConfig()
const rootPath = computed(() => config.public.forum.rootPath)
const isSSR = computed(() => !import.meta.client)

const { currentPage, itemsPerPage, startItem, endItem } = usePagination()
const start = computed(() => startItem.value + 1)
const end = computed(() =>
  endItem.value > total.value ? total.value : endItem.value,
)

const onPageChange = () =>
  emit('page-change', {
    currentPage: currentPage.value,
    endItem: endItem.value,
    startItem: startItem.value,
  })
</script>
<style lang="scss" scoped>
@import '~/assets/sass/mixins.scss';

.sf-post-list {
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

  &__pagination {
    @include pagination();
  }
}
</style>
