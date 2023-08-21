<template>
  <div
    class="sf-post-list"
    :class="{ pending }"
  >
    <ILoader
      v-if="pending"
      class="sf-post-list__loader"
    />
    <template v-else>
      <p v-text="$t('supabase-forum.list.description', { start, end, total })" />
      <IListGroup
        size="sm"
        :border="false"
      >
        <IListGroupItem
          v-for="post in posts"
          :key="post.id"
        >
          <IMedia>
            <template #image>
              <img
                v-if="post.avatar"
                class="sf-post-list__thumbnail"
                :src="post.avatar"
              >
              <div
                v-else
                class="sf-post-list__thumbnail--fallback"
              >
                <Icon
                  class="sf-post-list__thumbnail--fallback-icon"
                  name="material-symbols:account-circle-full"
                />
              </div>
            </template>
            <h3 class="sf-post-list__link">
              <NuxtLink :to="localePath(`${rootPath}/post/${post.id}`)">
                {{ post.headline }}
              </NuxtLink>
            </h3>
            <em>
              <span>{{ $t(`supabase-forum.create.categories.${post.topic}`) }} &bullet; </span>
              <span><NuxtLink :to="localePath(`${rootPath}/user/${post.profiles.id}`)">{{ post.profiles.username }}</NuxtLink> &bullet; </span>
              <span>{{ format(new Date(post.created_at), DEFAULT_DATE_FORMAT) }}</span>
            </em>
          </IMedia>
        </IListGroupItem>
      </IListGroup>
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
  import { format } from 'date-fns'
  import { usePagination } from '~/assets/composables/usePagination'
  import { DEFAULT_DATE_FORMAT } from '~/assets/constants/date-formats'

  const emit = defineEmits(['page-change'])

  const props = defineProps({
    pending: Boolean,
    posts: { type: Array, default: () => [] },
    totalItems: { type: Number, default: 0 },
  })

  const { totalItems: total } = toRefs(props)

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
</script>
<style lang="scss" scoped>
@import "~/assets/sass/mixins.scss";

.sf-post-list {
  &.pending {
    @include pending();
  }

  &__title {
    margin-bottom: 30px;
  }

  &__loader {
    @include loader();
  }

  &__link {
    @include titleLink();
  }

  &__thumbnail {
    @include thumbnail($dimension: 80px);
  }

  &__pagination {
    @include pagination();
  }
}
</style>