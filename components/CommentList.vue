<template>
  <div
    class="sf-comment-list"
    :class="{ pending }"
  >
    <ILoader
      v-if="pending"
      class="sf-comment-list__loader"
    />
    <p v-else-if="!pending && !totalItems" v-text="$t('forum.comments.noComments')" />
    <template v-else>
      <p v-text="$t('forum.comments.description', { start, end, total })" />
      <IListGroup
        size="sm"
        :border="false"
      >
        <IListGroupItem
          v-for="comment in comments"
          class="sf-comment-list__item"
          :key="comment.id"
        >
          <div class="sf-comment-list__item--contents">
            <p
              class="sf-comment-list__body"
              v-text="comment.content"
            />
            <nav class="sf-comment-list__actions">
              <a
                v-if="showDeleteAction(comment.author.id)"
                href="#"
                @click="(e) => onDeleteComment(e, comment)"
              >
                {{ $t('forum.comments.delete') }}
              </a>
              <!-- <span v-if="showDeleteAction(comment.profiles.id)">&bull;&nbsp;</span>
              <a href="#">Report</a> -->
            </nav>
          </div>
          <em>
            <span><NuxtLink :to="localePath(`${rootPath}/user/${comment.author.id}`)">@{{ comment.author.profile.name }}</NuxtLink> &bullet; </span>
            <span>{{ format(new Date(comment.createdAt), DEFAULT_DATE_FORMAT) }}</span>
          </em>
        </IListGroupItem>
      </IListGroup>
      <IPagination
        v-model="currentPage"
        class="sf-comment-list__pagination"
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
  import { usePrisma } from '~/assets/composables/usePrisma'

  const emit = defineEmits(['page-change', 'delete-comment'])
  // const user = useSupabaseUser()
  const { getUser } = usePrisma()
  const { user } = useUserSession()
  const userInfo = computedAsync(
    async () =>
      user?.value?.email ? await getUser(user.value.email) : null,
    null,
  )

  const props = defineProps({
    comments: { type: Array, default: () => [] },
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

  const showDeleteAction = (userId) => userInfo.value && userId === userInfo.value.id

  const onDeleteComment = (e, comment) => {
    e.preventDefault()
    emit('delete-comment', comment)
  }

  watch(activePage, () => {
    if(activePage.value !== currentPage.value) {
      currentPage.value = activePage.value
    }
  })
</script>
<style lang="scss" scoped>
@import "~/assets/sass/mixins.scss";

.sf-comment-list {
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
    flex-grow: 1;
    font-size: .9rem;
    margin-bottom: 5px;
  }

  &__pagination {
    @include pagination();
  }

  &__item {
    &--contents {
      display: flex;
    }
  }

  &__actions {
    margin-left: 10px;
    flex-shrink: 0;
  }
}
</style>